import { SingleWardByLatLng } from "@/components/locations/single-ward/SingleWardByLatLng";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Surface } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SingleWardAtLatLong() {
  const { coords } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const [lat, lng] = (coords as string)?.split(",") ?? [0, 0];
  return (
    <Surface style={{ ...styles.container, paddingTop: top }}>
      <SingleWardByLatLng
        lat={Number(lat)}
        lng={Number(lng)}
        backButton={true}
        // actions={
        //   <View style={{ flexDirection: "row", justifyContent: "center" }}>
        //     <IconButton
        //       icon="content-copy"
        //       onPress={() => Clipboard.setStringAsync(`${lat},${lng}`)}
        //       style={{ padding: 0 }}
        //     />
        //     <IconButton
        //       icon="refresh"
        //       onPress={() => refetch()}
        //       loading={isRefreshing}
        //       style={{ padding: 0 }}
        //     />
        //   </View>
        // }
      />
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
