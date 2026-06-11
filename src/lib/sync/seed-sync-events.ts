import type { DrizzleDB } from "@/lib/drizzle/client";
import { syncEvents } from "@/lib/drizzle/schema";
import { getLatestAppliedSyncEventId } from "@/lib/sync/applied-sync-events";
import { applySyncEvents, registerGeometryColumn } from "@/lib/sync/apply-sync-events";
import { loadSyncEventsSeed } from "@/lib/sync/load-sync-events-seed";
import type { SyncEventRecord } from "@/lib/sync/sync.types";
import { payloadToRecord } from "@/lib/sync/sync.types";
import { asc, gt } from "drizzle-orm";

const BATCH_SIZE = 100;

async function upsertLocalSeedEvents(database: DrizzleDB, records: SyncEventRecord[]) {
  for (const record of records) {
    await database
      .insert(syncEvents)
      .values({
        id: record.id,
        deviceId: record.deviceId,
        tableName: record.tableName,
        rowId: record.rowId,
        action: record.action,
        payloadJson: record.payloadJson,
        createdAt: record.createdAt,
        verified: record.verified,
        verifiedAt: record.verifiedAt,
        verifiedBy: record.verifiedBy,
      })
      .onConflictDoUpdate({
        target: syncEvents.id,
        set: {
          payloadJson: record.payloadJson,
          action: record.action,
          verified: record.verified,
          verifiedAt: record.verifiedAt,
          verifiedBy: record.verifiedBy,
        },
      });
  }
}

async function listPendingEvents(
  database: DrizzleDB,
  cursor: string | null,
): Promise<SyncEventRecord[]> {
  const rows = cursor
    ? await database
        .select()
        .from(syncEvents)
        .where(gt(syncEvents.id, cursor))
        .orderBy(asc(syncEvents.id))
        .limit(BATCH_SIZE)
    : await database.select().from(syncEvents).orderBy(asc(syncEvents.id)).limit(BATCH_SIZE);

  return rows.map((row) => ({
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
  }));
}

export async function seedSyncEventsFromAsset(database: DrizzleDB) {
  const seed = loadSyncEventsSeed();
  const records = seed.events.map((event) => payloadToRecord(event, true));
  await upsertLocalSeedEvents(database, records);
  await registerGeometryColumn(database);

  let cursor = await getLatestAppliedSyncEventId(database);
  let totalApplied = 0;

  while (true) {
    const pendingRows = await listPendingEvents(database, cursor);
    if (pendingRows.length === 0) {
      break;
    }
    const result = await applySyncEvents(database, pendingRows);
    totalApplied += result.applied;
    cursor = pendingRows[pendingRows.length - 1]?.id ?? cursor;
  }

  return { seeded: records.length, applied: totalApplied };
}
