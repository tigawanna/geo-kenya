import { Colors, customTheme, type CustomThemeKey } from "@/constants/Colors";
import { getMaterialDynamicTheme, isDynamicColorSupported } from "@/theme/material-dynamic-colors";
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from "react-native-paper";

type ThemeColors = MD3Theme["colors"];

function toPaperColors(colors: ThemeColors): ThemeColors {
  return {
    ...colors,
    tint: colors.tertiary,
    icon: colors.onBackground,
  } as ThemeColors;
}

function buildPaperTheme(base: MD3Theme, colors: ThemeColors): MD3Theme {
  return {
    ...base,
    colors: toPaperColors(colors),
  };
}

const defaultThemes = {
  light: buildPaperTheme(MD3LightTheme, Colors.light),
  dark: buildPaperTheme(MD3DarkTheme, Colors.dark),
};

const customPaperThemes = Object.fromEntries(
  (Object.keys(customTheme) as CustomThemeKey[]).map((key) => [
    key,
    {
      light: buildPaperTheme(MD3LightTheme, customTheme[key].light as ThemeColors),
      dark: buildPaperTheme(MD3DarkTheme, customTheme[key].dark as ThemeColors),
    },
  ]),
) as Record<CustomThemeKey, { light: MD3Theme; dark: MD3Theme }>;

let materialPaperThemes: { light: MD3Theme; dark: MD3Theme } | null = null;

function getMaterialPaperThemes(): { light: MD3Theme; dark: MD3Theme } {
  if (!materialPaperThemes) {
    const material = getMaterialDynamicTheme();
    materialPaperThemes = {
      light: buildPaperTheme(MD3LightTheme, material.light),
      dark: buildPaperTheme(MD3DarkTheme, material.dark),
    };
  }
  return materialPaperThemes;
}

export function resolvePaperTheme(
  colorScheme: CustomThemeKey | null,
  dynamicColors: boolean,
  isDarkMode: boolean,
): MD3Theme {
  if (colorScheme) {
    const themes = customPaperThemes[colorScheme];
    return isDarkMode ? themes.dark : themes.light;
  }

  if (dynamicColors && isDynamicColorSupported()) {
    const themes = getMaterialPaperThemes();
    return isDarkMode ? themes.dark : themes.light;
  }

  return isDarkMode ? defaultThemes.dark : defaultThemes.light;
}
