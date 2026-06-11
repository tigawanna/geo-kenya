import { StyleSheet, View } from "react-native";
import { CurrentWard } from "../CurrentWard";

interface SingleWardByLatLngProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
  preferBottomSheet?: boolean;
}

export function SingleWardByLatLng({
  lat,
  lng,
  actions,
  backButton,
  preferBottomSheet,
}: SingleWardByLatLngProps) {
  return (
    <View style={styles.container}>
      <CurrentWard
        lat={lat}
        lng={lng}
        actions={actions}
        backButton={backButton}
        preferBottomSheet={preferBottomSheet}
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
