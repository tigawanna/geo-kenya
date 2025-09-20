import { getWardById } from "@/data-access-layer/wards-query-options";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SingleWardCard } from "./SingleWardCard";

interface SingleWardByIdProps {
  wardId: string;
}
export function SingleWardById({ wardId }: SingleWardByIdProps) {
  const {data} = useQuery(getWardById({ id: Number(wardId) }));
  const ward = data?.result
  return (
    <View style={{ ...styles.container }}>
      <SingleWardCard ward={ward} />
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
