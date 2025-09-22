import { ScrollView, StyleSheet } from "react-native";
import { CurrentWard } from "../CurrentWard";
import { ClosestWards } from "../proximity/ClosestWards";

interface SingleWardByLatLngProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
}

export function SingleWardByLatLng({ lat, lng, actions,backButton }: SingleWardByLatLngProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <CurrentWard lat={lat} lng={lng} actions={actions} backButton={backButton}/>
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
    // gap: 16,
    // paddingBottom: 16,
    // justifyContent: "center",
    // alignItems: "center",
  },
});
