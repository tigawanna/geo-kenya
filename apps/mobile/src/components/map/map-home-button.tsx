import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

function navigateToHome(router: ReturnType<typeof useRouter>) {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace("/(tabs)");
}

export function MapHomeButton() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={styles.host}>
      <IconButton
        icon="home"
        size={22}
        onPress={() => navigateToHome(router)}
        containerColor={colors.surface}
        iconColor={colors.onSurface}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: "flex-start",
  },
});
