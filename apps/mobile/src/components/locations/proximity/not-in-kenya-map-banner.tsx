import { MaterialIcon } from "@/components/default/ui/icon-symbol";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

interface NotInKenyaMapBannerProps {
  onDismiss: () => void;
}

export function NotInKenyaMapBanner({ onDismiss }: NotInKenyaMapBannerProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View
        style={[
          styles.banner,
          {
            backgroundColor: theme.colors.errorContainer,
            borderColor: theme.colors.outlineVariant,
          },
        ]}>
        <MaterialIcon name="location-off" size={20} color={theme.colors.error} />

        <View style={styles.textBlock}>
          <Text variant="labelLarge" style={{ color: theme.colors.onErrorContainer }}>
            Outside Kenya
          </Text>
          <Pressable
            onPress={() => {
              onDismiss();
              router.push("/(tabs)/explore");
            }}>
            <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
              Tap a point on the map or browse wards
            </Text>
          </Pressable>
        </View>

        <IconButton icon="close" size={18} onPress={onDismiss} style={styles.close} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 56,
    zIndex: 25,
    elevation: 25,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  close: {
    margin: 0,
  },
});
