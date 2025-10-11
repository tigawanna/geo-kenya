import { getWardByLocation } from "@/data-access-layer/wards-query-options";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { getMaterialIconName, MaterialCommunityIcon } from "../default/ui/icon-symbol";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { WardWithNeighborsMap } from "./maps/WardWithNeighborsMap.tsx";
import { SingleWardCard } from "./single-ward/SingleWardCard";

interface CurretWardProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
}

export function CurrentWard({ lat, lng, actions, backButton }: CurretWardProps) {
  const theme = useTheme();
  const qc = useQueryClient();
  const router = useRouter();
  const { data, isPending, refetch, isRefetching } = useQuery(
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
            <View
              style={{
                gap: 4,
                alignItems: "center",
              }}>
              <MaterialCommunityIcon
                name={getMaterialIconName("map-marker-off")}
                size={18}
                color={theme.colors.primary}
              />
              <Text
                variant="bodyMedium"
                style={{ textAlign: "center", color: theme.colors.onSurfaceVariant }}>
                You may be outside Kenya. Tap anywhere on the map below to search, or
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/explore")}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={{ color: theme.colors.primary }}>
                  Visit the Explore tab to browse all wards
                </Text>
                <MaterialIcons size={25} name="arrow-right-alt" color={theme.colors.primary} />
              </Pressable>
            </View>
          )}
        </View>
      )}

      <WardWithNeighborsMap wardId={data?.result?.id} />
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
