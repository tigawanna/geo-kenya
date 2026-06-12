import { logger } from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, IconButton, Card, useTheme, Divider } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";
import { pullUpdates } from "@/lib/sync/pull-pocketbase-updates";
import { timestampTolaclTime } from "@/lib/pb/utils/dates";

export function WardRemoteUpdates() {
  const theme = useTheme();
  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["ward-updates"],
    queryFn: pullUpdates,
  });

  const renderUpdateItem = ({ item: update, index }: { item: any; index: number }) => (
    <Card key={index} style={styles.card} elevation={2}>
      <Card.Content>
        <View style={styles.updateHeader}>
          <Text variant="titleMedium" style={styles.version}>v{update.version}</Text>
          <Text variant="bodySmall" style={styles.date}>
            {timestampTolaclTime(update.created)}
          </Text>
        </View>
        
        {update.description && (
          <>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={styles.description}>
              {update.description}
            </Text>
          </>
        )}
        
        <Divider style={styles.divider} />
        <View style={styles.dataSection}>
          <Text variant="labelMedium" style={styles.dataLabel}>Update Data:</Text>
          <View style={[styles.dataContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Text variant="bodySmall" style={styles.dataText}>
              {JSON.stringify(update.data, null, 2)}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text variant="headlineSmall" style={styles.title}>Ward Updates</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Remote updates available for your ward data
        </Text>
      </View>
      <IconButton
        loading={isRefetching}
        icon={getMaterialIconName("refresh")}
        onPress={refetch}
        mode="contained-tonal"
      />
    </View>
  );

  const renderError = () => (
    <Card style={styles.errorCard} elevation={1}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.error }}>
          Error Loading Updates
        </Text>
        <Text variant="bodyMedium">{data?.error}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.result?.items || []}
        renderItem={renderUpdateItem}
        keyExtractor={(item, index) => `${item.version}-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={data?.error ? renderError : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
  },
  card: {
    marginBottom: 12,
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  version: {
    fontWeight: 'bold',
  },
  date: {
    opacity: 0.6,
  },
  divider: {
    marginVertical: 12,
  },
  description: {
    lineHeight: 20,
  },
  dataSection: {
    marginTop: 8,
  },
  dataLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  dataContainer: {
    padding: 12,
    borderRadius: 8,
  },
  dataText: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 16,
  },
  errorCard: {
    margin: 16,
  },
});
