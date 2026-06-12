import { db } from "@/lib/drizzle/client";
import { logger } from "@/utils/logger";
import { sleepFor } from "@/utils/promises";
import { queryOptions } from "@tanstack/react-query";

export function getWardEventsQueryOptions() {
  return queryOptions({
    queryKey: ["ward-events"],
    queryFn: async () => {
      try {
        await sleepFor(5_000)
        const result = await db.query.wardEvents.findMany();
        return {
          result,
          error: null,
        };
      } catch (error) {
        return {
          result: null,
          error: error instanceof Error ? error.message : JSON.stringify(error),
        };
      }
    },
  });
}
