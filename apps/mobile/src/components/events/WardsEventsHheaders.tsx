import { pushAllEvents } from "@/lib/sync/push-events";
import { useSnackbar } from "@/lib/react-native-paper/snackbar/global-snackbar-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, Text, Card } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";
import { Collapsible } from "../default/ui/collapsible";

interface WardsEventsHeadersProps {
  pendingSyncs: boolean;
}

export function WardsEventsHeaders({ pendingSyncs }: WardsEventsHeadersProps) {
  const { showSnackbar } = useSnackbar();
  const pushEventsMutation = useMutation({
    mutationFn: async () => {
      return pushAllEvents();
    },
    onSuccess: (data) => {
      if (data.result) {
        return showSnackbar("Events pushed successfully");
      }
      if (data.error) {
        return showSnackbar("Something went wrong pushing events: " + data.error);
      }
    },
    onError: (error) => {
      showSnackbar(error.message);
    },
  });

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Ward Events Sync
        </Text>
        <Collapsible title="Local changes to the data appear here">
          <Text variant="bodySmall" style={styles.description}>
            These are all the ward updates (create, update, delete) you've made locally. Pushing
            these events helps improve future data updates and keeps your changes synchronized.
          </Text>
        </Collapsible>
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon={getMaterialIconName("publish")}
            onPress={() => pushEventsMutation.mutate()}
            loading={pushEventsMutation.isPending}
            disabled={pushEventsMutation.isPending || !pendingSyncs}
            style={styles.pushButton}>
            Push Events
          </Button>
          <RefreshWardEvents />
        </View>
      </Card.Content>
    </Card>
  );
}
const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pushButton: {
    flex: 1,
    marginRight: 8,
  },
});

export function RefreshWardEvents() {
  const qc = useQueryClient();
  const isRefreshing = qc.isFetching({ queryKey: ["ward-events"] });

  return (
    <IconButton
      icon={getMaterialIconName("refresh")}
      loading={Boolean(isRefreshing)}
      onPress={() => {
        qc.refetchQueries({
          queryKey: ["ward-events"],
        });
      }}
    />
  );
}
