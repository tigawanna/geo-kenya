import {
    Colors,
    customTheme,
    defaultMaterial3PrimaryDarkTheme,
    defaultMaterial3PrimaryLightTheme,
} from "@/constants/Colors";
import { useSettingsStore, useThemeStore } from "@/store/settings-store";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import { MaterialDynamicTheme, useMaterialDynamicColors } from "@/modules/expo-material-dynamic-colors/src/index";
// import { MaterialDynamicTheme, useMaterialDynamicColors } from "@/modules/expo-material-dynamic-colors/src/index";
// import { useThemeStore } from "@/stores/app-settings-store";
import merge from "deepmerge";
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { logger } from "@/utils/logger";

export function useThemeSetup() {
  // Get device-generated Material You theme
  const { theme: material3Theme } = useMaterialDynamicColors();
  // logger.log("material3Theme", material3Theme);
  
  // Get stored theme and color scheme preferences
  const { theme: userThemePreference, isDarkMode } = useThemeStore();
  const { dynamicColors, colorScheme } = useSettingsStore();

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  // Determine theme colors based on colorScheme and dynamicColors
  let lightThemeColors = Colors.light;
  let darkThemeColors = Colors.dark;

  if (colorScheme) {
    // Use custom theme when colorScheme is selected
    const customLight = customTheme[colorScheme].light;
    const customDark = customTheme[colorScheme].dark;
    lightThemeColors = { ...customLight, tint: customLight.tertiary, icon: customLight.onBackground };
    darkThemeColors = { ...customDark, tint: customDark.tertiary, icon: customDark.onBackground };
  } else if (dynamicColors) {
    // Use Material You theme when System Default and dynamic colors enabled
    const materialTheme = materialYouThemeOrMyTheme(material3Theme);
    lightThemeColors = materialTheme.light;
    darkThemeColors = materialTheme.dark;
  }

  // Create combined themes (Material You or fallback)
  const lightBasedTheme = merge(LightTheme, {
    ...MD3LightTheme,
    colors: lightThemeColors,
  });

  const darkBasedTheme = merge(DarkTheme, {
    ...MD3DarkTheme,
    colors: darkThemeColors,
  });

  // Use the appropriate theme based on user preference
  const paperTheme = isDarkMode ? darkBasedTheme : lightBasedTheme;

  return {
    paperTheme,
    colorScheme: userThemePreference,
    isDarkMode,
  };
}

function materialYouThemeOrMyTheme(theme: MaterialDynamicTheme) {
  if (
    theme.dark.primary === defaultMaterial3PrimaryDarkTheme &&
    theme.light.primary === defaultMaterial3PrimaryLightTheme
  ) {
    return {
      light: Colors.light,
      dark: Colors.dark,
    };
  } else {
    return {
      light: { ...theme.light, tint: theme.light.tertiary, icon: theme.light.onBackground },
      dark: { ...theme.dark, tint: theme.dark.tertiary, icon: theme.dark.onBackground },
    };
  }
}
