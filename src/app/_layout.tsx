import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


import { AppStateStatus, Platform } from 'react-native';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { useAppState, useOnlineManager } from '@/lib/tanstack/query/react-native-setup-hooks';
import { useSettingsStore } from '@/store/settings-store';
import { useThemeSetup } from '@/hooks/theme/use-theme-setup';
import { ExpoSpatialiteWrapper } from '@/lib/expo-spatialite/app-wrapper';
import { GlobalSnackbar } from '@/lib/react-native-paper/snackbar/GlobalSnackbar';
import { queryClient } from '@/lib/tanstack/query/client';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: '(tabs)',
};

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}


export default function RootLayout() {
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
              <QueryClientProvider client={queryClient}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </QueryClientProvider>
            </ExpoSpatialiteWrapper>
            <GlobalSnackbar />
          </ThemeProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}
