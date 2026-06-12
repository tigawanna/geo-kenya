import { MenuView } from "@expo/ui/community/menu";
import MaterialCommunityIcons from "@react-native-vector-icons/material-design-icons/static";
import {
  MAP_BASEMAP_OPTIONS,
  type MapBasemapPreset,
} from "@/lib/map-libre/map-style";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

interface MapBasemapPickerProps {
  preset: MapBasemapPreset;
  onPresetChange: (preset: MapBasemapPreset) => void;
}

export function MapBasemapPicker({ preset, onPresetChange }: MapBasemapPickerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.host}>
      <MenuView
        title="Map style"
        actions={MAP_BASEMAP_OPTIONS.map((option) => ({
          id: option.id,
          title: option.title,
          state: preset === option.id ? "on" : "off",
        }))}
        onPressAction={({ nativeEvent }) => {
          const next = nativeEvent.event as MapBasemapPreset;
          if (MAP_BASEMAP_OPTIONS.some((option) => option.id === next)) {
            onPresetChange(next);
          }
        }}>
        <IconButton
          icon={({ size, color }) => (
            <MaterialCommunityIcons name="layers-outline" size={size} color={color} />
          )}
          size={22}
          containerColor={colors.surface}
          iconColor={colors.onSurface}
        />
      </MenuView>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: "flex-end",
  },
});
