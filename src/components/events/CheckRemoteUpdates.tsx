import { logger } from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View, ScrollView } from "react-native";
import { Text, IconButton, Card, useTheme } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";
import { pullUpdates } from "@/lib/expo-spatialite/sync/pull_updates";
import { timestampTolaclTime } from "@/lib/pb/utils/dates";

export function CheckRemoteUpdates() {
  const theme = useTheme();
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["ward-updates"],
    queryFn: pullUpdates,
  });
  // logger.log("CheckUpdates::", data);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge">Ward Updates</Text>
        <IconButton
          loading={isRefetching}
          icon={getMaterialIconName("refresh")}
          onPress={refetch}
        />
      </View>
      {data?.result?.items.map((update, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Version: {update.version}</Text>
            <Text variant="bodyMedium">Created: {timestampTolaclTime(update.created)}</Text>
            {update.description && <Text variant="bodySmall">{update.description}</Text>}
            <ScrollView style={{backgroundColor: theme.colors.surface}}>
              <Text variant="bodySmall" style={{fontWeight: "bold"}}>
                Data:
              </Text>
              <Text variant="bodySmall" style={{fontFamily: "monospace"}}>
                {JSON.stringify(update.data, null, 2)}
              </Text>
            </ScrollView>
          </Card.Content>
        </Card>
      ))}
      {/* {data?.result.} */}
      {data?.error && (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.error }}>
              Error
            </Text>
            <Text variant="bodyMedium">{data.error}</Text>
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    marginBottom: 8,
  },
  errorCard: {
    marginBottom: 8,
  },
});
