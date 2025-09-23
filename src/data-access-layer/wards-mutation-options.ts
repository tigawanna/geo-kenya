import { KenyaWardsInsert } from "@/lib/drizzle/schema";
import { executeStatement } from "@/modules/expo-spatialite";
import { mutationOptions } from "@tanstack/react-query";
import { createQueryBuilder } from "@/lib/query-builder";
import { KenyaWardSchema } from "@/lib/query-builder/schemas";


interface UpdateWardMutationOptionspayload {
  id: number;
  data: KenyaWardsInsert;
}
export function updateWardMutationOptions() {
  return mutationOptions({
    mutationFn: async ({ id, data }: UpdateWardMutationOptionspayload) => {
      try {
        const qb = createQueryBuilder<KenyaWardSchema>('kenya_wards');
        const query = qb.update({
          ward: data.ward,
          ward_code: data.wardCode,
          county: data.county,
          county_code: data.countyCode,
          sub_county: data.subCounty,
          constituency: data.constituency,
          constituency_code: data.constituencyCode
        }).where(`id = ${id}`).build();
        
        const result = await executeStatement(query);
        // const result = await db
        //   .update(kenyaWards)
        //   .set(data)
        //   .where(eq(kenyaWards.id, id))
        //   .returning();
        return {
          result,
          error: null,
        };
      } catch (error) {
        return {
          result:null,
          error:error instanceof Error ? error.message : JSON.stringify(error),
        };
      }
    },
  });
}
