import { getWardByIdQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import { MaterialIcon } from "../../default/ui/icon-symbol";
import { LoadingFallback } from "../../state-screens/LoadingFallback";
import { NoDataScreen } from "../../state-screens/NoDataScreen";
import { SingleWardCard } from "./SingleWardCard";
import { useRouter } from "expo-router";
import { ClosestWardsByGeom } from "../proximity/ClosestWardsByGeom";

interface SingleWardByIdProps {
  wardId: string;
}
export function SingleWardById({ wardId }: SingleWardByIdProps) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" onPress={() => router.back()} />
      </View>
      <SingleWardCard ward={data.result} />
      <ClosestWardsByGeom wardId={data.result.id} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  header: {
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 24,
  },
});
