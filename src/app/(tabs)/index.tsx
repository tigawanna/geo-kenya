import { CurrentLocation } from "@/components/locations/CurrentLocation";
import { Surface } from "react-native-paper";

export default function HomeScreen() {
  return (
    <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <CurrentLocation />
    </Surface>
  );
}
