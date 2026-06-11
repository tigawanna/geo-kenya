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
import { Camera, GeoJSONSource, Layer, Map, type CameraRef } from "@maplibre/maplibre-react-native";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useTheme } from "react-native-paper";

interface WardWithNeighborsMapProps {
  wardId?: number;
  onMapPress?: (coords: { lat: number; lng: number }) => void;
  fillHeight?: boolean;
}

function bboxFromWardFields(ward: {
  minX?: number | null;
  minY?: number | null;
  maxX?: number | null;
  maxY?: number | null;
}): [number, number, number, number] | null {
  const { minX, minY, maxX, maxY } = ward;
  if (
    minX == null ||
    minY == null ||
    maxX == null ||
    maxY == null ||
    !Number.isFinite(minX) ||
    !Number.isFinite(minY) ||
    !Number.isFinite(maxX) ||
    !Number.isFinite(maxY)
  ) {
    return null;
  }

  return [minX, minY, maxX, maxY];
}

function cameraFromBBox(bbox: [number, number, number, number]) {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;
  const maxDelta = Math.max(maxLat - minLat, maxLng - minLng);

  let zoom = 12;
  if (maxDelta > 0.1) zoom = 10;
  if (maxDelta > 0.25) zoom = 9;
  if (maxDelta > 0.5) zoom = 8;
  if (maxDelta > 1) zoom = 7;
  if (maxDelta > 2) zoom = 6;

  return {
    center: [centerLng, centerLat] as [number, number],
    zoom,
  };
}

export function WardWithNeighborsMap({
  wardId,
  onMapPress,
  fillHeight = false,
}: WardWithNeighborsMapProps) {
  const theme = useTheme();
  const colorScheme = normalizeMapColorScheme(useColorScheme());
  const { preset, setPreset, isReady: basemapReady } = useMapBasemapPreference();
  const mapStyle = resolveMapStyle(preset, colorScheme);
  const mapStyleKey = `${preset}-${colorScheme}`;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapStyleFailed, setMapStyleFailed] = useState(false);
  const { location, manuallySetLocation } = useDeviceLocation();
  const router = useRouter();
  const pathname = usePathname();

  const cameraRef = useRef<CameraRef>(null);
  const cameraTargetRef = useRef<{ center: [number, number]; zoom: number } | null>(null);

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
  }, [mainWardData]);

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

  const applyCameraTarget = () => {
    const target = cameraTargetRef.current;
    if (!target || !mapLoaded) {
      return;
    }

    cameraRef.current?.easeTo({
      center: target.center,
      zoom: target.zoom,
      duration: 1000,
    });
  };

  useEffect(() => {
    setMapLoaded(false);
    setMapStyleFailed(false);
  }, [mapStyleKey]);

  useEffect(() => {
    if (allFeatures.length > 0) {
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
        cameraTargetRef.current = cameraFromBBox([minLng, minLat, maxLng, maxLat]);
        applyCameraTarget();
        return;
      }
    }

    const wardBbox = mainWardData?.result ? bboxFromWardFields(mainWardData.result) : null;
    if (wardBbox) {
      cameraTargetRef.current = cameraFromBBox(wardBbox);
      applyCameraTarget();
      return;
    }

    cameraTargetRef.current = {
      center: KENYA_CENTER,
      zoom: KENYA_DEFAULT_ZOOM,
    };
    applyCameraTarget();
  }, [allFeatures, mainWardData, mapLoaded]);

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
    <View style={[styles.container, fillHeight && styles.containerFill]}>
      {(isPending || !basemapReady) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            {!basemapReady ? "Loading map…" : "Finding wards..."}
          </Text>
        </View>
      )}

      {mapStyleFailed ? (
        <View style={styles.errorBanner}>
          <Text variant="bodySmall" style={{ color: theme.colors.onErrorContainer }}>
            Map tiles failed to load. Check your internet connection.
          </Text>
        </View>
      ) : null}

      {basemapReady ? (
        <Map
          key={mapStyleKey}
          style={styles.map}
          mapStyle={mapStyle}
          touchZoom
          dragPan
          doubleTapZoom
          androidView={Platform.OS === "android" ? "texture" : undefined}
          onPress={handleMapPress}
          onDidFinishLoadingMap={() => {
            setMapLoaded(true);
            setMapStyleFailed(false);
          }}
          onDidFailLoadingMap={() => setMapStyleFailed(true)}>
          <Camera
            ref={cameraRef}
            initialViewState={{ center: KENYA_CENTER, zoom: KENYA_DEFAULT_ZOOM }}
          />

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
                  "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
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
        <View style={styles.mapToggleContainer} pointerEvents="box-none">
          <MapBasemapToggle preset={preset} onPresetChange={setPreset} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 360,
    width: "100%",
    overflow: "hidden",
  },
  containerFill: {
    flex: 1,
    height: undefined,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  mapToggleContainer: {
    position: "absolute",
    top: 12,
    right: 12,
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
  errorBanner: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    zIndex: 15,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 235, 238, 0.95)",
  },
});
