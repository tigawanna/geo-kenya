import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { MapBasemapPreset } from "@/lib/map-libre/map-style";
import { StyleSheet, View } from "react-native";
import { IconButton, Portal, Surface, Text, useTheme } from "react-native-paper";

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
      <Portal>
        <Surface style={[styles.badge, { backgroundColor: colors.surfaceContainerHigh }]} elevation={1}>
          <Text variant="labelSmall" style={{ color: colors.onSurface }}>
            {preset === "minimal" ? "Light map" : "OSM map"}
          </Text>
        </Surface>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: "flex-end",
    margin: 12,
  },
  badge: {
    position: "absolute",
    top: 52,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
