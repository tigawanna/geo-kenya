import { db } from "@/lib/drizzle/client";
import { wardDataPayload, wardEvents } from "@/lib/drizzle/schema";
import { WardsEventsCreateZodSchema } from "@/lib/pb/types/pb-zod";
import { pbResponeErrorTrap } from "@/lib/pb/utils/errors";
import { logger } from "@/utils/logger";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

// import { fetch } from "expo/fetch";

const EXPO_PUBLIC_SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL;

const eventsSchema = WardsEventsCreateZodSchema.extend({
  id: z.uuid().optional(),
  old_data: wardDataPayload,
  new_data: wardDataPayload,
  //   event_type: wardEventType,
  ward_id: z.number().int().positive(),
});

interface PushLocalEventsProps {}
export async function pushAllEvents() {
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

    const adaptedEventsToSync = eventsToSync.map((event) => {
      const { id, oldData, newData, eventType, wardId, ...rest } = event;
      return {
        ...rest,
        old_data: oldData,
        new_data: newData,
        event_type: eventType,
        ward_id: wardId,
        event_id: id
      };
    });

    const eventSyncPromises = adaptedEventsToSync.map((event) => {
    //   logger.log("event", event);/
      return sendAnEvent({ rawEvent: event });
    });
    await Promise.allSettled(eventSyncPromises);
    return {
      result: "Events pushed successfully",
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

export interface SendAnEventProps {
  rawEvent: {
    event_id: string;
    old_data: string | null;
    new_data: string | null;
    event_type: "INSERT" | "UPDATE" | "DELETE";
    ward_id: number | null;
    eventSource: "REPLAY" | "TRIGGER" | null;
  };
}

export async function sendAnEvent({ rawEvent }: SendAnEventProps) {
  try {
    if (!EXPO_PUBLIC_SYNC_URL) {
      throw new Error("No sync url provided");
    }
    const { data: parsedEvent, error } = eventsSchema.safeParse(rawEvent);
    if (error) {
      const message = z.prettifyError(error);
      throw message;
    }
    const syncUpUrl = new URL("/api/collections/wards_events/records", EXPO_PUBLIC_SYNC_URL);
    const response = await fetch(syncUpUrl.toString(), {
      method: "POST",
      body: JSON.stringify(parsedEvent),
      headers: {
        "Content-Type": "application/json",
      },
    });

    await pbResponeErrorTrap(response)
    if (rawEvent.event_id) {
      await db
        .update(wardEvents)
        .set({
          syncStatus: "SYNCED",
          syncAttempts: 1,
          lastSyncAttempt: new Date().toISOString(),
        })
        .where(eq(wardEvents.id, rawEvent.event_id));
    }
    return {
      result: `${rawEvent.event_type} event synced successfully ${rawEvent.event_id}`,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    logger.log(
      `something went wrong syncing ${rawEvent.event_type} event ${rawEvent.event_id}`,
      errorMessage
    );
    if (rawEvent.event_id) {
      await db
        .update(wardEvents)
        .set({
          syncStatus: "FAILED",
          syncAttempts: 1,
          lastSyncAttempt: new Date().toISOString(),
        })
        .where(eq(wardEvents.id, rawEvent.event_id));
    }
    return {
      result: null,
      error: errorMessage,
    };
  }
}
