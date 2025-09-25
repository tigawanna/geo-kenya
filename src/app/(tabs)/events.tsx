import { WardEventsList } from "@/components/events/WardEventsList";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";

export default function WardEvents() {
  return (
    <Surface style={{ ...styles.container }}>
      <WardEventsList />
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
