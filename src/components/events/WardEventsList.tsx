import { getWardEventsQueryOptions } from "@/data-access-layer/ward-events-queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { CheckUpdates } from "./CheckUpdates";
import { db } from "@/lib/drizzle/client";
import { wardEvents } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { RefreshWardEvents, WardsEventsHheaders } from "./WardsEventsHheaders";

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
              <Text style={styles.eventType}>{item.eventType}</Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
              <Text style={styles.status}>Status: {item.syncStatus}</Text>
              {item.wardCode && <Text>Ward: {item.wardCode}</Text>}
              <Button onPress={() => unsyncMutation.mutate({ id: item.id })}>
                Set Not Synced
              </Button>
              <Button onPress={() => unsyncMutation.mutate({ id: item.id })}>Set Not Synced</Button>
              {item.oldData && (
                <View style={styles.dataSection}>
                  <Text style={styles.dataLabel}>Previous:</Text>
                  <Text style={styles.dataText}>{item.oldData.split("geom")[0]}</Text>
                </View>
              )}
              {item.newData && (
                <View style={styles.dataSection}>
                  <Text style={styles.dataLabel}>Current:</Text>
                  <Text style={styles.dataText}>{item.newData.split("geom")[0]}</Text>
                </View>
              )}
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
