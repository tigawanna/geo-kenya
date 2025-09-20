import { db } from "@/lib/drizzle/client";
import { useQuery } from "@tanstack/react-query";
import { sql } from "drizzle-orm";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { SingleWard } from "./SingleWard";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

interface CurretWardProps {
  lat: number;
  lng: number;
}

export function CurretWard({ lat, lng }: CurretWardProps) {
  const theme = useTheme();

  // const lat = location?.coords.latitude;
  // const lng = location?.coords.longitude;
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
    placeholderData: (prevData) => prevData,
  });
  // console.log(data);
  if (isPending) {
    return <LoadingFallback />;
  }
  if (!data?.result) {
    return (
      <BottomSheetModalProvider>
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
        <View style={{ height: "70%" }}>
          <NoDataScreen
            listName="Wards"
            message="No ward found at that location"
            hint="Make sure the location is within Kenya"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Button
              style={{}}
              disabled={isRefetching}
              loading={isRefetching}
              icon="reload"
              mode="contained-tonal"
              onPress={() => {
                refetch();
              }}>
              Reload
            </Button>
          </View>
        </View>
      </BottomSheetModalProvider>
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
    height: "auto",
    // backgroundColor:"green"
  },
});
