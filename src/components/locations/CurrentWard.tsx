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
import { SingleWardCard } from "./single-ward/SingleWardCard";

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
    })
  );

  return (
    <View style={{ ...styles.container }}>
      {data?.result ? (
        <SingleWardCard ward={data?.result} backButton={backButton} actions={actions} />
      ) : (
        <View style={{ padding: 20, gap: 12, alignItems: "center" }}>
          {isPending ? (
            <View
              style={{
                gap: 6,
                paddingBottom: 8,
                alignItems: "center",
              }}>
              <Text
                variant="titleMedium"
                style={{ textAlign: "center", color: theme.colors.primary, gap: 8 }}>
                Checking your location
                <LoadingIndicatorDots />
              </Text>
              <Text
                variant="labelSmall"
                style={{ textAlign: "center", color: theme.colors.primary }}>
                Jump to any ward by tapping on the map
              </Text>
            </View>
          ) : (
            <Text
              variant="bodyMedium"
              style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
              No ward found here. Tap the map or open the sheet for options.
            </Text>
          )}
        </View>
      )}

      <WardWithNeighborsMap
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
    width: "100%",
    // height: "auto",
    // backgroundColor:"green"
  },
});
