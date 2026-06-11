import { CurrentLocation } from "@/components/locations/CurrentLocation";
import { wardsQueryOptions } from "@/data-access-layer/wards-query-options";
import { useQueryClient } from "@tanstack/react-query";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const qc = useQueryClient();
  qc.prefetchQuery(
    wardsQueryOptions({
      searchQuery: "",
    })
  );

  return (
    <Surface style={{ flex: 1, paddingTop: top }}>
      <CurrentLocation />
    </Surface>
  );
}
