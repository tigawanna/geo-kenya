import { db } from "@/lib/drizzle/client";
import { useQuery } from "@tanstack/react-query";
import { sql } from "drizzle-orm";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, IconButton, useTheme } from "react-native-paper";
import { getMaterialIconName, MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { SingleWard } from "./SingleWard";
import { LatLongForm } from "./form/LatLongForm";

import { useCustomBottomSheetModal } from "@/lib/react-native-bottom-sheet/use-bottom-sheet";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";

interface CurretWardProps {
  lat:number;
  lng:number
}

export function CurretWard({ lat,lng }: CurretWardProps) {
  const theme = useTheme();

  const latlongBottomSheetref = useCustomBottomSheetModal();
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
            hint="No wards found"
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

            <Button
              style={{}}
              disabled={isRefetching}
              loading={isRefetching}
              icon="map-marker"
              mode="contained-tonal"
              onPress={() => {
                latlongBottomSheetref.handleSnapPress(3);
              }}>
              Change location
            </Button>
          </View>
        </View>
        <BottomSheetModal
          ref={latlongBottomSheetref.sheetRef}
          onChange={latlongBottomSheetref.handleSheetChange}
          style={{ height: "auto", width: "100%" }}
          backgroundStyle={{ backgroundColor: theme.colors.surface }}
          handleStyle={{ backgroundColor: theme.colors.elevation.level4 }}
          handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}>
          <BottomSheetView
            style={{
              flex: 1,
              alignItems: "center",
              width: "100%",
              backgroundColor: theme.colors.background,
            }}>
            <LatLongForm
              action={
                <IconButton
                  mode="contained"
                  icon={getMaterialIconName("close")}
                  onPress={() => latlongBottomSheetref.handleClosePress()}
                />
              }
            />
          </BottomSheetView>
        </BottomSheetModal>
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
