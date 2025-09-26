import { db } from "@/lib/drizzle/client";
import { logger } from "@/utils/logger";
import { queryOptions } from "@tanstack/react-query";

export function getWardEventsQueryOptions() {
  return queryOptions({
    queryKey: ["ward-events"],
    queryFn: async () => {
      try {
        const result = await db.query.wardEvents.findMany();
        logger.log("📝 ward-events:", result)
        return {
          result,
          error: null,
        };
      } catch (error) {
        return {
          result: null,
          error:error instanceof Error?error.message:JSON.stringify(error),
        };
      }
    },
  });
}
