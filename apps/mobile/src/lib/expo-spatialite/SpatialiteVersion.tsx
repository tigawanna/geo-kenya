import ExpoSpatialiteModule from "@/modules/expo-spatialite/src/ExpoSpatialiteModule";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet } from "react-native";
import { Text, Surface } from "react-native-paper";


export function SpatialiteVersion() {
  const { data, isPending } = useQuery({
    queryKey: ["spatialite-version"],
    queryFn: async () => {
      // Simulate an async operation, e.g., fetching data from an API
      return new Promise<string>((resolve) => {
        setTimeout(() => {
          const version = ExpoSpatialiteModule.getSpatialiteVersion();
          resolve(version);
        }, 1000);
      });
    },
  });
  return (
    <Surface style={{ ...styles.container }}>
      <Text variant="titleLarge">SpatialiteVersion</Text>
      {isPending && <Text>Loading...</Text>}
      {data && <Text>Version: {data}</Text>}
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
