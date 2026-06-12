import { GenericBottomSheet } from "@/components/shared/modals/GenericBottomSheet";
import { getWardByLocation } from "@/data-access-layer/wards-query-options";
import {
  BottomSheetScrollView,
  type BottomSheetMethods,
} from "@expo/ui/community/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { ClosestWards } from "./proximity/ClosestWards";
import { SingleWardCard } from "./single-ward/SingleWardCard";

interface WardDetailBottomSheetProps {
  lat: number | null;
  lng: number | null;
  sheetOptions: {
    sheetRef: React.RefObject<BottomSheetMethods | null>;
    snapPoints: string[];
    isOpen: boolean;
    handleSheetChange: (index: number) => void;
    handleSnapPress: (index: number) => void;
    handleClosePress: () => void;
  };
  onClose: () => void;
}

export function WardDetailBottomSheet({
  lat,
  lng,
  sheetOptions,
  onClose,
}: WardDetailBottomSheetProps) {
  const { data } = useQuery({
    ...getWardByLocation({ lat: lat ?? 0, lng: lng ?? 0 }),
    enabled: lat != null && lng != null,
  });

  if (lat == null || lng == null) {
    return null;
  }

  return (
    <GenericBottomSheet options={sheetOptions}>
      <BottomSheetScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <IconButton
            icon="close"
            onPress={() => {
              sheetOptions.handleClosePress();
              onClose();
            }}
          />
        </View>
        {data?.result ? (
          <SingleWardCard ward={data.result} backButton={false} />
        ) : null}
        <ClosestWards lat={lat} lng={lng} />
      </BottomSheetScrollView>
    </GenericBottomSheet>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    alignItems: "flex-end",
  },
});
