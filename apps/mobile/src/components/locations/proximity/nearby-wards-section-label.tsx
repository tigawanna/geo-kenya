import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export function NearbyWardsSectionLabel() {
  const theme = useTheme();

  return (
    <View style={styles.header}>
      <Text
        variant="titleSmall"
        style={[styles.label, { color: theme.colors.primary }]}>
        Nearby wards
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
