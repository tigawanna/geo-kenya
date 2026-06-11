import type { StyleSpecification } from "@maplibre/maplibre-react-native";
import {
  CARTO_DARK_RASTER_STYLE,
  OSM_RASTER_STYLE,
} from "@/lib/map-libre/osm-raster-style";

export type MapBasemapPreset = "minimal" | "standard";

export type MapColorScheme = "light" | "dark";

export type MapStyleSpec = StyleSpecification;

export function normalizeMapColorScheme(colorScheme: string | null | undefined): MapColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}

export function resolveMapStyle(
  preset: MapBasemapPreset,
  colorScheme: MapColorScheme,
): MapStyleSpec {
  if (preset === "standard") {
    return OSM_RASTER_STYLE;
  }

  return colorScheme === "dark" ? CARTO_DARK_RASTER_STYLE : OSM_RASTER_STYLE;
}
