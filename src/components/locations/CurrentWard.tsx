import { getWardByLocation } from "@/data-access-layer/wards-query-options";
import { useDynamicBottomSheet } from "@/lib/react-native-bottom-sheet/use-dynamic-bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { WavySpinner } from "../state-screens/wavy-spinner";
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

      {isPending && !data?.result ? (
        <View style={styles.loadingIndicator} pointerEvents="none">
          <WavySpinner />
        </View>
      ) : null}

      {!isPending && !data?.result ? (
        <View style={styles.emptyHint} pointerEvents="none">
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Tap the map to explore
          </Text>
        </View>
      ) : null}

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
  loadingIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
  emptyHint: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: "center",
  },
});
