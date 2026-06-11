import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StateStorage } from "zustand/middleware";

export function createDebouncedAsyncStorage(delayMs = 400): StateStorage {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let pending: { name: string; value: string } | null = null;

  const flush = () => {
    if (!pending) {
      return;
    }
    const { name, value } = pending;
    pending = null;
    void AsyncStorage.setItem(name, value);
  };

  return {
    getItem: (name) => AsyncStorage.getItem(name),
    setItem: (name, value) => {
      pending = { name, value };
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        timeout = null;
        flush();
      }, delayMs);
    },
    removeItem: (name) => AsyncStorage.removeItem(name),
  };
}
