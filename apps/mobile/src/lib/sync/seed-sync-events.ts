import type { DrizzleDB } from "@/lib/drizzle/client";
import { syncEvents } from "@/lib/drizzle/schema";
import {
  countUnappliedSyncEvents,
  isSyncBootstrapComplete,
  listUnappliedSyncEvents,
} from "@/lib/sync/applied-sync-events";
import { applySyncEvents, registerGeometryColumn } from "@/lib/sync/apply-sync-events";
import { loadSyncEventsSeed } from "@/lib/sync/load-sync-events-seed";
import type { SyncEventRecord } from "@/lib/sync/sync.types";
import { payloadToRecord } from "@/lib/sync/sync.types";
import { count } from "drizzle-orm";

const BATCH_SIZE = 100;

async function upsertLocalSeedEvents(database: DrizzleDB, records: SyncEventRecord[]) {
  if (records.length === 0) {
    return;
  }

  await database
    .insert(syncEvents)
    .values(
      records.map((record) => ({
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
      })),
    )
    .onConflictDoNothing();
}

export async function seedSyncEventsFromAsset(database: DrizzleDB) {
  const [syncCountRow] = await database.select({ count: count() }).from(syncEvents);
  const syncCount = syncCountRow?.count ?? 0;

  if (syncCount > 0 && (await isSyncBootstrapComplete(database))) {
    return { seeded: 0, applied: 0 };
  }

  const seed = loadSyncEventsSeed();
  const records = seed.events.map((event) => payloadToRecord(event, true));

  if (syncCount < seed.events.length || (await countUnappliedSyncEvents(database)) > 0) {
    await upsertLocalSeedEvents(database, records);
  }

  await registerGeometryColumn(database);

  let totalApplied = 0;

  while (true) {
    const pendingRows = await listUnappliedSyncEvents(database, BATCH_SIZE);
    if (pendingRows.length === 0) {
      break;
    }
    const result = await applySyncEvents(database, pendingRows);
    totalApplied += result.applied;
  }

  return { seeded: records.length, applied: totalApplied };
}
