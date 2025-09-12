import { db } from "@/lib/drizzle/client";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { LoadingFallback } from "../state-screens/LoadingFallback";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { MaterialIcon } from "../default/ui/icon-symbol";

export function KenyaWards() {
  const { colors } = useTheme();
  const { data, isPending } = useQuery({
    queryKey: ["wards"],
    queryFn: async () => {
      try {
        const result = await db.query.kenyaWards.findMany();
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
  if (data?.error) {
    return (
      <View style={{ ...styles.container }}>
        <Text>{data.error}</Text>
      </View>
    );
  }
  if (!data?.result || data.result.length === 0) {
    return (
      <NoDataScreen
        listName="Wards"
        hint="No wards found"
        icon={<MaterialIcon color={colors.primary} name="work-history" />}
      />
    );
  }
  return (
    <View style={{ ...styles.container }}>
      <Text variant="headlineMedium">Wards</Text>
      {/* <FlatList/> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
