import { useDeviceLocation } from "@/hooks/use-device-location";
import * as Clipboard from "expo-clipboard";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Card style={styles.banner} elevation={4}>
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  scrollContent: {
    // gap: 16,
    // paddingBottom: 16,
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
});
