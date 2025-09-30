import { checkDbUpdates } from "@/lib/expo-spatialite/sync/sync_ward_updates";
import { logger } from "@/utils/logger";
import { useMutation, useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text, Surface, Button, IconButton } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";
import { db } from "@/lib/drizzle/client";
import { wardEvents } from "@/lib/drizzle/schema";
import { pushLocalEvents } from "@/lib/expo-spatialite/sync/push-events";

export function CheckUpdates() {
  const mutation = useMutation({
    mutationFn: pushLocalEvents,
    onSuccess: (data) => {
      // logger.log(" Push updates::onSuccess", data);
    },
    onError: (error) => {
      // logger.log(" Push updates::onError", error);
    },
  });
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["ward-updates"],
    queryFn: async () => {
      try {
        const result = await db.select().from(wardEvents).orderBy(wardEvents.createdAt).get();
        return {
          result,
          error: null,
        };
      } catch (error) {
        return {
          result: null,
          error: error instanceof Error ? error.message : JSON.stringify(error),
        };
      }
    },
  });
  // logger.log("CheckUpdates::", data);
  return (
    <View style={{ ...styles.container }}>
      <Text variant="titleLarge">CheckUpdates</Text>
      <View style={{ flexDirection: "row",gap:10 }}>
        <IconButton
          loading={isRefetching}
          icon={getMaterialIconName("refresh")}
          onPress={refetch}
        />
        <IconButton
          loading={mutation.isPending}
          icon={getMaterialIconName("update")}
          onPress={mutation.mutate}
        />
      </View>
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
