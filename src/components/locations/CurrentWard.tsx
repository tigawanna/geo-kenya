import { getWardByLocation } from "@/data-access-layer/wards-query-options";
import { useDynamicBottomSheet } from "@/lib/react-native-bottom-sheet/use-dynamic-bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { WardDetailBottomSheet } from "./WardDetailBottomSheet";
import { WardWithNeighborsMap } from "./maps/WardWithNeighborsMap.tsx";
import { NotInKenyaBottomSheet } from "./proximity/NotInKenyaBottomSheet";
import { ClosestWards } from "./proximity/ClosestWards";
import { WardInfoBottomSheet } from "./sheets/ward-info-bottom-sheet";

interface CurretWardProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
  preferBottomSheet?: boolean;
}

export function CurrentWard({ lat, lng, actions, backButton, preferBottomSheet }: CurretWardProps) {
  const theme = useTheme();
  const sheetOptions = useDynamicBottomSheet();
  const detailSheetOptions = useDynamicBottomSheet({ minSnapindex: 1, maxSnapindex: 5 });
  const [sheetCoords, setSheetCoords] = useState<{ lat: number; lng: number } | null>(null);

  const { data, isPending } = useQuery(
    getWardByLocation({
      lat,
      lng,
    }),
  );

  return (
    <View style={styles.container}>
      <WardWithNeighborsMap
        fillHeight
        wardId={data?.result?.id}
        onMapPress={
          preferBottomSheet
            ? (coords) => {
                setSheetCoords(coords);
                detailSheetOptions.handleSnapPress(2);
              }
            : undefined
        }
      />

      {!data?.result && (
        <View style={styles.statusOverlay} pointerEvents="none">
          {isPending ? (
            <View style={styles.statusContent}>
              <Text variant="titleMedium" style={{ textAlign: "center", color: theme.colors.primary }}>
                Checking your location
                <LoadingIndicatorDots />
              </Text>
              <Text variant="labelSmall" style={{ textAlign: "center", color: theme.colors.primary }}>
                Jump to any ward by tapping on the map
              </Text>
            </View>
          ) : (
            <Text
              variant="bodyMedium"
              style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
              No ward found here. Tap the map for options.
            </Text>
          )}
        </View>
      )}

      <WardInfoBottomSheet
        ward={data?.result}
        backButton={backButton}
        actions={actions}
        nearbyContent={<ClosestWards lat={lat} lng={lng} />}
      />

      <NotInKenyaBottomSheet location={{ lat, lng }} sheetOptions={sheetOptions} />
      {preferBottomSheet ? (
        <WardDetailBottomSheet
          lat={sheetCoords?.lat ?? null}
          lng={sheetCoords?.lng ?? null}
          sheetOptions={detailSheetOptions}
          onClose={() => setSheetCoords(null)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  statusOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  statusContent: {
    gap: 8,
    alignItems: "center",
  },
});
