import { useState } from 'react';
import { Platform } from 'react-native';

import { MaterialDynamicColors, MaterialDynamicTheme, SystemScheme } from './ExpoMaterialDynamicColors.types';
import ExpoMaterialDynamicColorsModule from './ExpoMaterialDynamicColorsModule';
import { createThemeFromSourceColor, createThemeFromSystemSchemes } from './utils/createDynamicTheme';

export const isDynamicThemeSupported =
  !!ExpoMaterialDynamicColorsModule && Platform.OS === 'android' && Platform.Version >= 31;

/**
 * Hook to manage Material Dynamic Colors theme.
 *
 * It returns:
 * - a Material Dynamic Colors theme:
 *   - the system theme (or a fallback theme if not supported) if sourceColor is not provided
 *   - a theme based on sourceColor if provided
 * - a function to update the theme based on a source color
 * - a function to reset the theme to default
 *
 * @param params.fallbackSourceColor - optional - source color for the fallback theme (default to #6750A4)
 * @param params.sourceColor - optional - source color for the theme (overwrite system theme)
 * @returns
 */
export function useMaterialDynamicColors(params?: { fallbackSourceColor?: string; sourceColor?: string }) {
  const { fallbackSourceColor = '#6750A4', sourceColor } = params || {};

  const [theme, setTheme] = useState<MaterialDynamicTheme>(
    sourceColor ? createMaterialDynamicTheme(sourceColor) : getMaterialDynamicTheme(fallbackSourceColor)
  );

  const updateTheme = (sourceColor: string) => {
    setTheme(createThemeFromSourceColor(sourceColor));
  };

  const resetTheme = () => {
    setTheme(getMaterialDynamicTheme(fallbackSourceColor));
  };

  return { theme, updateTheme, resetTheme };
}

/**
 * Get the Material Dynamic Colors theme from the system (works only on Android 12+).
 *
 * If the system does not support Material Dynamic Colors, it will return a theme based on the fallback source color.
 *
 * @param fallbackSourceColor source color for the fallback theme (default to #6750A4)
 * @returns
 */
export function getMaterialDynamicTheme(fallbackSourceColor: string = '#6750A4'): MaterialDynamicTheme {
  if (!isDynamicThemeSupported) {
    return createThemeFromSourceColor(fallbackSourceColor);
  }

  const systemSchemes = ExpoMaterialDynamicColorsModule.getSystemTheme() as {
    light: SystemScheme;
    dark: SystemScheme;
  } | null;

  if (systemSchemes) {
    return createThemeFromSystemSchemes(systemSchemes);
  }
  return createThemeFromSourceColor(fallbackSourceColor);
}

export async function getMaterialDynamicThemeAsync(fallbackSourceColor: string = '#6750A4'): Promise<MaterialDynamicTheme> {
  if (!isDynamicThemeSupported) {
    return createThemeFromSourceColor(fallbackSourceColor);
  }

  const systemSchemes = (await ExpoMaterialDynamicColorsModule.getSystemThemeAsync()) as {
    light: SystemScheme;
    dark: SystemScheme;
  } | null;

  if (systemSchemes) {
    return createThemeFromSystemSchemes(systemSchemes);
  }
  return createThemeFromSourceColor(fallbackSourceColor);
}

/**
 * Create a Material Dynamic Colors theme based on the source color.
 *
 * @param sourceColor source color for the theme
 * @returns
 */
export function createMaterialDynamicTheme(sourceColor: string): MaterialDynamicTheme {
  return createThemeFromSourceColor(sourceColor);
}

export { MaterialDynamicColors, MaterialDynamicTheme, SystemScheme };
