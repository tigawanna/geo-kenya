import { GenericBottomSheet } from "@/components/shared/modals/GenericBottomSheet";
import { checkIsPointInKenyaQueryOptions } from "@/data-access-layer/wards-query-options";
import { useDynamicBottomSheet } from "@/lib/react-native-bottom-sheet/use-dynamic-bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { LocationObject } from "expo-location";
import { useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text, Button, IconButton, Card } from "react-native-paper";
import { router } from "expo-router";
import type { BottomSheetMethods } from "@expo/ui/community/bottom-sheet";

interface NotInKenyaBottomSheetProps {
  location: {
    lat: number | undefined;
    lng: number | undefined;
  };
  sheetOptions: {
    sheetRef: React.RefObject<BottomSheetMethods | null>;
    snapPoints: string[];
    isOpen: boolean;
    handleSheetChange: (index: number) => void;
    handleSnapPress: (index: number) => void;
    handleClosePress: () => void;
  };
}

export function NotInKenyaBottomSheet({ location, sheetOptions }: NotInKenyaBottomSheetProps) {
  const loc = {
    lat: location?.lat,
    lng: location?.lng,
  };

  const { data } = useQuery({
    ...checkIsPointInKenyaQueryOptions(loc),
  });
  useEffect(() => {
    if (data?.results === "outside_kenya") {
      sheetOptions.handleSnapPress(5);
    }
  }, [data?.results, loc.lat, loc.lng]);
  return (
    <GenericBottomSheet options={sheetOptions}>
      <View style={styles.sheetContainer}>
        <IconButton 
          icon="close" 
          size={24} 
          onPress={() => sheetOptions.handleClosePress()} 
          style={styles.closeButton}
        />
        <NotInKenyaComponent onNavigate={() => sheetOptions.handleClosePress()} />
      </View>
    </GenericBottomSheet>
  );
}

interface NotInKenyaComponentProps {
  onNavigate?: () => void;
}

export function NotInKenyaComponent({ onNavigate }: NotInKenyaComponentProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          📍 Not In Kenya
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="bodyLarge" style={styles.message}>
            Your current location is outside Kenya.
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            To find a ward, you can:
          </Text>

          <View style={styles.optionContainer}>
            <Text variant="bodyMedium" style={styles.option}>
              🗺️ Tap on a location in kenya on the map
            </Text>
            <TouchableOpacity
              onPress={() => {
                onNavigate?.();
                router.push("/(tabs)/explore");
              }}>
              <Text variant="bodyMedium" style={[styles.option, styles.link]}>
                📋 Browse the complete ward list
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  container: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    flex: 1,
  },
  card: {
    elevation: 2,
  },
  message: {
    marginBottom: 12,
    fontWeight: "500",
  },
  subtitle: {
    marginBottom: 12,
    opacity: 0.8,
  },
  optionContainer: {
    gap: 8,
    marginTop: 4,
  },
  option: {
    lineHeight: 24,
  },
  link: {
    textDecorationLine: "underline",
    color: "#2196F3",
  },

});
