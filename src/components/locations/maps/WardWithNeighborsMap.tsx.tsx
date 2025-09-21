// components/locations/WardWithNeighborsMap.tsx
import { getClosestWardsByGeomQueryOptions, getWardByIdQueryOptions } from "@/data-access-layer/wards-query-options";
import {
  Camera,
  FillLayer,
  LineLayer,
  MapView,
  ShapeSource,
  SymbolLayer, // 👈 For labels
  VectorSource, // 👈 Import VectorSource
} from "@maplibre/maplibre-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";

import { calculateBBox, GeoJSONFeature, geomParse, isValidGeoJSONGeometry } from "@/lib/map-libre/geom-parse";
import { logger } from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { useAssets } from "expo-asset";
import countiesGeoJSON from "@/assets/counties.json";
interface WardWithNeighborsMapProps {
  wardId: number;
}

export function WardWithNeighborsMap({ wardId }: WardWithNeighborsMapProps) {
  const theme = useTheme();
  const [isZooming, setIsZooming] = useState(false);


  // const [assets, error] = useAssets([
  //   require("@/assets/counties.geojson")
  // ]);
  // const geojson = assets && assets?.[0];
  // logger.log("assets",geojson)
  // 👇 Camera state
  const [camera, setCamera] = useState({
    centerCoordinate: [36.8087, -1.1728] as [number, number],
    zoomLevel: 5,
    animationDuration: 2000,
  });

  // 👇 Fetch main ward
  const { data: mainWardData, isPending: isMainWardPending } = useQuery(
    getWardByIdQueryOptions({ id: wardId })
  );

  // 👇 Fetch closest wards
  const { data: closestWardsData, isPending: isClosestWardsPending } = useQuery(
    getClosestWardsByGeomQueryOptions({ wardId })
  );

  // 👇 Parse main ward geometry
  const mainWardFeature = React.useMemo(() => {
    if (!mainWardData?.result) return null;

    const geomStr = mainWardData.result.geom as string | undefined;
    const parsed = geomParse(geomStr);
    if (!parsed || !isValidGeoJSONGeometry(parsed)) {
      logger.warn("Invalid geometry for main ward:", wardId);
      return null;
    }

    return {
      type: "Feature" as const,
      geometry: parsed,
      properties: {
        id: mainWardData.result.id,
        name: mainWardData.result.ward,
        type: "main", // 👈 Flag for styling
      },
    };
  }, [mainWardData, wardId]);

  // 👇 Parse closest wards geometries
  const closestWardFeatures = React.useMemo(() => {
    if (!closestWardsData?.results || !Array.isArray(closestWardsData.results)) return [];

    return closestWardsData.results
      .map((ward) => {
        const parsedGeom = geomParse(ward.geometry as string | undefined);
        if (!parsedGeom || !isValidGeoJSONGeometry(parsedGeom)) {
          logger.warn("Invalid geometry for closest ward:", ward.id);
          return null;
        }
        return {
          type: "Feature" as const,
          geometry: parsedGeom,
          properties: {
            id: ward.id,
            name: ward.ward,
            type: "neighbor", // 👈 Flag for styling
            distance: ward.distance,
          },
        } as const
      })
      .filter(f => f !== null);
  }, [closestWardsData]);

  // 👇 Combine all features for bbox calculation
  const allFeatures = React.useMemo(() => {
    const features: GeoJSONFeature[] = [];
    if (mainWardFeature) features.push(mainWardFeature as any);
    features.push(...closestWardFeatures as any);
    return features;
  }, [mainWardFeature, closestWardFeatures]);

  // 👇 Auto-zoom to fit all wards
  useEffect(() => {
    if (allFeatures.length === 0) return;

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

      let zoomLevel = 12;
      if (maxDelta > 0.1) zoomLevel = 11;
      if (maxDelta > 0.25) zoomLevel = 10;
      if (maxDelta > 0.5) zoomLevel = 9;
      if (maxDelta > 1) zoomLevel = 8;
      if (maxDelta > 2) zoomLevel = 7;

      setCamera({
        centerCoordinate: [centerLng, centerLat],
        zoomLevel,
        animationDuration: 1000,
      });
      setIsZooming(true);
      setTimeout(() => setIsZooming(false), 1000);
    }
  }, [allFeatures]);

  const handleMapPress = (feature: GeoJSON.Feature) => {
      logger.log("Tapped ward:", feature);
  };

  const isPending = isMainWardPending || isClosestWardsPending;

  return (
    <View style={styles.container}>
      {(isPending || isZooming) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            {isPending ? "Finding wards..." : "Zooming to wards..."}
          </Text>
        </View>
      )}

      <MapView style={styles.map} onPress={handleMapPress}>
        <Camera
          zoomLevel={camera.zoomLevel}
          centerCoordinate={camera.centerCoordinate}
          animationDuration={camera.animationDuration}
        />

        {/* 1️⃣ Kenya Mask — dims the world outside Kenya */}
        <ShapeSource
          id="kenya-mask"
          shape={{
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [33.501, -5.202],
                  [42.283, -5.202],
                  [42.283, 5.61],
                  [33.501, 5.61],
                  [33.501, -5.202],
                ],
              ],
            },
            properties: {},
          }}>
          <FillLayer
            id="mask-fill"
            style={{
              fillColor: "#000",
              fillOpacity: 0.4,
            }}
          />
        </ShapeSource>

        {/* 2️⃣ MapLibre Base Map — Cities, Roads, etc. */}
        <ShapeSource id="kenya-counties" shape={countiesGeoJSON as any}>
          <FillLayer
            id="county-fill"
            style={{
              fillColor: theme.colors.surface,
              fillOpacity: 1,
            }}
          />
          <LineLayer
            id="county-outline"
            style={{
              lineColor: theme.colors.onSurface,
              lineWidth: 1,
              lineDasharray: [2, 2],
            }}
          />
          <SymbolLayer
            id="county-labels"
            style={{
              textField: ["get", "COUNTY_NAM"], // ← Uses COUNTY_NAM property
              textSize: 12,
              textColor: theme.colors.onBackground,
              textHaloColor: theme.colors.background,
              textHaloWidth: 2,
              textHaloBlur: 1,
              textAnchor: "center",
              textJustify: "center",
              textAllowOverlap: false,
              textIgnorePlacement: false,
              textTransform: "uppercase",
            }}
          />
        </ShapeSource>
        {/* 3️⃣ 👇 ALL WARDS — Your custom data on TOP */}
        {allFeatures.length > 0 && (
          <ShapeSource
            id="all-wards"
            shape={{
              type: "FeatureCollection",
              features: allFeatures,
            }}>
            {/* Fill */}
            <FillLayer
              id="wards-fill"
              style={{
                fillColor: [
                  "match",
                  ["get", "type"],
                  "main",
                  theme.colors.errorContainer,
                  theme.colors.primaryContainer,
                ],
                fillOpacity: ["match", ["get", "type"], "main", 0.3, 0.15],
              }}
            />
            {/* Outline */}
            <LineLayer
              id="wards-outline"
              style={{
                lineColor: [
                  "match",
                  ["get", "type"],
                  "main",
                  theme.colors.error,
                  theme.colors.primary,
                ],
                lineWidth: ["match", ["get", "type"], "main", 4, 2],
              }}
            />
            {/* Labels — now on top of city labels, which is correct */}
            <SymbolLayer
              id="wards-label"
              style={{
                textField: ["get", "name"],
                textSize: 14,
                textColor: theme.colors.onBackground,
                textHaloColor: theme.colors.background,
                textHaloWidth: 2,
                textHaloBlur: 1,
                textAnchor: "center",
                textJustify: "center",
                textAllowOverlap: false,
                textIgnorePlacement: false,
                textTransform: "uppercase",
              }}
            />
          </ShapeSource>
        )}
      </MapView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 400,
    height: "100%",
  },
  map: {
    flex: 1,
    height: "100%",
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
