import { useDeviceLocation } from "@/hooks/use-device-location";
import * as Clipboard from "expo-clipboard";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card, IconButton, useTheme } from "react-native-paper";
import { MaterialIcon } from "../default/ui/icon-symbol";

import { LatLongForm } from "./form/LatLongForm";
import { SingleWardByLatLng } from "./single-ward/SingleWardByLatLng";

export function CurrentLocation() {
  const theme = useTheme();
  const { errorMsg, location, isRefreshing, refetch, isLoading } = useDeviceLocation();

  if (isLoading) {
    return (
      <View style={{ ...styles.container }}>
        <View style={[styles.errorContainer, { gap: 16 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <MaterialIcon color={theme.colors.primary} name="location-city" size={64} />
          <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>
            Getting your location...
          </Text>
        </View>
      </View>
    );
  }

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

              {(errorMsg || !location) && (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4, marginVertical: 4 }}>
                  <MaterialIcon name="warning" size={16} color={theme.colors.error} />
                  <Text style={{ fontSize: 12, color: theme.colors.error }}>
                    Device location unavailable ,
                    <Text style={{ fontSize: 10, color: theme.colors.error }}>
                      Try typing in tne coordinates manually
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      <SingleWardByLatLng
        lat={lat}
        lng={lng}
        backButton={false}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
  },
  banner: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
});
