import { MaterialIcon } from "@/components/default/ui/icon-symbol";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { useExpoSpatialiteContext } from "@/lib/expo-spatialite/ExpoSpatialiteProvider";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { WardListItem } from "../list/WardListItem";
import { getClosestWardsByCorrdsQueryOptions } from "@/data-access-layer/wards-query-options";

interface ClosestWardsProps {
  lat: number;
  lng: number;
}

export function ClosestWards({ lat, lng }: ClosestWardsProps) {
  const theme = useTheme();
  const { data, isPending } = useQuery(
    getClosestWardsByCorrdsQueryOptions({
      lat,
      lng,
    })
  );

  if (isPending) {
    return (
      <View style={{ paddingVertical: 14 }}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  if (!data?.results || data?.results?.length === 0) {
    return;
    // return (
    //   <View
    //     style={{
    //       width: "100%",
    //       gap: 6,
    //     }}>
    //     <View style={{ height: "80%" }}>
    //       <NoDataScreen
    //         listName="Wards"
    //         hint="No wards found in a 5km radius"
    //         icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
    //       />

    //       <Button
    //         style={{ marginHorizontal: "20%" }}
    //         disabled={isRefetching}
    //         icon="reload"
    //         mode="contained"
    //         onPress={() => refetch()}>
    //         Reload
    //       </Button>
    //     </View>
    //   </View>
    // );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.labelCard}>
        <Card.Content style={styles.labelContent}>
          <MaterialIcon name="my-location" color={theme.colors.primary} size={20} />
          <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
            Nearby Wards
          </Text>
        </Card.Content>
      </Card>
      <View style={{ paddingHorizontal: 8 }}>
        {data.results.map((ward: any) => (
          <WardListItem key={ward.id} item={ward} theme={theme} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    gap: 6,
    paddingHorizontal: 6,
  },
  labelCard: {
    margin: 6,
    marginBottom: 1,
  },
  labelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
