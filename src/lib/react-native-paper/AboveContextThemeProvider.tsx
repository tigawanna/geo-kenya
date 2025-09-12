import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { useSettingsStore } from "@/store/settings-store";
import {PaperProvider } from "react-native-paper";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

export function AboveContextThemeProvider({ children }: { children: React.ReactNode }) {
  // This component is used to provide a theme context
  const { dynamicColors } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeProvider>
  );
}
