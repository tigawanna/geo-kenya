// SingleWardMap.tsx
import React, { useRef, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import {
  MapView,
  Camera,
  ShapeSource,
  LineLayer,
  FillLayer,
} from "@maplibre/maplibre-react-native";

import { useTheme } from "react-native-paper";
import { getWardByIdQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";


interface WardGeometry {
  type: string;
  coordinates: any[];
}

interface SingleWardMapProps {
  wardId: number;
}
export function SingleWardMap({wardId}:SingleWardMapProps) {
  const theme = useTheme();
  const mapRef = useRef<any>(null);

  const { data, isPending, refetch, isRefetching } = useQuery(
    getWardByIdQueryOptions({ id: wardId })
  );
  const [selectedWard, setSelectedWard] = useState<any>(null);
  // const [wardGeometry, setWardGeometry] = useState<WardGeometry | null>(null);
  // const [loading, setLoading] = useState(false);

  // 👇 You’ll integrate getWardByLocation here later
  const handleMapPress = (evt: any) => {
    const { geometry } = evt.nativeEvent; // ← Note: different event structure!
    const [lng, lat] = geometry.coordinates;

    console.log("Tapped at:", { lat, lng });
    // Later: call getWardByLocation({ lat, lng })
  };

  // 👇 Auto-zoom helper (you’ll use ward.minX/minY/maxX/maxY)
  const zoomToBBox = (minX: number, minY: number, maxX: number, maxY: number) => {
    if (!mapRef.current) return;

    mapRef.current.fitBounds(
      [minX, minY], // southwest
      [maxX, maxY], // northeast
      40, // padding
      1000 // duration ms
    );
  };

  const wardGeometry = data?.result?.geom as WardGeometry

  console.log("geometry  = ", wardGeometry);

  return (
    <View style={styles.container}>
      {isPending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />{" "}
          <Text style={styles.loadingText}>Finding ward...</Text>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        styleURL="https://demotiles.maplibre.org/style.json" // ← Open demo style (no token)
        onPress={handleMapPress}>
        <Camera
          zoomLevel={6}
          centerCoordinate={[36.8087, -1.1728]} // Kenya center
          animationDuration={2000}
        />

        {/* 👇 Render ward outline when available */}
        {wardGeometry && (
          <ShapeSource
            id="selected-ward"
            shape={{
              type: "Feature",
              geometry: wardGeometry,
              properties: {},
            }}>
            <LineLayer
              id="ward-outline"
              style={{
                lineColor: "#ff3300",
                lineWidth: 4,
              }}
            />
            <FillLayer
              id="ward-fill"
              style={{
                fillColor: "#ff3300",
                fillOpacity: 0.1,
              }}
            />
          </ShapeSource>
        )}
      </MapView>

      {selectedWard && (
        <View style={styles.infoBox}>
          <Text style={styles.wardName}>{selectedWard.ward}</Text>
          <Text>{selectedWard.constituency}</Text>
          <Text>{selectedWard.county}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight:200,
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
    color: "#fff",
    marginTop: 8,
    fontSize: 16,
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
  },
});
