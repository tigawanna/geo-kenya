import { db } from "@/lib/drizzle/client";
import { kenyaWards, wardEvents, wardUpdates, WardUpdatesZodSchema, } from "@/lib/drizzle/schema";
import { executeQuery } from "@/modules/expo-spatialite";
import { logger } from "@/utils/logger";
import { and, eq, or } from "drizzle-orm";
import { z } from "zod";

const EXPO_PUBLIC_SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL;

export async function syncWardDb() {
  try {
    const { result: updates } = await checkDbUpdates();
    if (updates) {
      await db.insert(wardUpdates).values(updates).run();
      const allNewUpdates = updates.flatMap((update) => update.data);
      const updatesRows = allNewUpdates.map((update) => {
        if (update.event === "CREATE") {
          return db.insert(kenyaWards).values({
            ...update.data,
            id: update.id,
          } as any);
        }
        if (update.event === "UPDATE") {
          db.update(kenyaWards).set(update.data).where(eq(kenyaWards.id, update.id)).run();
        }
        if (update.event === "DELETE") {
          db.delete(kenyaWards).where(eq(kenyaWards.id, update.id)).run();
        }
      });
      const updatedPromises = await Promise.allSettled(updatesRows);
      logger.log("📝 updatedPromises:", updatedPromises);
      const sendUpdatesResult = await seedDbUpdates({
        lastUpdateID: updates?.at(-1)?.id,
        lastUpdateTimestamp: updates?.at(-1)?.createdAt,
      });
      logger.log("📝 sendUpdatesResult:", sendUpdatesResult);
    }
  } catch (error) {
    logger.log("something went wrong syncing ward data", error);
  }
}

interface SeedDbUpdatesProps {
  lastUpdateTimestamp?: string;
  lastUpdateID?: number;
}
export async function seedDbUpdates({ lastUpdateID, lastUpdateTimestamp }: SeedDbUpdatesProps) {
  try {
    if (!EXPO_PUBLIC_SYNC_URL) {
      throw new Error("No sync url provided");
    }
    const lastLocalUpdates = await db
      .select()
      .from(wardUpdates)
      .orderBy(wardUpdates.createdAt)
      .get();
    if (lastLocalUpdates?.id === lastUpdateID) {
      return {
        result: "No new updates available",
        error: null,
      };
    }
    const eventsToSync = db
      .select()
      .from(wardEvents)
      .where(
        and(
          eq(wardEvents.eventSource, "TRIGGER"),
          or(eq(wardEvents.syncStatus, "PENDING"), eq(wardEvents.syncStatus, "FAILED"))
        )
      )
      .all();
    const syncUpUrl = new URL("/api/collections/wards_events/records", EXPO_PUBLIC_SYNC_URL);
    const response = await fetch(syncUpUrl, {
      method: "POST",
      body: JSON.stringify(eventsToSync),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
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

export async function checkDbUpdates() {
  try {
    if (!EXPO_PUBLIC_SYNC_URL) {
      throw new Error("No sync url provided");
    }
    // const lastLocalUpdates = await db
    // .query.wardUpdates.findFirst({
    //   orderBy: (wardUpdates, { desc }) => [desc(wardUpdates.version)]
    // })
    const localEvents = await db.select().from(wardEvents).get();

    logger.log("lastLocalUpdates:: ", localEvents);

    const lastLocalUpdates = await db
      .select()
      .from(wardUpdates)
      // .orderBy(wardUpdates.createdAt)
      .get();

    logger.log("lastLocalUpdates:: ", lastLocalUpdates);
    const syncUrl = new URL("/api/collections/wards_updates/records", EXPO_PUBLIC_SYNC_URL);
    if (lastLocalUpdates) {
      syncUrl.searchParams.set("filter", `(version>${lastLocalUpdates.version})`);
      syncUrl.searchParams.set("sort", "-version");
      syncUrl.searchParams.set("skipTotal", "true");
    }
    const response = await fetch(syncUrl.toString());
    if (!response.ok) {
      logger.log("error fetching remote updates", response);
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
    logger.log("ward updates", response);
    const result = z.array(WardUpdatesZodSchema).parse(responseData);
    return { result, error: null };
  } catch (error) {
    logger.log("something went wrong checking for ward data updates", error);
    return {
      result: null,
      error: error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
}
