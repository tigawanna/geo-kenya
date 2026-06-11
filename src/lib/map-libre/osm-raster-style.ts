import type { StyleSpecification } from "@maplibre/maplibre-react-native";

const OSM_RASTER_STYLE_SPEC: StyleSpecification = {
  version: 8,
  name: "OpenStreetMap",
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
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

export const OSM_RASTER_STYLE_JSON = JSON.stringify(OSM_RASTER_STYLE_SPEC);
