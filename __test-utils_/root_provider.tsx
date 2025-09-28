import React from "react";
import { render } from "@testing-library/react-native";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { ExpoSpatialiteWrapper } from "@/lib/expo-spatialite/app-wrapper";
import { GlobalSnackbar } from "@/lib/react-native-paper/snackbar/GlobalSnackbar";
import { useOnlineManager, useAppState } from "@/lib/tanstack/query/react-native-setup-hooks";
import { useSettingsStore } from "@/store/settings-store";
import { AppStateStatus, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false,staleTime:Infinity },
    mutations: { retry: false },
    
  },
});
function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

// Create a test wrapper with all providers
function AllTheProviders({ children }: { children: React.ReactNode }) {
  useOnlineManager();
  useAppState(onAppStateChange);
  const { dynamicColors } = useSettingsStore();
  const { colorScheme, paperTheme } = useThemeSetup(dynamicColors);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <ExpoSpatialiteWrapper>
              <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </ExpoSpatialiteWrapper>
            <GlobalSnackbar />
          </ThemeProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}

// Custom render function that includes providers
const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react-native";
export { customRender as render };
