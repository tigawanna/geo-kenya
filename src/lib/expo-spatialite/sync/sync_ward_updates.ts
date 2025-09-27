import { WardUpdatesZodSchema } from "@/lib/drizzle/schema";
import { logger } from "@/utils/logger";
import { z } from "zod";

const SYNC_URL = process.env.SYNC_URL;

export async function syncWardDb() {}

export async function seedDbUpdates() {}

export async function checkDbUpdates() {
  try {
    if (!SYNC_URL) {
      throw new Error("No sync url provided");
    }
    const response = await fetch(SYNC_URL);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseData = await response.json();
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
