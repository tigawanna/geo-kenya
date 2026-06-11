import type { DrizzleDB } from "@/lib/drizzle/client";
import { markSyncEventsApplied } from "@/lib/sync/applied-sync-events";
import type { SyncEventRecord } from "@/lib/sync/sync.types";
import { sql, type SQL } from "drizzle-orm";

type WardPayload = {
  wardCode?: string | null;
  ward: string;
  county: string;
  countyCode?: number | null;
  subCounty?: string | null;
  constituency: string;
  constituencyCode?: number | null;
  minX?: number | null;
  minY?: number | null;
  maxX?: number | null;
  maxY?: number | null;
  geom?: string;
};

function parsePayload(record: SyncEventRecord): Record<string, unknown> {
  try {
    return JSON.parse(record.payloadJson) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function asWardPayload(payload: Record<string, unknown>): WardPayload | null {
  if (typeof payload.ward !== "string" || typeof payload.county !== "string") {
    return null;
  }
  return payload as WardPayload;
}

function isWkbHex(value: string): boolean {
  return /^[0-9a-fA-F]+$/.test(value);
}

function geomExpression(geom: string | null | undefined): SQL {
  if (!geom) {
    return sql`NULL`;
  }
  const trimmed = geom.trim();
  if (trimmed.startsWith("{")) {
    return sql`ST_MakeValid(GeomFromGeoJSON(${trimmed}))`;
  }
  if (isWkbHex(trimmed)) {
    return sql.raw(`ST_MakeValid(GeomFromWKB(x'${trimmed}'))`);
  }
  return sql`NULL`;
}

async function upsertKenyaWard(
  database: DrizzleDB,
  payload: WardPayload,
  rowId: string,
): Promise<boolean> {
  const sourceId = Number(rowId);
  if (!Number.isFinite(sourceId)) {
    return false;
  }

  const geom = geomExpression(payload.geom);

  await database.run(sql`
    INSERT INTO kenya_wards (
      id, ward_code, ward, county, county_code, sub_county, constituency, constituency_code,
      minx, miny, maxx, maxy, geom
    ) VALUES (
      ${sourceId},
      ${payload.wardCode ?? null},
      ${payload.ward},
      ${payload.county},
      ${payload.countyCode ?? null},
      ${payload.subCounty ?? null},
      ${payload.constituency},
      ${payload.constituencyCode ?? null},
      ${payload.minX ?? null},
      ${payload.minY ?? null},
      ${payload.maxX ?? null},
      ${payload.maxY ?? null},
      ${geom}
    )
    ON CONFLICT(id) DO UPDATE SET
      ward_code = excluded.ward_code,
      ward = excluded.ward,
      county = excluded.county,
      county_code = excluded.county_code,
      sub_county = excluded.sub_county,
      constituency = excluded.constituency,
      constituency_code = excluded.constituency_code,
      minx = excluded.minx,
      miny = excluded.miny,
      maxx = excluded.maxx,
      maxy = excluded.maxy,
      geom = excluded.geom
  `);
  return true;
}

async function applyKenyaWardCreate(database: DrizzleDB, payload: WardPayload, rowId: string) {
  return upsertKenyaWard(database, payload, rowId);
}

async function applyKenyaWardUpdate(database: DrizzleDB, payload: WardPayload, rowId: string) {
  return upsertKenyaWard(database, payload, rowId);
}

async function applyKenyaWardDelete(database: DrizzleDB, rowId: string) {
  const id = Number(rowId);
  if (!Number.isFinite(id)) {
    return false;
  }
  await database.run(sql`DELETE FROM kenya_wards WHERE id = ${id}`);
  return true;
}

async function applyEvent(database: DrizzleDB, record: SyncEventRecord): Promise<boolean> {
  if (record.tableName !== "kenya_wards") {
    return false;
  }

  const payload = parsePayload(record);
  const wardPayload = asWardPayload(payload);
  if (!wardPayload) {
    return false;
  }

  switch (record.action) {
    case "create":
      return applyKenyaWardCreate(database, wardPayload, record.rowId);
    case "update":
      return applyKenyaWardUpdate(database, wardPayload, record.rowId);
    case "delete":
      return applyKenyaWardDelete(database, record.rowId);
    default:
      return false;
  }
}

export async function applySyncEvents(
  database: DrizzleDB,
  records: SyncEventRecord[],
): Promise<{ applied: number; skipped: number }> {
  const appliedIds: string[] = [];
  let skipped = 0;

  for (const record of records) {
    const ok = await applyEvent(database, record);
    if (ok) {
      appliedIds.push(record.id);
    } else {
      skipped += 1;
    }
  }

  await markSyncEventsApplied(database, appliedIds);
  return { applied: appliedIds.length, skipped };
}

export async function registerGeometryColumn(database: DrizzleDB): Promise<void> {
  const rows = await database.all<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM geometry_columns WHERE f_table_name = 'kenya_wards' AND f_geometry_column = 'geom'`,
  );
  const count = rows[0]?.c ?? 0;
  if (count === 0) {
    await database.run(
      sql`SELECT AddGeometryColumn('kenya_wards', 'geom', 4326, 'MULTIPOLYGON', 'XY')`,
    );
  }
}
