import type { DrizzleDB } from "@/lib/drizzle/client";
import { appliedSyncEvents } from "@/lib/drizzle/schema";
import { desc } from "drizzle-orm";

export async function getLatestAppliedSyncEventId(database: DrizzleDB): Promise<string | null> {
  const [row] = await database
    .select({ eventId: appliedSyncEvents.eventId })
    .from(appliedSyncEvents)
    .orderBy(desc(appliedSyncEvents.appliedAt))
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
