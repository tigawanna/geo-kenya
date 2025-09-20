import { MaterialIcon } from "@/components/default/ui/icon-symbol";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { WardListItem } from "../list/WardListItem";
import { LoadingIndicatorDots } from "@/components/state-screens/LoadingIndicatorDots";
import { getClosestWardsByGeomQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { logger } from "@/utils/logger";
import { NoDataScreen } from "@/components/state-screens/NoDataScreen";

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
      <View style={{ paddingVertical: 14, minHeight:200 }}>
        <LoadingIndicatorDots />
      </View>
    );
  }
  logger.log("closets by geom", data);
  if (!data?.results || data?.results?.length === 0) {
    return (
      <View
        style={{
          width: "100%",
          gap: 6,
        }}>
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
    <ScrollView style={styles.container}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    gap: 6,
    paddingHorizontal: 6,
    marginBottom: 36,
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
