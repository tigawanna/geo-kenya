import { db } from "@/lib/drizzle/client";
import { kenyaWards, KenyaWardsInsert } from "@/lib/drizzle/schema";
import { mutationOptions } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

interface UpdateWardMutationOptionspayload {
  id: number;
  data: KenyaWardsInsert;
}

export function updateWardMutationOptions() {
  return mutationOptions({
    mutationFn: async ({ id, data }: UpdateWardMutationOptionspayload) => {
      try {
        const result = await db.update(kenyaWards).set(data).where(eq(kenyaWards.id, id));
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
    meta: {
      invalidates: [
        ["closest-ward"],
        ["wards"],
        ["closest-wards-by-geom"],
        ["current-ward"],
        ["ward-events"],
      ],
    },
  });
}
