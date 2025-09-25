import { getWardEventsQueryOptions } from "@/data-access-layer/ward-events-queries";
import { useQuery } from "@tanstack/react-query";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Card } from "react-native-paper";
import { NoDataScreen } from "../state-screens/NoDataScreen";

export function WardEventsList() {
  const { data, isLoading, error } = useQuery(getWardEventsQueryOptions());

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading events</Text>
      </View>
    );
  }

  if (!data?.result || data.result.length === 0) {
    return (
      <View style={styles.centered}>
        <NoDataScreen
          listName="ward  data events"
          message=""
          hint="updates to the wards data will appear here"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.eventType}>{item.eventType}</Text>
              <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
              <Text style={styles.status}>Status: {item.syncStatus}</Text>
              {item.wardCode && <Text>Ward: {item.wardCode}</Text>}
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
    color: "#666",
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
});
