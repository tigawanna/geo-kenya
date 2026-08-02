
import { createDebouncedAsyncStorage } from "@/lib/storage/debounced-async-storage";
import type { CustomThemeKey } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsStoreType = {
  theme: "dark" | "light" | null;
  colorScheme: CustomThemeKey | null;
  localBackupPath: string | null;
  dynamicColors: boolean;
  lastBackup: Date | null;
  /** Ephemeral: Settings asks Home to re-run the coachmark tour. Not persisted. */
  homeTourReplayRequested: boolean;

  // Actions
  toggleDynamicColors: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light" | null) => void;
  setColorScheme: (scheme: CustomThemeKey | null) => void;
  setLocalBackupPath: (path: string | null) => void;
  setLastBackup: (date: Date | null) => void;
  requestHomeTourReplay: () => void;
  clearHomeTourReplay: () => void;
  updateSettings: (settings: Partial<Omit<SettingsStoreType, 'toggleDynamicColors' | 'toggleTheme' | 'setTheme' | 'setColorScheme' | 'setLocalBackupPath' | 'setLastBackup' | 'requestHomeTourReplay' | 'clearHomeTourReplay' | 'updateSettings'>>) => void;
};

export const useSettingsStore = create<SettingsStoreType>()(
  persist(
    (set, get) => ({
      // State
      theme: null,
      colorScheme: null,
      localBackupPath: null,
      dynamicColors: true,
      lastBackup: null,
      homeTourReplayRequested: false,

      // Actions
      toggleDynamicColors: () => 
        set((state) => ({ 
          dynamicColors: !state.dynamicColors,
          colorScheme: !state.dynamicColors ? null : state.colorScheme // Set to null when enabling dynamic colors
        })),
      
      toggleTheme: () => 
        set((state) => ({ 
          theme: state.theme === "light" ? "dark" : "light" 
        })),
      
      setTheme: (theme) => set({ theme }),
      
      setColorScheme: (scheme) =>
        set((state) => {
          const nextDynamicColors = scheme === null;
          if (state.colorScheme === scheme && state.dynamicColors === nextDynamicColors) {
            return state;
          }
          return {
            colorScheme: scheme,
            dynamicColors: nextDynamicColors,
          };
        }),
      
      setLocalBackupPath: (path) => set({ localBackupPath: path }),
      
      setLastBackup: (date) => set({ lastBackup: date }),

      requestHomeTourReplay: () => set({ homeTourReplayRequested: true }),
      clearHomeTourReplay: () => set({ homeTourReplayRequested: false }),
      
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => createDebouncedAsyncStorage()),
      // Only persist the state, not the actions
      partialize: (state) => ({
        theme: state.theme,
        colorScheme: state.colorScheme,
        localBackupPath: state.localBackupPath,
        dynamicColors: state.dynamicColors,
        lastBackup: state.lastBackup,
      }),
    }
  )
);

// Custom hook for theme functionality
export function useThemeStore() {
  const systemColorScheme = useColorScheme();
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const toggleTheme = useSettingsStore((state) => state.toggleTheme);

  const currentTheme = theme ?? systemColorScheme;
  const isDarkMode = currentTheme === "dark";

  return {
    theme: currentTheme,
    toggleTheme,
    setTheme,
    isDarkMode,
  };
}

// Helper hook to check if store has been hydrated from AsyncStorage
export function usePersistenceLoaded() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Check if store has been hydrated
    const checkHydrated = () => {
      setIsLoaded(true);
    };
    
    // Small delay to ensure hydration is complete
    const timeout = setTimeout(checkHydrated, 100);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return isLoaded;
}
