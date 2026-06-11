import { useDeviceLocation } from "@/hooks/use-device-location";
import * as Clipboard from "expo-clipboard";
import { StyleSheet, Text, View } from "react-native";
import { Card, IconButton, useTheme } from "react-native-paper";

import { LoadingFallback } from "../state-screens/LoadingFallback";
import { LatLongForm } from "./forms/LatLongForm";
import { SingleWardByLatLng } from "./single-ward/SingleWardByLatLng";

export function CurrentLocation() {
  const theme = useTheme();

  const { errorMsg, location, isRefreshing, refetch, isLoading } = useDeviceLocation();
  const lat = location?.coords.latitude ?? 0;
  const lng = location?.coords.longitude ?? 0;

  return (
    <View style={styles.container}>
      <Card style={styles.banner} elevation={2}>
        <Card.Content
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            padding: 0,
            paddingBottom: 2,
            paddingTop: 0,
            gap: 0,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            {/* Left Side: Icon + Title */}
            <View style={{ gap: 0, width: "100%" }}>
              <LatLongForm initLat={lat} initLng={lng} />
            </View>
          </View>
        </Card.Content>
      </Card>

      <SingleWardByLatLng
        lat={lat}
        lng={lng}
        backButton={false}
        preferBottomSheet
        actions={
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <IconButton
              icon="content-copy"
              onPress={() => Clipboard.setStringAsync(`${lat},${lng}`)}
              style={{ padding: 0 }}
            />
            <IconButton
              icon="refresh"
              onPress={() => refetch()}
              loading={isRefreshing}
              style={{ padding: 0 }}
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
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 0,
    borderRadius: 12,
  },
});
