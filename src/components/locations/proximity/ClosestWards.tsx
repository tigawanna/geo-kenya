import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { getClosestWardsByCorrdsQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { WardListItem } from "../list/WardListItem";
import { NearbyWardsSectionLabel } from "./nearby-wards-section-label";

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
    }),
  );

  if (isPending) {
    return (
      <View style={styles.loading}>
        <NearbyWardsSectionLabel />
        <LoadingIndicatorDots />
      </View>
    );
  }

  if (!data?.results || data?.results?.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <NearbyWardsSectionLabel />
      <View style={styles.list}>
        {data.results.map((ward) => (
          <WardListItem key={ward.id} item={ward} theme={theme} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  loading: {
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 8,
  },
});
