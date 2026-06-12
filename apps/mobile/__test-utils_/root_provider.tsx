import React from "react";
import { render } from "@testing-library/react-native";
import { focusManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PaperProvider } from "react-native-paper";
import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { InitDatabase } from "@/lib/drizzle/InitDatabase";
import { GlobalSnackbar } from "@/lib/react-native-paper/snackbar/GlobalSnackbar";
import { useOnlineManager, useAppState } from "@/lib/tanstack/query/react-native-setup-hooks";
import { AppStateStatus, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: Infinity },
    mutations: { retry: false },
  },
});
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

function AllTheProviders({ children }: { children: React.ReactNode }) {
  useOnlineManager();
  useAppState(onAppStateChange);
  const { colorScheme, paperTheme } = useThemeSetup();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <InitDatabase>
              <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </InitDatabase>
            <GlobalSnackbar />
          </ThemeProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react-native";
export { customRender as render };
