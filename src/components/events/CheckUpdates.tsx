import { checkDbUpdates } from "@/lib/expo-spatialite/sync/sync_ward_updates";
import { logger } from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text, Surface, Button, IconButton } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";

export function CheckUpdates() {
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["ward-updates"],
    queryFn: () => {
      return checkDbUpdates();
    },
  });
  logger.log("CheckUpdates::", data);
  return (
    <View style={{ ...styles.container }}>
      <Text variant="titleLarge">CheckUpdates</Text>
      <IconButton loading={isRefetching} icon={getMaterialIconName("refresh")} onPress={refetch} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
