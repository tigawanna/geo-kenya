import { db } from "@/lib/drizzle/client";
import { wardUpdates, WardUpdatesSelect, WardUpdatesZodSchema } from "@/lib/drizzle/schema";
import { WardsUpdatesResponse } from "@/lib/pb/types/pb-types";
import { pbResponeErrorTrap } from "@/lib/pb/utils/errors";
import { logger } from "@/utils/logger";
import { z } from "zod";

const EXPO_PUBLIC_SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL;

// const wardUpdatesResponseSchema = z.object({
//   page: z.number(),
//   perPage: z.number(),
//   totalPages: z.number(),
//   totalItems: z.number(),
//   items: z.array(WardUpdatesZodSchema),
// });

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
      //   syncUrl.searchParams.set("filter", `(version>${lastLocalUpdates.version})`);
      syncUrl.searchParams.set("sort", "-version");
      syncUrl.searchParams.set("skipTotal", "true");
    }
    const response = await fetch(syncUrl.toString());
    const responseData = (await pbResponeErrorTrap<WardsUpdatesShape>(response));


    const result = responseData
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
