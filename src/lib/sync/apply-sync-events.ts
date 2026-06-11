import type { DrizzleDB } from "@/lib/drizzle/client";
import { syncEvents } from "@/lib/drizzle/schema";
import { getOpsqliteDb } from "@/lib/op-sqlite/client";
import { markSyncEventsApplied } from "@/lib/sync/applied-sync-events";
import type { SyncEventRecord } from "@/lib/sync/sync.types";
import { buildGeomSqlFragment } from "@/lib/sync/ward-geom-sql";
import { eq, sql } from "drizzle-orm";

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

function upsertKenyaWard(payload: WardPayload, rowId: string): boolean {
  const sourceId = Number(rowId);
  if (!Number.isFinite(sourceId)) {
    return false;
  }

  const geomSql = buildGeomSqlFragment(payload.geom);
  const query = `
    INSERT INTO kenya_wards (
      id, ward_code, ward, county, county_code, sub_county, constituency, constituency_code,
      minx, miny, maxx, maxy, geom
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${geomSql})
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
  `;

  getOpsqliteDb().executeSync(query, [
    sourceId,
    payload.wardCode ?? null,
    payload.ward,
    payload.county,
    payload.countyCode ?? null,
    payload.subCounty ?? null,
    payload.constituency,
    payload.constituencyCode ?? null,
    payload.minX ?? null,
    payload.minY ?? null,
    payload.maxX ?? null,
    payload.maxY ?? null,
  ]);

  return true;
}

function updateKenyaWardGeometry(id: number, geom: string): void {
  const geomSql = buildGeomSqlFragment(geom);
  getOpsqliteDb().executeSync(`UPDATE kenya_wards SET geom = ${geomSql} WHERE id = ?`, [id]);
}

async function applyKenyaWardCreate(_database: DrizzleDB, payload: WardPayload, rowId: string) {
  return upsertKenyaWard(payload, rowId);
}

async function applyKenyaWardUpdate(_database: DrizzleDB, payload: WardPayload, rowId: string) {
  return upsertKenyaWard(payload, rowId);
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

async function isGeometryColumnRegistered(database: DrizzleDB): Promise<boolean> {
  const rows = await database.all<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM geometry_columns WHERE f_table_name = 'kenya_wards' AND f_geometry_column = 'geom'`,
  );
  return (rows[0]?.c ?? 0) > 0;
}

async function hasGeomTableColumn(database: DrizzleDB): Promise<boolean> {
  const rows = await database.all<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM pragma_table_info('kenya_wards') WHERE name = 'geom'`,
  );
  return (rows[0]?.c ?? 0) > 0;
}

export async function registerGeometryColumn(database: DrizzleDB): Promise<void> {
  if (await isGeometryColumnRegistered(database)) {
    return;
  }

  const connection = getOpsqliteDb();

  if (await hasGeomTableColumn(database)) {
    try {
      connection.executeSync(
        "SELECT RecoverGeometryColumn('kenya_wards', 'geom', 4326, 'MULTIPOLYGON', 'XY')",
      );
    } catch {
    }

    if (await isGeometryColumnRegistered(database)) {
      return;
    }
  }

  connection.executeSync(
    "SELECT AddGeometryColumn('kenya_wards', 'geom', 4326, 'MULTIPOLYGON', 'XY')",
  );
}

async function countMissingGeometries(database: DrizzleDB): Promise<number> {
  const missing = await database.all<{ c: number }>(
    sql`SELECT COUNT(*) AS c FROM kenya_wards WHERE geom IS NULL OR AsGeoJSON(geom) IS NULL`,
  );
  return missing[0]?.c ?? 0;
}

async function listKenyaWardSyncEvents(database: DrizzleDB) {
  return database.select().from(syncEvents).where(eq(syncEvents.tableName, "kenya_wards"));
}

export async function repairKenyaWardGeometries(database: DrizzleDB): Promise<number> {
  await registerGeometryColumn(database);

  if ((await countMissingGeometries(database)) === 0) {
    return 0;
  }

  const rows = await listKenyaWardSyncEvents(database);
  let repaired = 0;

  for (const row of rows) {
    if (row.action === "delete") {
      continue;
    }

    const payload = parsePayload({
      id: row.id,
      deviceId: row.deviceId,
      tableName: row.tableName,
      rowId: row.rowId,
      action: row.action,
      payloadJson: row.payloadJson,
      createdAt: row.createdAt,
      verified: row.verified,
      verifiedAt: row.verifiedAt,
      verifiedBy: row.verifiedBy,
    });
    const wardPayload = asWardPayload(payload);
    if (!wardPayload?.geom) {
      continue;
    }

    const id = Number(row.rowId);
    if (!Number.isFinite(id)) {
      continue;
    }

    updateKenyaWardGeometry(id, wardPayload.geom);
    repaired += 1;
  }

  return repaired;
}

export async function countMissingKenyaWardGeometries(database: DrizzleDB): Promise<number> {
  return countMissingGeometries(database);
}

export async function ensureKenyaWardGeometriesReady(database: DrizzleDB): Promise<void> {
  await registerGeometryColumn(database);

  let missing = await countMissingGeometries(database);
  const registered = await isGeometryColumnRegistered(database);

  if (!registered || missing > 0) {
    const repaired = await repairKenyaWardGeometries(database);
    if (repaired > 0) {
      console.log(`[InitDatabase] repaired geometry for ${repaired} wards`);
    }
    missing = await countMissingGeometries(database);
  }

  if (missing > 0) {
    const reapplied = await reapplyAllKenyaWardsFromSyncEvents(database);
    console.log(`[InitDatabase] re-applied ${reapplied} ward sync events`);
    missing = await countMissingGeometries(database);
  }

  if (missing > 0) {
    console.error(
      `[InitDatabase] ${missing} wards still have missing geometry after repair`,
    );
  }
}

export async function reapplyAllKenyaWardsFromSyncEvents(database: DrizzleDB): Promise<number> {
  await registerGeometryColumn(database);

  const rows = await listKenyaWardSyncEvents(database);
  let applied = 0;

  for (const row of rows) {
    const ok = await applyEvent(database, {
      id: row.id,
      deviceId: row.deviceId,
      tableName: row.tableName,
      rowId: row.rowId,
      action: row.action,
      payloadJson: row.payloadJson,
      createdAt: row.createdAt,
      verified: row.verified,
      verifiedAt: row.verifiedAt,
      verifiedBy: row.verifiedBy,
    });
    if (ok) {
      applied += 1;
    }
  }

  return applied;
}
