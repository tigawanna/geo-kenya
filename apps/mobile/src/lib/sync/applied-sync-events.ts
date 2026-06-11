import type { DrizzleDB } from "@/lib/drizzle/client";
import { appliedSyncEvents, syncEvents } from "@/lib/drizzle/schema";
import type { SyncEventRecord } from "@/lib/sync/sync.types";
import { asc, desc, eq, isNull, sql } from "drizzle-orm";

export async function countUnappliedSyncEvents(database: DrizzleDB): Promise<number> {
  const rows = await database.all<{ c: number }>(sql`
    SELECT COUNT(*) AS c
    FROM sync_events AS se
    LEFT JOIN applied_sync_events AS ae ON ae.event_id = se.id
    WHERE ae.event_id IS NULL
  `);
  return rows[0]?.c ?? 0;
}

export async function isSyncBootstrapComplete(database: DrizzleDB): Promise<boolean> {
  return (await countUnappliedSyncEvents(database)) === 0;
}

export async function listUnappliedSyncEvents(
  database: DrizzleDB,
  limit = 100,
): Promise<SyncEventRecord[]> {
  return database
    .select({
      id: syncEvents.id,
      deviceId: syncEvents.deviceId,
      tableName: syncEvents.tableName,
      rowId: syncEvents.rowId,
      action: syncEvents.action,
      payloadJson: syncEvents.payloadJson,
      createdAt: syncEvents.createdAt,
      verified: syncEvents.verified,
      verifiedAt: syncEvents.verifiedAt,
      verifiedBy: syncEvents.verifiedBy,
    })
    .from(syncEvents)
    .leftJoin(appliedSyncEvents, eq(syncEvents.id, appliedSyncEvents.eventId))
    .where(isNull(appliedSyncEvents.eventId))
    .orderBy(asc(syncEvents.id))
    .limit(limit);
}

export async function getLatestAppliedSyncEventId(database: DrizzleDB): Promise<string | null> {
  const [row] = await database
    .select({ eventId: appliedSyncEvents.eventId })
    .from(appliedSyncEvents)
    .orderBy(desc(appliedSyncEvents.eventId))
    .limit(1);
  return row?.eventId ?? null;
}

export async function markSyncEventsApplied(
  database: DrizzleDB,
  eventIds: string[],
): Promise<void> {
  if (eventIds.length === 0) {
    return;
  }
  await database
    .insert(appliedSyncEvents)
    .values(eventIds.map((eventId) => ({ eventId })))
    .onConflictDoNothing();
}
