import { db } from "@/lib/drizzle/client";
import { useQuery } from "@tanstack/react-query";
import { sql } from "drizzle-orm";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, useTheme, Text, Card } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { SingleWard } from "./SingleWard";

interface CurretWardProps {
  location: LocationObject;
}

export function CurretWard({ location }: CurretWardProps) {
  const theme = useTheme();

  const lat = location?.coords.latitude;
  const lng = location?.coords.longitude;
  const { data, isPending, refetch, isRefetching } = useQuery({
    queryKey: ["current-ward", lat, lng],
    queryFn: async () => {
      try {
        const result = await db.query.kenyaWards.findFirst({
          where: (fields, { eq, or }) =>
            or(
              sql`
                Within(GeomFromText('POINT(' || ${lng} || ' ' || ${lat} || ')', 4326), geom)
            `
            ),
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
    width: "100%",
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  coordinatesText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
    fontFamily: "monospace",
  },
  labelCard: {
    marginBottom: 1,
  },
  labelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
