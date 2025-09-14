import { useDeviceLocation } from "@/hooks/use-device-location";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Button, Card, IconButton, useTheme } from "react-native-paper";
import { NoDataScreen } from "../state-screens/NoDataScreen";
import { MaterialIcon } from "../default/ui/icon-symbol";
import { CurretWard } from "./CurretWard";
import { ClosestWards } from "./ClosestWards";

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
  if (errorMsg) {
    return (
      <View style={{ ...styles.container }}>
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.surface, gap: 16 }]}>
          <MaterialIcon name="error" size={48} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.onSurface }]}>{errorMsg}</Text>
        </View>
      </View>
    );
  }
  if (!location) {
    return (
      <View style={styles.container}>
        {isRefreshing ? (
          <ActivityIndicator
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 1000,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          />
        ) : null}
        <View style={{ height: "80%" }}>
          <NoDataScreen
            listName="Current location"
            hint="Location data not found"
            icon={<MaterialIcon color={theme.colors.primary} name="location-city" size={64} />}
          />

          <Button
            style={{ marginHorizontal: "20%" }}
            disabled={isRefreshing}
            icon="reload"
            mode="contained"
            onPress={() => {
              refetch();
            }}>
            Check again
          </Button>
        </View>
      </View>
    );
  }

  const lat = location?.coords.latitude;
  const lng = location?.coords.longitude;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {lat && lng && (
        <Card style={styles.banner} elevation={4}>
          <Card.Content style={styles.bannerContent}>
            {/* Left Side: Icon + Title */}
            <View style={{gap:6}}>
            <View style={styles.leftSide}>
              <MaterialIcon name="my-location" size={20} color={theme.colors.primary} />
              <Text style={[styles.bannerTitle, { color: theme.colors.onSurfaceVariant }]}>
                CURRENT LOCATION
              </Text>
            </View>
            {/* Center: Coordinates */}
            <Text style={[styles.coordinatesText, { color: theme.colors.onSurface,paddingLeft:6 }]}>
              {lat.toFixed(4)}°, {lng.toFixed(4)}°
            </Text>
          </View>

            {/* Right Side: Refresh Button */}
            <IconButton
              icon="refresh"
              onPress={() => refetch()}
              style={{ padding: 0 }}
            />
          </Card.Content>
        </Card>
      )}
      <CurretWard location={location} />
      <ClosestWards location={location} />
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
    paddingBottom: 16,
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
    alignItems: "center",
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
