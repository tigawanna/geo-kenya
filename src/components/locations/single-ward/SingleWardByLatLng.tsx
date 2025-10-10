import { useDynamicBottomSheet } from "@/lib/react-native-bottom-sheet/use-dynamic-bottom-sheet";
import { ScrollView, StyleSheet } from "react-native";
import { CurrentWard } from "../CurrentWard";
import { ClosestWards } from "../proximity/ClosestWards";
import { NotInKenyaBottomSheet } from "../proximity/NotInKenyaBottomSheet";
import { IconButton } from "react-native-paper";
import { useQueryClient } from "@tanstack/react-query";
import { checkIsPointInKenyaQueryOptions } from "@/data-access-layer/wards-query-options";
import { manuallySetLocation } from "@/hooks/use-device-location";

interface SingleWardByLatLngProps {
  lat: number;
  lng: number;
  actions?: React.ReactNode;
  backButton?: boolean;
}

export function SingleWardByLatLng({ lat, lng, actions, backButton }: SingleWardByLatLngProps) {
  const noticeSheet = useDynamicBottomSheet();
  const qc = useQueryClient();
  const newYorkCorrds = {
    lat: 40.7128,
    lng: -74.006,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <IconButton
        icon={"show"}
        onPress={() => {
          // qc.setQueryData(["device-location"],{
          //   // coords: {
          // });
          manuallySetLocation({ lat: newYorkCorrds.lat, lng: newYorkCorrds.lng, qc });
          // noticeSheet.handleSnapPress(5);
        }}
      />
      <CurrentWard lat={lat} lng={lng} actions={actions} backButton={backButton} />
      <NotInKenyaBottomSheet location={{ lat, lng }} sheetOptions={noticeSheet} />
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
