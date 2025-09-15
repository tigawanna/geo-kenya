import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { useExpoSpatialiteContext } from "@/lib/expo-spatialite/ExpoSpatialiteProvider";
import { useQuery } from "@tanstack/react-query";
import { LocationObject } from "expo-location/build/Location.types";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { LoadingIndicatorDots } from "../state-screens/LoadingIndicatorDots";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { WardListItem } from "./WardListItem";

interface ClosestWardsProps {
  location: LocationObject;
}

export function ClosestWards({ location }: ClosestWardsProps) {
  const theme = useTheme();
  const { executeQuery } = useExpoSpatialiteContext();

  const lat = location?.coords.latitude;
  const lng = location?.coords.longitude;

  const { data, isPending, refetch, isRefetching } = useQuery({
    queryKey: ["closest-ward", lat, lng],
    queryFn: async () => {
      try {
        // const results = await db
        //   .select({
        //     id: kenyaWards.id,
        //     wardCode: kenyaWards.wardCode,
        //     ward: kenyaWards.ward,
        //     county: kenyaWards.county,
        //     countyCode: kenyaWards.countyCode,
        //     subCounty: kenyaWards.subCounty,
        //     constituency: kenyaWards.constituency,
        //     constituencyCode: kenyaWards.constituencyCode,
        //     geometry: sql<string>`AsGeoJSON(${kenyaWards.geom})`.as("geometry"),
        //     distance:
        //       sql<number>`ST_Distance(${kenyaWards.geom}, MakePoint(${lng}, ${lat}, 4326), 1)`.as(
        //         "distance"
        //       ),
        //   })
        //   .from(kenyaWards)
        //   .where(sql`ST_Distance(${kenyaWards.geom}, MakePoint(${lng}, ${lat}, 4326), 1) < ${5000}`)
        //   .orderBy(sql`ST_Distance(${kenyaWards.geom}, MakePoint(${lng}, ${lat}, 4326), 1)`)
        //   .limit(10);

        // console.log("results ==== ", logger.log("drizzle closest location results ", results));
        const query = await executeQuery<KenyaWardsSelect>(
          `
            SELECT 
              id,
              ward_code AS "wardCode",
              ward,
              county,
              county_code AS "countyCode",
              sub_county AS "subCounty",
              constituency,
              constituency_code AS "constituencyCode",
              AsGeoJSON(geom) AS geometry,
              ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1) AS distance
            FROM kenya_wards
            WHERE ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1) < 5000
            ORDER BY distance
            LIMIT 10
          `
        );
        // logger.log(" plain strin closest location results ", query);
        const results = query.data.slice(1);
        if (!results.length) {
          throw new Error("No nearby wards found");
        }

        return {
          results: results,
          error: null,
        };
      } catch (e) {
        console.log("error getting closest wards", e);
        return {
          results: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
  });

  if (isPending) {
    return (
      <View style={{paddingVertical:14}}>
        <LoadingIndicatorDots />
      </View>
    );
  }

  if (!data?.results || data?.results?.length === 0) {
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
            hint="No wards found in a 5km radius"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />

          <Button
            style={{ marginHorizontal: "20%" }}
            disabled={isRefetching}
            icon="reload"
            mode="contained"
            onPress={() => refetch()}>
            Reload
          </Button>
        </View>
      </View>
    );
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
      <View style={{paddingHorizontal:8}}>
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
