import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SettingsStoreType = {
  theme: "dark" | "light" | null;
  localBackupPath: string | null;
  dynamicColors: boolean;
  lastBackup: Date | null;
  
  // Actions
  toggleDynamicColors: () => void;
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light" | null) => void;
  setLocalBackupPath: (path: string | null) => void;
  setLastBackup: (date: Date | null) => void;
  updateSettings: (settings: Partial<Omit<SettingsStoreType, 'toggleDynamicColors' | 'toggleTheme' | 'setTheme' | 'setLocalBackupPath' | 'setLastBackup' | 'updateSettings'>>) => void;
};

export const useSettingsStore = create<SettingsStoreType>()(
  persist(
    (set, get) => ({
      // State
      theme: null,
      localBackupPath: null,
      dynamicColors: true,
      lastBackup: null,
      
      // Actions
      toggleDynamicColors: () => 
        set((state) => ({ dynamicColors: !state.dynamicColors })),
      
      toggleTheme: () => 
        set((state) => ({ 
          theme: state.theme === "light" ? "dark" : "light" 
        })),
      
      setTheme: (theme) => set({ theme }),
      
      setLocalBackupPath: (path) => set({ localBackupPath: path }),
      
      setLastBackup: (date) => set({ lastBackup: date }),
      
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: "app-settings",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the state, not the actions
      partialize: (state) => ({
        theme: state.theme,
        localBackupPath: state.localBackupPath,
        dynamicColors: state.dynamicColors,
        lastBackup: state.lastBackup,
      }),
    }
  )
);

// Custom hook for theme functionality
export function useThemeStore() {
  const colorScheme = useColorScheme();
  const { theme, setTheme, toggleTheme } = useSettingsStore();
  
  const currentTheme = theme ?? colorScheme;
  const isDarkMode = currentTheme === "dark";
  
  return { 
    theme: currentTheme, 
    toggleTheme, 
    setTheme,
    isDarkMode 
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
