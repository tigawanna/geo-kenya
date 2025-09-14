import { KenyaWards } from "@/components/locations/KenyaWards";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <Surface style={{ flex: 1, paddingTop: top, justifyContent: "center" }}>
      <KenyaWards />
    </Surface>
  );
}
