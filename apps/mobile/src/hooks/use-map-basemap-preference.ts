import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_MAP_BASEMAP_PRESET,
  normalizeMapBasemapPreset,
  type MapBasemapPreset,
} from "@/lib/map-libre/map-style";

const STORAGE_KEY = "geo-kenya:map-basemap-preset";

export function useMapBasemapPreference() {
  const [preset, setPresetState] = useState<MapBasemapPreset>(DEFAULT_MAP_BASEMAP_PRESET);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        const next = normalizeMapBasemapPreset(value);
        if (next) {
          setPresetState(next);
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
