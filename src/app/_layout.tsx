import { useThemeSetup } from "@/hooks/theme/use-theme-setup";
import { ExpoSpatialiteWrapper } from "@/lib/expo-spatialite/app-wrapper";
import {
  initializePullEventsBackgroundTask,
  initializePushEventsBackgroundTask,
} from "@/lib/expo-spatialite/sync/background-task";
import {
  registerCrashalytics
} from "@/lib/react-native-firebase/crashalytics/use-register-crashalytics";
import { GlobalSnackbar } from "@/lib/react-native-paper/snackbar/GlobalSnackbar";
import { queryClient } from "@/lib/tanstack/query/client";
import {
  onAppStateChange,
  useAppState,
  useOnlineManager,
} from "@/lib/tanstack/query/react-native-setup-hooks";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

let resolver: (() => void) | null;
let initilializerPromise = new Promise<void>((resolve) => {
  resolver = () => {
    console.log("Initializer promise resolved");
    resolve();
  };
});
initializePushEventsBackgroundTask(initilializerPromise);
initializePullEventsBackgroundTask(initilializerPromise);

export default function RootLayout() {
  useOnlineManager();
  useAppState(onAppStateChange);
  const { colorScheme, paperTheme } = useThemeSetup();
  useEffect(() => {
    resolver?.();
    // comment out during dev because we're not setupfor a dev profile on firebase
      // registerCrashalytics();
  }, []);
  // useRegisterCrashalytics();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <PaperProvider theme={paperTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <ExpoSpatialiteWrapper>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="ward-by-id/[ward]/index"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ward-by-id/[ward]/edit"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ward-by-lat-long/[coords]"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </ExpoSpatialiteWrapper>
              <GlobalSnackbar />
            </ThemeProvider>
          </GestureHandlerRootView>
        </PaperProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
