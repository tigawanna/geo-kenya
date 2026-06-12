import type { DrizzleDB } from "@/lib/drizzle/client";
import { syncEvents } from "@/lib/drizzle/schema";
import { applySyncEvents } from "@/lib/sync/apply-sync-events";
import { getLatestAppliedSyncEventId } from "@/lib/sync/applied-sync-events";
import type { SyncEventRecord } from "@/lib/sync/sync.types";
import { fetchSyncEventsPull } from "@/services/sync/sync.api";

const PULL_BATCH_LIMIT = 100;

async function upsertPulledEvents(database: DrizzleDB, events: SyncEventRecord[]) {
  if (events.length === 0) {
    return;
  }

  await database
    .insert(syncEvents)
    .values(
      events.map((event) => ({
        id: event.id,
        deviceId: event.deviceId,
        tableName: event.tableName,
        rowId: event.rowId,
        action: event.action,
        payloadJson: event.payloadJson,
        createdAt: event.createdAt,
        verified: event.verified,
        verifiedAt: event.verifiedAt,
        verifiedBy: event.verifiedBy,
      })),
    )
    .onConflictDoNothing({ target: syncEvents.id });
}

export async function pullSyncEvents(database: DrizzleDB) {
  let cursor = await getLatestAppliedSyncEventId(database);
  let hasMore = true;
  let page = 0;
  let totalApplied = 0;
  let totalProcessed = 0;

  while (hasMore) {
    const response = await fetchSyncEventsPull(cursor, page + 1, PULL_BATCH_LIMIT);
    page = response.page;

    if (response.events.length > 0) {
      await upsertPulledEvents(database, response.events);
      const result = await applySyncEvents(database, response.events);
      totalApplied += result.applied;
      totalProcessed += response.events.length;
      cursor = response.nextCursor ?? response.events[response.events.length - 1]?.id ?? cursor;
    }

    hasMore = response.hasMore;
  }

  return { applied: totalApplied, processed: totalProcessed };
}
