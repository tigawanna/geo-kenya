import { MaterialIcon } from "@/components/default/ui/icon-symbol";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { NoDataScreen } from "@/components/state-screens/NoDataScreen";
import { getClosestWardsByGeomQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import { WardListItem } from "../list/WardListItem";
import { NearbyWardsSectionLabel } from "./nearby-wards-section-label";

interface ClosestWardsByGeomProps {
  wardId?: number;
}

export function ClosestWardsByGeom({ wardId }: ClosestWardsByGeomProps) {
  const theme = useTheme();
  const { data, isPending, isRefetching, refetch } = useQuery({
    ...getClosestWardsByGeomQueryOptions({
      wardId,
    }),
  });

  if (isPending) {
    return (
      <View style={styles.loading}>
        <NearbyWardsSectionLabel />
        <LoadingIndicatorDots />
      </View>
    );
  }

  if (!data?.results || data?.results?.length === 0) {
    return (
      <View style={styles.empty}>
        <NoDataScreen
          listName="Wards"
          hint="No wards found in a 5km radius"
          icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
        />
        <Button
          style={styles.reload}
          disabled={isRefetching}
          icon="reload"
          mode="contained-tonal"
          onPress={() => refetch()}>
          Reload
        </Button>
      </View>
    );
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
    marginBottom: 24,
  },
  loading: {
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 8,
  },
  empty: {
    width: "100%",
    gap: 8,
    paddingVertical: 12,
  },
  reload: {
    marginHorizontal: "20%",
  },
});
