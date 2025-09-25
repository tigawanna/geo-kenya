import { db } from "@/lib/drizzle/client";
import { queryOptions } from "@tanstack/react-query";

export function getWardEventsQueryOptions() {
  return queryOptions({
    queryKey: ["ward-events"],
    queryFn: async () => {
      try {
        const result = await db.query.wardEvents.findMany({
          with: {
            ward: true,
          },
        });
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
