import { getWardEventsQueryOptions } from "@/data-access-layer/ward-events-queries";
import { db } from "@/lib/drizzle/client";
import { wardEvents } from "@/lib/drizzle/schema";
import { sendAnEvent, SendAnEventProps } from "@/lib/expo-spatialite/sync/push_events";
import { useMutation, useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { WardMiniCard } from "./WardMiniCard";
import { RefreshWardEvents, WardsEventsHheaders } from "./WardsEventsHheaders";
import { DiffView } from "../shared/DiffView";

export function WardEventsList() {
  const { data, isLoading, error, isRefetching, refetch } = useQuery(getWardEventsQueryOptions());
  const unsyncMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      return db
        .update(wardEvents)
        .set({
          syncStatus: "PENDING",
        })
        .where(eq(wardEvents.id, id));
    },
    meta: {
      invalidates: [["ward-events"]],
    },
  });
  const pushEventMutation = useMutation({
    mutationFn: async (vars: SendAnEventProps) => {
      sendAnEvent(vars);
    },
    meta: {
      invalidates: [["ward-events"]],
    },
  });
  // logger.log("WardEventsList::", data);
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading events...</Text>
        <Button
          style={{ marginHorizontal: "20%" }}
          disabled={isRefetching}
          icon="reload"
          mode="contained"
          onPress={() => {
            refetch();
          }}>
          Reload
        </Button>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading events</Text>
        <Button
          style={{ marginHorizontal: "20%" }}
          disabled={isRefetching}
          icon="reload"
          mode="contained"
          onPress={() => {
            refetch();
          }}>
          Reload
        </Button>
      </View>
    );
  }

  if (!data?.result || data.result.length === 0) {
    return (
      <View style={styles.centered}>
        <RefreshWardEvents />
        <NoDataScreen
          listName="ward  data events"
          message=""
          hint="updates to the wards data will appear here"
        />
        <Button
          style={{ marginHorizontal: "20%" }}
          disabled={isRefetching}
          icon="reload"
          mode="contained"
          onPress={() => {
            refetch();
          }}>
          Reload
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={{ marginBottom: 8 }}>
            <WardsEventsHheaders />
          </View>
        )}
        renderItem={({ item }) => (
          <Card style={styles.card} elevation={4}>
            <Card.Content>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <Text style={styles.eventType}>{item.eventType}</Text>
                  <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                  <Text style={styles.status}>Status: {item.syncStatus}</Text>
                  {item.wardCode ? <Text>Ward: {item.wardCode}</Text> : null}
                </View>
                <View>
                  <Button
                    icon={getMaterialIconName("undo")}
                    loading={unsyncMutation.isPending}
                    onPress={() => unsyncMutation.mutate({ id: item.id })}>
                    unsync
                  </Button>
                  <Button
                    icon={getMaterialIconName("publish")}
                    loading={pushEventMutation.isPending}
                    onPress={() =>
                      pushEventMutation.mutate({
                        rawEvent: {
                          event_id: item.id,
                          event_type: item.eventType,
                          old_data: item.oldData,
                          new_data: item.newData,
                          ward_id: item.wardId,
                          eventSource: item.eventSource,
                        },
                      })
                    }>
                    push
                  </Button>
                </View>
              </View>
              <DiffView
                old={item?.oldData ? JSON.parse(item.oldData) : {}}
                new={item?.newData ? JSON.parse(item.newData) : {}}
                truncate={["geom"]}
              />
              {/* {item.oldData ? (
                <View style={{ paddingTop: 8 }}>
                  <Text>Old data</Text>
                  <WardMiniCard ward={JSON.parse(item.oldData)} />
                </View>
              ) : null}
              {item.newData ? (
                <View style={{}}>
                  <Text>New data</Text>
                  <WardMiniCard ward={JSON.parse(item.newData)} />
                </View>
              ) : null} */}
            </Card.Content>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: "100%",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  card: {
    marginBottom: 8,
  },
  eventType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
  dataSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 4,
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dataText: {
    fontSize: 11,
    fontFamily: "monospace",
  },
});
