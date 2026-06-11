import {
  getClosestWardsByGeomQueryOptions,
  getWardByIdQueryOptions,
} from "@/data-access-layer/wards-query-options";
import { KENYA_CENTER, KENYA_DEFAULT_ZOOM } from "@/geo/kenya-bounds";
import { useDeviceLocation } from "@/hooks/use-device-location";
import { useMapBasemapPreference } from "@/hooks/use-map-basemap-preference";
import {
  calculateBBox,
  GeoJSONFeature,
  geomParse,
  isValidGeoJSONGeometry,
} from "@/lib/map-libre/geom-parse";
import { normalizeMapColorScheme, resolveMapStyle } from "@/lib/map-libre/map-style";
import { MapBasemapToggle } from "@/components/map/map-basemap-toggle";
import { Camera, GeoJSONSource, Layer, Map } from "@maplibre/maplibre-react-native";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

interface WardWithNeighborsMapProps {
  wardId?: number;
  onMapPress?: (coords: { lat: number; lng: number }) => void;
}

export function WardWithNeighborsMap({ wardId, onMapPress }: WardWithNeighborsMapProps) {
  const theme = useTheme();
  const colorScheme = normalizeMapColorScheme(useColorScheme());
  const { preset, setPreset, isReady: basemapReady } = useMapBasemapPreference();
  const mapStyle = resolveMapStyle(preset, colorScheme);
  const [isZooming, setIsZooming] = useState(false);
  const { location, manuallySetLocation } = useDeviceLocation();
  const router = useRouter();
  const pathname = usePathname();

  const [camera, setCamera] = useState({
    center: KENYA_CENTER,
    zoom: KENYA_DEFAULT_ZOOM,
    duration: 1000,
  });

  const { data: mainWardData, isPending: isMainWardPending } = useQuery({
    ...getWardByIdQueryOptions({ id: wardId! }),
    enabled: wardId !== undefined,
  });

  const { data: closestWardsData, isPending: isClosestWardsPending } = useQuery({
    ...getClosestWardsByGeomQueryOptions({ wardId: wardId! }),
    enabled: wardId !== undefined,
  });

  const mainWardFeature = useMemo(() => {
    if (!mainWardData?.result) return null;

    const geomStr = mainWardData.result.geom as string | undefined;
    const parsed = geomParse(geomStr);
    if (!parsed || !isValidGeoJSONGeometry(parsed)) {
      return null;
    }

    return {
      type: "Feature" as const,
      geometry: parsed,
      properties: {
        id: mainWardData.result.id,
        name: mainWardData.result.ward,
        type: "main",
      },
    };
  }, [mainWardData, wardId]);

  const closestWardFeatures = useMemo(() => {
    if (!closestWardsData?.results || !Array.isArray(closestWardsData.results)) return [];

    return closestWardsData.results
      .map((ward) => {
        const parsedGeom = geomParse(ward.geometry as string | undefined);
        if (!parsedGeom || !isValidGeoJSONGeometry(parsedGeom)) {
          return null;
        }
        return {
          type: "Feature" as const,
          geometry: parsedGeom,
          properties: {
            id: ward.id,
            name: ward.ward,
            type: "neighbor",
            distance: ward.distance,
          },
        } as const;
      })
      .filter((f) => f !== null);
  }, [closestWardsData]);

  const allFeatures = useMemo(() => {
    const features: GeoJSONFeature[] = [];
    if (mainWardFeature) features.push(mainWardFeature as GeoJSONFeature);
    features.push(...(closestWardFeatures as GeoJSONFeature[]));
    return features;
  }, [mainWardFeature, closestWardFeatures]);

  const wardsCollection = useMemo(
    (): GeoJSON.FeatureCollection => ({
      type: "FeatureCollection",
      features: allFeatures as GeoJSON.Feature[],
    }),
    [allFeatures],
  );

  useEffect(() => {
    if (allFeatures.length === 0) {
      setCamera({
        center: KENYA_CENTER,
        zoom: KENYA_DEFAULT_ZOOM,
        duration: 1000,
      });
      return;
    }

    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;

    allFeatures.forEach((feature) => {
      const bbox = calculateBBox(feature.geometry);
      if (bbox) {
        const [fMinLng, fMinLat, fMaxLng, fMaxLat] = bbox;
        minLng = Math.min(minLng, fMinLng);
        minLat = Math.min(minLat, fMinLat);
        maxLng = Math.max(maxLng, fMaxLng);
        maxLat = Math.max(maxLat, fMaxLat);
      }
    });

    if (isFinite(minLng) && isFinite(minLat) && isFinite(maxLng) && isFinite(maxLat)) {
      const centerLng = (minLng + maxLng) / 2;
      const centerLat = (minLat + maxLat) / 2;

      const latDelta = maxLat - minLat;
      const lngDelta = maxLng - minLng;
      const maxDelta = Math.max(latDelta, lngDelta);

      let zoom = 12;
      if (maxDelta > 0.1) zoom = 10;
      if (maxDelta > 0.25) zoom = 9;
      if (maxDelta > 0.5) zoom = 8;
      if (maxDelta > 1) zoom = 7;
      if (maxDelta > 2) zoom = 6;

      setCamera({
        center: [centerLng, centerLat],
        zoom,
        duration: 1000,
      });
      setIsZooming(true);
      setTimeout(() => setIsZooming(false), 1000);
    }
  }, [allFeatures]);

  const handleMapPress = (event: { coordinates?: { longitude: number; latitude: number } }) => {
    const lng = event.coordinates?.longitude;
    const lat = event.coordinates?.latitude;
    if (lng == null || lat == null) {
      return;
    }

    if (onMapPress) {
      onMapPress({ lat, lng });
    } else if (pathname.startsWith("/ward-by-id/") || pathname.startsWith("/ward-by-lat-long/")) {
      router.push(`/ward-by-lat-long/${lat},${lng}`);
    }
    manuallySetLocation(lat, lng);
  };

  const isPending = wardId !== undefined && (isMainWardPending || isClosestWardsPending);

  return (
    <View style={styles.container}>
      {(isPending || isZooming || !basemapReady) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            {!basemapReady ? "Loading map…" : isPending ? "Finding wards..." : "Zooming to wards..."}
          </Text>
        </View>
      )}

      {basemapReady ? (
        <Map style={styles.map} mapStyle={mapStyle} onPress={handleMapPress}>
          <Camera center={camera.center} zoom={camera.zoom} duration={camera.duration} />

          {wardsCollection.features.length > 0 ? (
            <GeoJSONSource id="all-wards" data={wardsCollection}>
              <Layer
                type="fill"
                id="wards-fill"
                paint={{
                  "fill-color": [
                    "match",
                    ["get", "type"],
                    "main",
                    theme.colors.errorContainer,
                    theme.colors.surfaceDisabled,
                  ],
                  "fill-opacity": ["match", ["get", "type"], "main", 0.35, 0.18],
                }}
              />
              <Layer
                type="line"
                id="wards-outline"
                paint={{
                  "line-color": [
                    "match",
                    ["get", "type"],
                    "main",
                    theme.colors.error,
                    theme.colors.onSurfaceDisabled,
                  ],
                  "line-width": ["match", ["get", "type"], "main", 4, 2],
                }}
              />
              <Layer
                type="symbol"
                id="wards-label"
                layout={{
                  "text-field": ["get", "name"],
                  "text-size": 14,
                  "text-anchor": "center",
                  "text-allow-overlap": false,
                }}
                paint={{
                  "text-color": theme.colors.onBackground,
                  "text-halo-color": theme.colors.background,
                  "text-halo-width": 2,
                }}
              />
            </GeoJSONSource>
          ) : null}

          {location ? (
            <GeoJSONSource
              id="user-location"
              data={{
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [location.coords.longitude, location.coords.latitude],
                    },
                    properties: { name: "Your Location" },
                  },
                ],
              }}>
              <Layer
                type="circle"
                id="user-location-dot"
                paint={{
                  "circle-radius": 8,
                  "circle-color": theme.colors.error,
                  "circle-stroke-width": 2,
                  "circle-stroke-color": theme.colors.surface,
                }}
              />
            </GeoJSONSource>
          ) : null}
        </Map>
      ) : null}

      {basemapReady ? (
        <View style={styles.mapOverlay} pointerEvents="box-none">
          <MapBasemapToggle preset={preset} onPresetChange={setPreset} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 400,
    maxHeight: "80%",
  },
  map: {
    flex: 1,
    height: "100%",
  },
  mapOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 20,
    elevation: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
