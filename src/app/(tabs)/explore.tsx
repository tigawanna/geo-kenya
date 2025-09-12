import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: top }}>
      <Text variant="headlineMedium">Explore screen</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
