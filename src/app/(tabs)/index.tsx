import { CurrentLocation } from "@/components/locations/CurrentLocation";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
    const { top } = useSafeAreaInsets();
    // const { data } = useQuery(
    //   checkIsPointInKenyaQueryOptions({ lat: -1.16972893282049, lng: 36.82946781044468 })
    //   // checkIsPointInKenyaQueryOptions({ lat: -6.7924, lng: 39.2083 })
    // );
    // console.log("is the point in kenya === ",data);
  return (
    <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center",paddingTop: top }}>
      <CurrentLocation />
    </Surface>
  );
}

 