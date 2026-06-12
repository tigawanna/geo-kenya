
// declare global {
//   namespace GeoJSON {
//     interface Feature {
//       geometry: Geometry & {
//         coordinates?: [number, number];
//       };
//     }
//   }
// }

export type GeoJSONFeature = GeoJSON.Feature & {
  geometry: GeoJSON.Feature["geometry"] & {
    coordinates?: [number, number];
  };
};

export interface WardGeometry {
  type: string;
  coordinates: any[];
}

export function geomParse(geomString?: string | undefined):WardGeometry|undefined{
  if (geomString) {
    try {
      return JSON.parse(geomString) as WardGeometry;
    } catch (err) {
      console.log("Failed to parse GeoJSON geometry:", err);
     return undefined;
    }
  }
}

export function isValidGeoJSONGeometry(geom: any): geom is WardGeometry {
  if (!geom || typeof geom !== "object") return false;
  if (!geom.type || !Array.isArray(geom.coordinates)) return false;

  if (geom.type === "Polygon") {
    return Array.isArray(geom.coordinates[0]) && geom.coordinates[0].length >= 4;
  }

  if (geom.type === "MultiPolygon") {
    return (
      Array.isArray(geom.coordinates[0]) &&
      Array.isArray(geom.coordinates[0][0]) &&
      geom.coordinates[0][0].length >= 4
    );
  }

  return false;
}


// 👇 Helper to calculate bounding box from GeoJSON geometry
export const calculateBBox = (geom: any): [number, number, number, number] | null => {
  if (!geom || !geom.coordinates) return null;

  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;

  const traverse = (coords: any[]) => {
    coords.forEach((point) => {
      if (Array.isArray(point) && typeof point[0] === "number") {
        const [lng, lat] = point;
        minLng = Math.min(minLng, lng);
        minLat = Math.min(minLat, lat);
        maxLng = Math.max(maxLng, lng);
        maxLat = Math.max(maxLat, lat);
      } else if (Array.isArray(point)) {
        traverse(point);
      }
    });
  };

  traverse(geom.coordinates);

  return isFinite(minLng) && isFinite(minLat) && isFinite(maxLng) && isFinite(maxLat)
    ? [minLng, minLat, maxLng, maxLat]
    : null;
};
