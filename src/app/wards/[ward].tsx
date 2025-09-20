import { SingleWardById } from "@/components/locations/single-ward/SingleWardById";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SingleWard() {
  const { ward } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
      <SingleWardById wardId={ward as string} />
    </Surface>
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
