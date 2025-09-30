import { db } from "@/lib/drizzle/client";
import { wardDataPayload, wardEvents } from "@/lib/drizzle/schema";
import { WardsEventsCreateZodSchema } from "@/lib/pb/types/pb-zod";
import { logger } from "@/utils/logger";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

const EXPO_PUBLIC_SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL;

const eventsSchema = WardsEventsCreateZodSchema.extend({
  old_data: wardDataPayload,
  new_data: wardDataPayload,
});

interface PushLocalEventsProps {}
export async function pushLocalEvents({}: PushLocalEventsProps) {
  try {
    if (!EXPO_PUBLIC_SYNC_URL) {
      throw new Error("No sync url provided");
    }
    const eventsToSync = await db
      .select()
      .from(wardEvents)
      .where(
        and(
          eq(wardEvents.eventSource, "TRIGGER"),
          or(eq(wardEvents.syncStatus, "PENDING"), eq(wardEvents.syncStatus, "FAILED"))
        )
      )
      .all();

    // eventsToSync?.[0]?.oldData &&
    //   logger.log("events to sync", JSON.parse(eventsToSync?.[0]?.oldData));
    logger.log(" == eventsToSync ==", eventsToSync);
    const {
      data: parsedEventsToSync,
      error,
      success,
    } = z.array(eventsSchema).safeParse(eventsToSync);
    if (error) {
      const message = z.prettifyError(error)
      console.log("error parsing events", error);
      throw message;
    }
    const syncUpUrl = new URL("/api/collections/wards_events/records", EXPO_PUBLIC_SYNC_URL);
    const response = await fetch(syncUpUrl, {
      method: "POST",
      body: JSON.stringify(parsedEventsToSync),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
    logger.log("ward updates response", response);
    await db.delete(wardEvents).run();
    return {
      result: "No new updates available",
      error: null,
    };
  } catch (error) {
    logger.log("something went wrong seeding ward data updates", error);
    return {
      result: null,
      error: error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
}
