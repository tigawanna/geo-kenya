import { Colors, customTheme } from "@/constants/Colors";
import { useSettingsStore, useThemeStore } from "@/store/settings-store";
import {
  getMaterialDynamicTheme,
  isDynamicColorSupported,
} from "@/theme/material-dynamic-colors";
import merge from "deepmerge";
import { useMemo } from "react";
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";

export function useThemeSetup() {
  const { theme: userThemePreference, isDarkMode } = useThemeStore();
  const { dynamicColors, colorScheme } = useSettingsStore();

  const paperTheme = useMemo(() => {
    let lightThemeColors: MD3Theme["colors"] = Colors.light;
    let darkThemeColors: MD3Theme["colors"] = Colors.dark;

    if (colorScheme) {
      const customLight = customTheme[colorScheme].light;
      const customDark = customTheme[colorScheme].dark;
      lightThemeColors = {
        ...customLight,
        tint: customLight.tertiary,
        icon: customLight.onBackground,
      } as unknown as MD3Theme["colors"];
      darkThemeColors = {
        ...customDark,
        tint: customDark.tertiary,
        icon: customDark.onBackground,
      } as unknown as MD3Theme["colors"];
    } else if (dynamicColors && isDynamicColorSupported()) {
      const materialTheme = getMaterialDynamicTheme();
      lightThemeColors = {
        ...materialTheme.light,
        tint: materialTheme.light.tertiary,
        icon: materialTheme.light.onBackground,
      } as unknown as MD3Theme["colors"];
      darkThemeColors = {
        ...materialTheme.dark,
        tint: materialTheme.dark.tertiary,
        icon: materialTheme.dark.onBackground,
      } as unknown as MD3Theme["colors"];
    }

    const lightBasedTheme = merge(MD3LightTheme, {
      colors: lightThemeColors,
    });

    const darkBasedTheme = merge(MD3DarkTheme, {
      colors: darkThemeColors,
    });

    return isDarkMode ? darkBasedTheme : lightBasedTheme;
  }, [colorScheme, dynamicColors, isDarkMode]);

  return {
    paperTheme,
    colorScheme: userThemePreference,
    isDarkMode,
  };
}
