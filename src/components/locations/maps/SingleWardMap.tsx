// SingleWardMap.tsx
import { getWardByIdQueryOptions } from "@/data-access-layer/wards-query-options";
import { geomParse, isValidGeoJSONGeometry } from "@/lib/map-libre/geom-parse";
import { logger } from "@/utils/logger";
import {
  Camera,
  FillLayer,
  LineLayer,
  MapView,
  ShapeSource,
} from "@maplibre/maplibre-react-native";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";




interface SingleWardMapProps {
  wardId: number;
}

export function SingleWardMap({ wardId }: SingleWardMapProps) {
  const theme = useTheme();
  const [selectedWard, setSelectedWard] = useState<any>(null);
  const [isZooming, setIsZooming] = useState(false);

  // 👇 Camera state to control zoom/center declaratively
  const [camera, setCamera] = useState({
    centerCoordinate: [36.8087, -1.1728] as [number, number],
    zoomLevel: 5,
    animationDuration: 2000,
  });

  const { data, isPending, refetch, isRefetching } = useQuery(
    getWardByIdQueryOptions({ id: wardId })
  );

  const wardGeometry = geomParse(data?.result?.geom as string | undefined);

  // 👇 Auto-zoom to ward when geometry loads
  useEffect(() => {
    if (wardGeometry && isValidGeoJSONGeometry(wardGeometry)) {
      const bbox = calculateBBox(wardGeometry);
      if (bbox) {
        const [minLng, minLat, maxLng, maxLat] = bbox;

        // Calculate center
        const centerLng = (minLng + maxLng) / 2;
        const centerLat = (minLat + maxLat) / 2;

        // Estimate zoom level based on bbox size
        const latDelta = maxLat - minLat;
        const lngDelta = maxLng - minLng;
        const maxDelta = Math.max(latDelta, lngDelta);

        let zoomLevel = 12; // Default for small wards
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
    }
  }, [wardGeometry]);

  const handleMapPress = (feature: GeoJSON.Feature) => {
    type EnhnacedFeatureGeom = GeoJSON.Feature & {
      geometry: {
        coordinates: [number, number];
      };
    };
    const enhancedFeature = feature as any as EnhnacedFeatureGeom;
    // const { geometry } = evt.nativeEvent;
    logger.log(" tapped on geomety ",enhancedFeature.geometry.coordinates);
    // const [lng, lat] = feature?.geometry;
    // console.log("Tapped at:", { lat, lng });
  };

  return (
    <View style={styles.container}>
      {(isPending || isZooming) && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>
            {isPending ? "Finding ward..." : "Zooming to ward..."}
          </Text>
        </View>
      )}

      <MapView
        style={styles.map}
        // styleURL="https://demotiles.maplibre.org/style.json" // ✅ Fixed: removed trailing spaces!
        onPress={handleMapPress}>
        {/* 👇 Camera controlled by state */}
        <Camera
          zoomLevel={camera.zoomLevel}
          centerCoordinate={camera.centerCoordinate}
          animationDuration={camera.animationDuration}
        />

        {/* Kenya Mask — dims the world outside Kenya */}
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

        {/* Ward Geometry */}
        {wardGeometry && isValidGeoJSONGeometry(wardGeometry) && (
          <ShapeSource
            id="selected-ward"
            shape={{
              type: "Feature",
              geometry: wardGeometry as any,
              properties: {},
            }}>
            <LineLayer
              id="ward-outline"
              style={{
                lineColor: theme.colors.primary, // ✅ Theme color
                lineWidth: 3,
              }}
            />
            <FillLayer
              id="ward-fill"
              style={{
                fillColor: theme.colors.primaryContainer, // ✅ Theme color (softer)
                fillOpacity: 0.2,
              }}
            />
          </ShapeSource>
        )}
      </MapView>

      {selectedWard && (
        <View style={styles.infoBox}>
          <Text style={[styles.wardName, { color: theme.colors.onSurface }]}>
            {selectedWard.ward}
          </Text>
          <Text style={{ color: theme.colors.onSurface }}>{selectedWard.constituency}</Text>
          <Text style={{ color: theme.colors.onSurface }}>{selectedWard.county}</Text>
        </View>
      )}
    </View>
  );
}

// 👇 Helper to calculate bounding box from GeoJSON geometry
const calculateBBox = (geom: any): [number, number, number, number] | null => {
  if (!geom || !geom.coordinates) return null;

  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;

  const traverse = (coords: any[]) => {
    coords.forEach((point) => {
      if (Array.isArray(point) && typeof point[0] === "number") {
        const [lng, lat] = point;
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      } else if (Array.isArray(point)) {
        traverse(point);
      }
    });
  };

  traverse(geom.coordinates);

  return isFinite(minLng) && isFinite(minLat) && isFinite(maxLng) && isFinite(maxLat)
    ? [minLng, minLat, maxLng, maxLat]
    : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
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
  infoBox: {
    position: "absolute",
    top: 60,
    left: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  wardName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
