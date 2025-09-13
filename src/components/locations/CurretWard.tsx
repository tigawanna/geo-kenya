import { useDeviceLocation } from "@/hooks/use-device-location";
import { db } from "@/lib/drizzle/client";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { SingleWard } from "./SingleWard";

export function CurretWard() {
  const theme = useTheme();
  const { errorMsg, location } = useDeviceLocation();
  const lat = location?.coords.latitude;
  const lng = location?.coords.longitude;
  const wardId = 1;
  const { data, isPending, refetch, isRefetching } = useQuery({
    queryKey: ["current-ward", wardId],
    queryFn: async () => {
      try {
        const result = await db.query.kenyaWards.findFirst({
          where: (fields, { eq }) => eq(fields.id, wardId),
        });

        if (!result) {
          throw new Error("Ward not found");
        }

        return {
          result,
          error: null,
        };
      } catch (e) {
        return {
          result: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
  });
  if (errorMsg) {
    return (
      <View style={{ ...styles.container }}>
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface, gap: 16 }]}>
          <MaterialIcon name="error" size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>{errorMsg}</Text>
        </View>
      </View>
    );
  }
  if (isPending) {
    return <LoadingFallback />;
  }
  if (!data?.result) {
    return (
      <View style={styles.container}>
        {isRefetching ? (
          <ActivityIndicator
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 1000,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          />
        ) : null}
        <View style={{ height: "80%" }}>
          <NoDataScreen
            listName="Wards"
            hint="No wards found"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
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
      </View>
    );
  }
  return (
    <View style={{ ...styles.container }}>
      <SingleWard ward={data.result} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    // justifyContent: "center",
    // alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
    // Color applied dynamically
  },
});
