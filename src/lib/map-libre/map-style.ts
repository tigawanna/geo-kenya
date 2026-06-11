import { OSM_RASTER_STYLE_JSON } from "@/lib/map-libre/osm-raster-style";

export type MapBasemapPreset = "minimal" | "standard";

export type MapColorScheme = "light" | "dark";

export type MapStyleSpec = string;

export function normalizeMapColorScheme(colorScheme: string | null | undefined): MapColorScheme {
  return colorScheme === "dark" ? "dark" : "light";
}

export const OPENFREEMAP_POSITRON_STYLE = "https://tiles.openfreemap.org/styles/positron";

export const OPENFREEMAP_DARK_STYLE = "https://tiles.openfreemap.org/styles/dark";

export function openFreeMapStyleForScheme(colorScheme: MapColorScheme): string {
  return colorScheme === "dark" ? OPENFREEMAP_DARK_STYLE : OPENFREEMAP_POSITRON_STYLE;
}

export function resolveMapStyle(
  preset: MapBasemapPreset,
  colorScheme: MapColorScheme,
): MapStyleSpec {
  if (preset === "standard") {
    return OSM_RASTER_STYLE_JSON;
  }
  return openFreeMapStyleForScheme(colorScheme);
}
