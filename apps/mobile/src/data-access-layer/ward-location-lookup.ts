import { executeQuerySync } from "@/lib/drizzle/client";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";

type WardLocationRow = KenyaWardsSelect & { geometry: string | null; distance?: number | null };

type LookupStrategy = "st_contains" | "bbox" | "nearest_centroid";

type LookupResult = {
  ward: WardLocationRow | null;
  strategy: LookupStrategy | null;
  error: string | null;
};

function runDiagnostic(label: string, query: string, params?: (string | number)[]): void {
  try {
    const rows = executeQuerySync<Record<string, unknown>>(query, params as never);
    console.log(`[WardLocation] ${label}:`, JSON.stringify(rows, null, 2));
  } catch (e) {
    console.log(
      `[WardLocation] ${label} ERROR:`,
      e instanceof Error ? e.message : String(e),
    );
  }
}

export function logWardLocationDiagnostics(lat: number, lng: number): void {
  console.log("[WardLocation] ===== coordinate lookup diagnostics =====");
  console.log("[WardLocation] input:", { lat, lng });

  runDiagnostic(
    "geometry_columns",
    "SELECT * FROM geometry_columns WHERE f_table_name = 'kenya_wards'",
  );

  runDiagnostic(
    "readable_geom_count",
    "SELECT COUNT(*) AS c FROM kenya_wards WHERE AsGeoJSON(geom) IS NOT NULL",
  );

  runDiagnostic(
    "test_point",
    "SELECT AsGeoJSON(MakePoint(?, ?, 4326)) AS point_geojson",
    [lng, lat],
  );

  runDiagnostic(
    "st_contains_count",
    `SELECT COUNT(*) AS c FROM kenya_wards
     WHERE geom IS NOT NULL
       AND ST_Contains(geom, MakePoint(?, ?, 4326))`,
    [lng, lat],
  );

  runDiagnostic(
    "bbox_matches",
    `SELECT id, ward, county, minx, miny, maxx, maxy
     FROM kenya_wards
     WHERE ? BETWEEN miny AND maxy AND ? BETWEEN minx AND maxx
     ORDER BY (maxx - minx) * (maxy - miny) ASC
     LIMIT 5`,
    [lat, lng],
  );

  runDiagnostic(
    "nearest_centroid",
    `SELECT id, ward, county,
            ST_Distance(ST_Centroid(geom), MakePoint(?, ?, 4326), 1) AS distance
     FROM kenya_wards
     WHERE geom IS NOT NULL
     ORDER BY distance
     LIMIT 5`,
    [lng, lat],
  );

  console.log("[WardLocation] ===== end diagnostics =====");
}

const WARD_SELECT = `
  id,
  ward_code AS wardCode,
  ward,
  county,
  county_code AS countyCode,
  sub_county AS subCounty,
  constituency,
  constituency_code AS constituencyCode,
  minx AS minX,
  miny AS minY,
  maxx AS maxX,
  maxy AS maxY,
  AsGeoJSON(geom) AS geometry
`;

function lookupByStContains(lat: number, lng: number): WardLocationRow | null {
  const rows = executeQuerySync<WardLocationRow>(
    `
      SELECT ${WARD_SELECT}
      FROM kenya_wards
      WHERE geom IS NOT NULL
        AND ST_Contains(geom, MakePoint(?, ?, 4326))
      LIMIT 1
    `,
    [lng, lat],
  );
  return rows[0] ?? null;
}

function lookupByBbox(lat: number, lng: number): WardLocationRow | null {
  const rows = executeQuerySync<WardLocationRow>(
    `
      SELECT ${WARD_SELECT}
      FROM kenya_wards
      WHERE ? BETWEEN miny AND maxy
        AND ? BETWEEN minx AND maxx
      ORDER BY (maxx - minx) * (maxy - miny) ASC
      LIMIT 1
    `,
    [lat, lng],
  );
  return rows[0] ?? null;
}

function lookupByNearestCentroid(lat: number, lng: number): WardLocationRow | null {
  const rows = executeQuerySync<WardLocationRow>(
    `
      SELECT ${WARD_SELECT},
        ST_Distance(ST_Centroid(geom), MakePoint(?, ?, 4326), 1) AS distance
      FROM kenya_wards
      WHERE geom IS NOT NULL
      ORDER BY distance
      LIMIT 1
    `,
    [lng, lat],
  );
  return rows[0] ?? null;
}

export function findWardByCoordinates(lat: number, lng: number): LookupResult {
  console.log("[WardLocation] findWardByCoordinates", { lat, lng });

  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
    return {
      ward: null,
      strategy: null,
      error: "Invalid coordinates",
    };
  }

  try {
    const byContains = lookupByStContains(lat, lng);
    if (byContains) {
      console.log("[WardLocation] matched via st_contains:", byContains.ward, byContains.id);
      return { ward: byContains, strategy: "st_contains", error: null };
    }
    console.log("[WardLocation] st_contains: no match");
  } catch (e) {
    console.log(
      "[WardLocation] st_contains failed:",
      e instanceof Error ? e.message : String(e),
    );
  }

  try {
    const byBbox = lookupByBbox(lat, lng);
    if (byBbox) {
      console.log("[WardLocation] matched via bbox:", byBbox.ward, byBbox.id);
      return { ward: byBbox, strategy: "bbox", error: null };
    }
    console.log("[WardLocation] bbox: no match");
  } catch (e) {
    console.log("[WardLocation] bbox failed:", e instanceof Error ? e.message : String(e));
  }

  try {
    const byNearest = lookupByNearestCentroid(lat, lng);
    if (byNearest) {
      console.log(
        "[WardLocation] matched via nearest_centroid:",
        byNearest.ward,
        byNearest.id,
        "distance:",
        byNearest.distance,
      );
      return { ward: byNearest, strategy: "nearest_centroid", error: null };
    }
    console.log("[WardLocation] nearest_centroid: no match");
  } catch (e) {
    console.log(
      "[WardLocation] nearest_centroid failed:",
      e instanceof Error ? e.message : String(e),
    );
  }

  logWardLocationDiagnostics(lat, lng);

  return {
    ward: null,
    strategy: null,
    error: "Ward not found",
  };
}

export function findClosestWardsByCoordinates(
  lat: number,
  lng: number,
  limit = 10,
): { results: WardLocationRow[]; error: string | null } {
  console.log("[WardLocation] findClosestWardsByCoordinates", { lat, lng, limit });

  try {
    const rows = executeQuerySync<WardLocationRow>(
      `
        SELECT ${WARD_SELECT},
          ST_Distance(ST_Centroid(geom), MakePoint(?, ?, 4326), 1) AS distance
        FROM kenya_wards
        WHERE geom IS NOT NULL
          AND AsGeoJSON(geom) IS NOT NULL
        ORDER BY distance
        LIMIT ?
      `,
      [lng, lat, limit + 1],
    );

    console.log(
      "[WardLocation] closest wards raw:",
      rows.map((r) => ({ id: r.id, ward: r.ward, distance: r.distance })),
    );

    const results = rows.slice(1, limit + 1);
    return { results, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.log("[WardLocation] findClosestWardsByCoordinates failed:", message);
    return { results: [], error: message };
  }
}
