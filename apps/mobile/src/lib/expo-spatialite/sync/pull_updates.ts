import { db } from "@/lib/drizzle/client";
import { kenyaWards, wardUpdates, WardUpdatesInsert } from "@/lib/drizzle/schema";
import { WardsUpdatesResponse } from "@/lib/pb/types/pb-types";
import { pbResponeErrorTrap } from "@/lib/pb/utils/errors";
import { logger } from "@/utils/logger";
import { eq } from "drizzle-orm";

const EXPO_PUBLIC_SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL;

export interface WardsUpdatesShape {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  items: WardsUpdatesResponse[];
}
export async function pullUpdates() {
  try {
    if (!EXPO_PUBLIC_SYNC_URL) {
      throw new Error("No sync url provided");
    }
    const lastLocalUpdates = await db
      .select()
      .from(wardUpdates)
      .orderBy(wardUpdates.createdAt)
      .get();
    const syncUrl = new URL("/api/collections/wards_updates/records", EXPO_PUBLIC_SYNC_URL);
    if (lastLocalUpdates) {
      syncUrl.searchParams.set("filter", `(version>${lastLocalUpdates.version ?? 0})`);
      syncUrl.searchParams.set("sort", "-version");
      syncUrl.searchParams.set("skipTotal", "true");
    }
    const response = await fetch(syncUrl.toString());
    const responseData = await pbResponeErrorTrap<WardsUpdatesShape>(response);

    const result = responseData;
    // logger.log("result", result);
    return {
      result,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    logger.log(`something went wrong pulling updates`, errorMessage);
    return {
      result: null,
      error: errorMessage,
    };
  }
}

export async function pullAndReplayEvents() {
  try {
    const { result, error } = await pullUpdates();
    if(error){
      throw new Error(error);
    }
    const changes = result?.items.flatMap((item) => item?.data?.changes);
    if (!result || !changes || changes.length === 0) {
      throw new Error("No changes found");
    }
    const replayPromise = changes.map((change) => {
      if (!change) return;
      if (change.event_type === "CREATE") {
        return db.insert(kenyaWards).values({
          ...change?.data,
        });
      }
      if (change.event_type === "UPDATE") {
        return db
          .update(kenyaWards)
          .set({
            ...change?.data,
          })
          .where(eq(wardUpdates.id, change?.ward_id));
      }
      if (change.event_type === "DELETE") {
        return db.delete(kenyaWards).where(eq(wardUpdates.id, change?.ward_id));
      }
    });
    await Promise.all(replayPromise);
    const updates = result?.items
      ?.map((change) => {
        if (!change || !change.data) return;
        return { data: change.data, version: change.version } satisfies WardUpdatesInsert;
      })
      .filter((change): change is WardUpdatesInsert => Boolean(change));
    await db.insert(wardUpdates).values(updates);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    logger.log(`something went wrong pulling updates`, errorMessage);
    return {
      result: null,
      error: errorMessage,
    };
  }
}
