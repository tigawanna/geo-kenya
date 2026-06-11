import type { StyleSpecification } from "@maplibre/maplibre-react-native";

const MAPLIBRE_GLYPHS_URL = "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf";

const OSM_RASTER_STYLE_SPEC: StyleSpecification = {
  version: 8,
  name: "OpenStreetMap",
  glyphs: MAPLIBRE_GLYPHS_URL,
  sources: {
    "osm-tiles": {
      type: "raster",
      tiles: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "osm-tiles",
      type: "raster",
      source: "osm-tiles",
    },
  ],
};

const CARTO_DARK_RASTER_STYLE_SPEC: StyleSpecification = {
  version: 8,
  name: "Carto Dark",
  glyphs: MAPLIBRE_GLYPHS_URL,
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© CARTO © OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "carto-dark",
      type: "raster",
      source: "carto-dark",
    },
  ],
};

export const OSM_RASTER_STYLE = OSM_RASTER_STYLE_SPEC;
export const CARTO_DARK_RASTER_STYLE = CARTO_DARK_RASTER_STYLE_SPEC;
