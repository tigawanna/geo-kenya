import { useDeviceLocation } from "@/hooks/use-device-location";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Button, Card, IconButton, useTheme } from "react-native-paper";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { CurretWard } from "./CurretWard";
import { ClosestWards } from "./ClosestWards";
import { LatLongForm } from "./form/LatLongForm";

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
  // if (errorMsg) {
  //   return (
  //     <View style={{ ...styles.container }}>
  //       <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface, gap: 16 }]}>
  //         <MaterialIcon name="error" size={48} color={theme.colors.error} />
  //         <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>{errorMsg}</Text>
  //         <Text style={[styles.hintText, { color: theme.colors.onSurfaceVariant }]}>
  //           For better location accuracy, enable network/WiFi alongside location services
  //         </Text>

  //         <Button
  //           style={{ marginHorizontal: "20%" }}
  //           disabled={isRefreshing}
  //           loading={isRefreshing}
  //           icon="reload"
  //           mode="contained-tonal"
  //           onPress={() => {
  //             refetch();
  //           }}>
  //           Check again
  //         </Button>
  //       </View>
  //     </View>
  //   );
  // }
  // if (!location) {
  //   return (
  //     <View style={styles.container}>
  //       {isRefreshing ? (
  //         <ActivityIndicator
  //           style={{
  //             position: "absolute",
  //             top: "50%",
  //             left: "50%",
  //             zIndex: 1000,
  //             transform: [{ translateX: -20 }, { translateY: -20 }],
  //           }}
  //         />
  //       ) : null}
  //       <View style={{ height: "80%" }}>
  //         <NoDataScreen
  //           listName="Current location"
  //           hint="Location data not found"
  //           icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
  //         />

  //         <Button
  //           style={{ marginHorizontal: "20%" }}
  //           disabled={isRefreshing}
  //           loading={isRefreshing}
  //           icon="reload"
  //           mode="contained"
  //           onPress={() => {
  //             refetch();
  //           }}>
  //           Check again
  //         </Button>
  //       </View>
  //     </View>
  //   );
  // }

  const lat = location?.coords.latitude??0;
  const lng = location?.coords.longitude??0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Card style={styles.banner} elevation={4}>
        <Card.Content
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
          }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            {/* Left Side: Icon + Title */}
            <View style={{ gap: 0, width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 8,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                  }}>
                  <MaterialIcon name="my-location" size={20} color={theme.colors.primary} />
                  <Text style={[styles.bannerTitle, { color: theme.colors.onSurfaceVariant }]}>
                    CURRENT LOCATION
                  </Text>
                </View>
                <IconButton
                  icon="refresh"
                  onPress={() => refetch()}
                  loading={isRefreshing}
                  style={{ padding: 0 }}
                />
                {/* Center: Coordinates */}
              </View>
              <LatLongForm initLat={lat} initLng={lng} />
            </View>

            {/* Right Side: Refresh Button */}
          </View>
        </Card.Content>
      </Card>
      <CurretWard lat={lat} lng={lng} />
      <ClosestWards lat={lat} lng={lng} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  scrollContent: {
    gap: 16,
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
  hintText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  leftSide: {
    flexDirection: "row",
    // alignItems: "center",
    gap: 8,
  },
  bannerTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  coordinatesText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "monospace",
    flex: 1,
    textAlign: "center",
  },
});
