/**
 * Custom SpatiaLite Geometry Types for Drizzle ORM
 * 
 * SpatiaLite geometry columns are created via AddGeometryColumn() function,
 * not direct column types. These types represent the data structure.
 */

import { sql } from "drizzle-orm/sql";
import { customType} from "drizzle-orm/sqlite-core";

// Geometry type for SpatiaLite (handles all geometry types)
export const geometry = customType<{
  data: string; // GeoJSON string
}>({
  dataType() {
    return "GEOMETRY"; // SpatiaLite geometry column type
  },
});

// Convenience aliases for specific geometry types
export const multiPolygon = geometry;
export const polygon = geometry;
export const point = geometry;

// SQL functions for SpatiaLite operations
export const spatialiteFunctions = {
  // Convert GeoJSON to geometry
  geomFromGeoJSON: (geojson: string, srid = 4326) => 
    sql`GeomFromGeoJSON(${geojson}, ${srid})`,
  
  // Convert geometry to GeoJSON
  asGeoJSON: (geom: any) => sql`AsGeoJSON(${geom})`,
  
  // Spatial queries
  within: (geom1: any, geom2: any) => sql`Within(${geom1}, ${geom2})`,
  intersects: (geom1: any, geom2: any) => sql`Intersects(${geom1}, ${geom2})`,
};

// Helper types for GeoJSON structures
export type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

export type GeoJSONMultiPolygon = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type GeoJSONPoint = {
  type: "Point";
  coordinates: [number, number];
};

// Helper functions to create GeoJSON objects
export function createPolygon(coordinates: number[][][]): GeoJSONPolygon {
  return {
    type: "Polygon",
    coordinates,
  };
}

export function createMultiPolygon(
  coordinates: number[][][][],
): GeoJSONMultiPolygon {
  return {
    type: "MultiPolygon",
    coordinates,
  };
}

export function createPoint(coordinates: [number, number]): GeoJSONPoint {
  return {
    type: "Point",
    coordinates,
  };
}
