import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import {
  CARTO_DARK_RASTER_STYLE,
  OSM_RASTER_STYLE,
} from "@/lib/map-libre/osm-raster-style";

export type MapBasemapPreset = "dark" | "standard" | "auto";

export type MapColorScheme = "light" | "dark";

export type MapStyleSpec = StyleSpecification;

export const MAP_BASEMAP_OPTIONS: {
  id: MapBasemapPreset;
  title: string;
  subtitle: string;
}[] = [
  { id: "dark", title: "Dark", subtitle: "Carto dark map" },
  { id: "standard", title: "Standard", subtitle: "OpenStreetMap" },
  { id: "auto", title: "Automatic", subtitle: "Match app theme" },
];

export const DEFAULT_MAP_BASEMAP_PRESET: MapBasemapPreset = "dark";

export function normalizeMapBasemapPreset(value: string | null | undefined): MapBasemapPreset | null {
  if (value === "dark" || value === "standard" || value === "auto") {
    return value;
  }
  if (value === "minimal") {
    return "auto";
  }
  return null;
}

export function normalizeMapColorScheme(colorScheme: string | null | undefined): MapColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}

export function resolveMapStyle(
  preset: MapBasemapPreset,
  colorScheme: MapColorScheme,
): MapStyleSpec {
  if (preset === "dark") {
    return CARTO_DARK_RASTER_STYLE;
  }

  if (preset === "standard") {
    return OSM_RASTER_STYLE;
  }

  return colorScheme === "dark" ? CARTO_DARK_RASTER_STYLE : OSM_RASTER_STYLE;
}
