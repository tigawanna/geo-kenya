import { useDeviceLocation } from "@/hooks/use-device-location";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, View } from "react-native";
import { Card, IconButton } from "react-native-paper";

import { LatLongForm } from "./forms/LatLongForm";
import { SingleWardByLatLng } from "./single-ward/SingleWardByLatLng";

export function CurrentLocation() {
  const { location, isRefreshing, refetch } = useDeviceLocation();
  const lat = location?.coords.latitude ?? 0;
  const lng = location?.coords.longitude ?? 0;

  return (
    <View style={styles.container}>
      <Card style={styles.banner} elevation={2}>
        <Card.Content style={styles.bannerContent}>
          <LatLongForm initLat={lat} initLng={lng} />
        </Card.Content>
      </Card>

      <SingleWardByLatLng
        lat={lat}
        lng={lng}
        backButton={false}
        actions={
          <View style={styles.actions}>
            <IconButton
              icon="content-copy"
              onPress={() => Clipboard.setStringAsync(`${lat},${lng}`)}
              size={20}
            />
            <IconButton
              icon="refresh"
              onPress={() => refetch()}
              loading={isRefreshing}
              size={20}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  banner: {
    flexShrink: 0,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 12,
  },
  bannerContent: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});
