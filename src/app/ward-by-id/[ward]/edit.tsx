import { MaterialIcon } from "@/components/default/ui/icon-symbol";
import { WardForm } from "@/components/locations/forms/WardForm";
import { LoadingFallback } from "@/components/state-screens/LoadingFallback";
import { NoDataScreen } from "@/components/state-screens/NoDataScreen";
import { getWardByIdQueryOptions } from "@/data-access-layer/wards-query-options";
import { logger } from "@/utils/logger";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Surface, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditWard() {
  const { ward: wardId } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const theme = useTheme();
  const router = useRouter();

  const { data, isPending, refetch, isRefetching } = useQuery(
    getWardByIdQueryOptions({ id: Number(wardId) })
  );

  if (isPending) {
    return (
      <View style={styles.container}>
        <LoadingFallback
          action={
            <View style={styles.buttonContainer}>
              <Button
                disabled={isRefetching}
                loading={isRefetching}
                icon="arrow-left"
                mode="outlined"
                onPress={() => router.back()}>
                Go back
              </Button>
              <Button
                disabled={isRefetching}
                loading={isRefetching}
                icon="reload"
                mode="contained-tonal"
                onPress={() => refetch()}>
                Reload
              </Button>
            </View>
          }
        />
      </View>
    );
  }

  if (!data?.result) {
    return (
      <View style={styles.container}>
        <View style={{ height: "80%", justifyContent: "center", gap: 8 }}>
          <NoDataScreen
            listName="Ward"
            message="Ward not found"
            hint="Please check the ward ID and try again"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />
          <View style={styles.buttonContainer}>
            <Button
              disabled={isRefetching}
              loading={isRefetching}
              icon="reload"
              mode="contained-tonal"
              onPress={() => refetch()}>
              Reload
            </Button>
            <Button
              disabled={isRefetching}
              loading={isRefetching}
              icon="arrow-left"
              mode="outlined"
              onPress={() => router.back()}>
              Go back
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
      <WardForm  ward={data.result}/>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 24,
  },
});
