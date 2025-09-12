import {
    Colors,
    defaultMaterial3PrimaryDarkTheme,
    defaultMaterial3PrimaryLightTheme,
} from "@/constants/Colors";
import { useThemeStore } from "@/store/settings-store";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import { MaterialDynamicTheme, useMaterialDynamicColors } from "@/modules/expo-material-dynamic-colors/src/index";
// import { MaterialDynamicTheme, useMaterialDynamicColors } from "@/modules/expo-material-dynamic-colors/src/index";
// import { useThemeStore } from "@/stores/app-settings-store";
import merge from "deepmerge";
import { adaptNavigationTheme, MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export function useThemeSetup(dynamicColors?: boolean) {
  // Get device-generated Material You theme
  const { theme: material3Theme } = useMaterialDynamicColors();
    // {fallbackSourceColor: Colors.light.primary},
  // Get stored theme preference
  const { theme: userThemePreference, isDarkMode } = useThemeStore();

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  // Use Material You theme if available, otherwise fall back to custom theme
  const lightThemeColors = dynamicColors
    ? materialYouThemeOrMyTheme(material3Theme).light
    : Colors.light;
  const darkThemeColors = dynamicColors
    ? materialYouThemeOrMyTheme(material3Theme).dark
    : Colors.dark;
  // const lightThemeColors = Colors.light;
  // const darkThemeColors = Colors.dark;

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
      light: theme.light,
      dark: theme.dark,
    };
  }
}
