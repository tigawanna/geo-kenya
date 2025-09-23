import { CurrentLocation } from "@/components/locations/CurrentLocation";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingTop: top }}>
      <CurrentLocation />
    </Surface>
  );
}

 