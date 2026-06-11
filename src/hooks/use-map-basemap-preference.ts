import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import type { MapBasemapPreset } from "@/lib/map-libre/map-style";

const STORAGE_KEY = "geo-kenya:map-basemap-preset";

export function useMapBasemapPreference() {
  const [preset, setPresetState] = useState<MapBasemapPreset>("minimal");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === "standard" || value === "minimal") {
          setPresetState(value);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const setPreset = useCallback((next: MapBasemapPreset) => {
    setPresetState(next);
    void AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { preset, setPreset, isReady };
}
