import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { MapBasemapPreset } from "@/lib/map-libre/map-style";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

interface MapBasemapToggleProps {
  preset: MapBasemapPreset;
  onPresetChange: (preset: MapBasemapPreset) => void;
}

export function MapBasemapToggle({ preset, onPresetChange }: MapBasemapToggleProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.host}>
      <IconButton
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="layers-outline" size={size} color={color} />
        )}
        size={22}
        onPress={() => onPresetChange(preset === "minimal" ? "standard" : "minimal")}
        containerColor={colors.surface}
        iconColor={colors.onSurface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: "flex-end",
  },
});
