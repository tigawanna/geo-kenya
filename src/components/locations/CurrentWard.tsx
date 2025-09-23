import { getWardByLocation } from "@/data-access-layer/wards-query-options";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { getMaterialIconName, MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { SingleWardCard } from "./single-ward/SingleWardCard";
import { WardWithNeighborsMap } from "./maps/WardWithNeighborsMap.tsx";

interface CurretWardProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
}

export function CurrentWard({ lat, lng,actions,backButton }: CurretWardProps) {
  const theme = useTheme();
  const qc = useQueryClient();
  const { data, isPending, refetch, isRefetching } = useQuery(
    getWardByLocation({
      lat,
      lng,
    })
  );

  if (isPending) {
    return <LoadingFallback />;
  }
  if (!data?.result) {
    return (
      <View style={{ height: "100%", gap: 6, paddingHorizontal: 10,justifyContent:"center" }}>
        {isRefetching ? (
          <ActivityIndicator
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 1000,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          />
        ) : null}
        <View style={{ height: "auto", paddingBottom: 40 }}>
          <NoDataScreen
            listName="Wards"
            message="No ward found at that location"
            hint="Make sure the location is within Kenya"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Button
              style={{}}
              disabled={isRefetching}
              loading={isRefetching}
              icon="reload"
              mode="contained-tonal"
              onPress={() => {
                refetch();
              }}>
              Reload
            </Button>{" "}
            <Button
              style={{}}
              disabled={isRefetching}
              loading={isRefetching}
              icon={getMaterialIconName("map-marker-multiple")}
              mode="contained-tonal"
              onPress={() => {
                qc.invalidateQueries({ queryKey: ["device-location"] });
              }}>
              Reset Location
            </Button>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={{ ...styles.container }}>
      <SingleWardCard ward={data.result} backButton={backButton} actions={actions}/>
      <WardWithNeighborsMap wardId={data.result.id} />
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
