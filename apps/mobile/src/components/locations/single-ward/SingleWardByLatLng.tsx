import { StyleSheet, View } from "react-native";
import { CurrentWard } from "../CurrentWard";

interface SingleWardByLatLngProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
  homeButton?: boolean;
  mapCoachmarkId?: string;
  basemapCoachmarkId?: string;
}

export function SingleWardByLatLng({
  lat,
  lng,
  actions,
  backButton,
  homeButton,
  mapCoachmarkId,
  basemapCoachmarkId,
}: SingleWardByLatLngProps) {
  return (
    <View style={styles.container}>
      <CurrentWard
        lat={lat}
        lng={lng}
        actions={actions}
        backButton={backButton}
        homeButton={homeButton}
        mapCoachmarkId={mapCoachmarkId}
        basemapCoachmarkId={basemapCoachmarkId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});
