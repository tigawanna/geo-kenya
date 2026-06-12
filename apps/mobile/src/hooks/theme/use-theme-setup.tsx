import { useSettingsStore, useThemeStore } from "@/store/settings-store";
import { resolvePaperTheme } from "@/theme/paper-themes";

export function useThemeSetup() {
  const { theme: userThemePreference, isDarkMode } = useThemeStore();
  const colorScheme = useSettingsStore((state) => state.colorScheme);
  const dynamicColors = useSettingsStore((state) => state.dynamicColors);

  const paperTheme = resolvePaperTheme(colorScheme, dynamicColors, isDarkMode);

  return {
    paperTheme,
    colorScheme: userThemePreference,
    isDarkMode,
  };
}
