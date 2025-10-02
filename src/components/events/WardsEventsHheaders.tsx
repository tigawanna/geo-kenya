import { pushAllEvents } from "@/lib/expo-spatialite/sync/push_events";
import { useSnackbar } from "@/lib/react-native-paper/snackbar/global-snackbar-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { getMaterialIconName } from "../default/ui/icon-symbol";

export function WardsEventsHheaders() {
  const { showSnackbar } = useSnackbar();
  const pushEventsMutation = useMutation({
    mutationFn: async () => {
      return pushAllEvents();
    },
    onSuccess: (data) => {
      if (data.result) {
        return showSnackbar("Events pushed");
      }
      if (data.error) {
        return showSnackbar("Somthing went wrong pushing the events : " + data.error);
      }
    },
    onError: (error) => {
      showSnackbar(error.message);
    },
  });
  return (
    <View style={{ ...styles.container }}>
      <Button
        icon={getMaterialIconName("publish")}
        onPress={() => pushEventsMutation.mutate()}
        loading={pushEventsMutation.isPending}>
        push events
      </Button>
      <RefreshWardEvents />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
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
