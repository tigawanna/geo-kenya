import { db } from "@/lib/drizzle/client";
import { kenyaWards, KenyaWardsSelect } from "@/lib/drizzle/schema";
import { executeQuery } from "@/modules/expo-spatialite";
import { queryOptions } from "@tanstack/react-query";
import { isPointInkenya } from "./location-query";
import { sql, eq, getTableColumns } from "drizzle-orm";
import { logger } from "@/utils/logger";

interface WardsQueryOptionsProps {
  searchQuery: string;
}
export function wardsQueryOptions({ searchQuery }: WardsQueryOptionsProps) {
  return queryOptions({
    queryKey: ["wards", searchQuery],
    placeholderData: (previousData) => previousData,
    queryFn: async () => {
      try {
        const result = await db.query.kenyaWards.findMany({
          columns: {
            geom: false,
            subCounty: false,
          },
          where(fields, operators) {
            if (searchQuery && searchQuery.length > 0) {
              const lowercaseSearch = searchQuery.toLowerCase();
              return operators.or(
                operators.like(operators.sql`lower(ward)`, `%${lowercaseSearch}%`),
                operators.like(operators.sql`lower(${fields.county})`, `%${lowercaseSearch}%`),
                operators.like(operators.sql`lower(${fields.constituency})`, `%${lowercaseSearch}%`)
              );
            }
            // Return undefined or omit where clause if no searchQuery
            return undefined;
          },
        });
        return {
          result,
          error: null,
        };
      } catch (e) {
        // console.error(e);
        return {
          result: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
  });
}

interface GetWardByLocationProps {
  lat: number;
  lng: number;
}
export function getWardByLocation({ lat, lng }: GetWardByLocationProps) {
  return queryOptions({
    queryKey: ["current-ward", lat, lng],
    queryFn: async () => {
      try {
        const result = await executeQuery<KenyaWardsSelect & { geometry: string }>(
          `
            SELECT 
              id, 
              ward_code as wardCode, 
              ward, 
              county, 
              county_code as countyCode, 
              sub_county as subCounty, 
              constituency, 
              constituency_code as constituencyCode,
              AsGeoJSON(geom) as geometry 
            FROM kenya_wards
            WHERE ST_Contains(geom, MakePoint(${lng}, ${lat}, 4326))
            LIMIT 1
          `
        );

        const ward = result?.data?.[0];
        if (!ward) {
          throw new Error("Ward not found");
        }

        return {
          result: ward,
          error: null,
        };
      } catch (e) {
        return {
          result: null,
          error: e instanceof Error ? e.message : String(e),
        };
      }
    },
    enabled: lat !== 0 && lng !== 0,
    placeholderData: (prevData) => prevData,
  });
}

interface GetWardByIdProps {
  id: number;
}
export function getWardByIdQueryOptions({ id }: GetWardByIdProps) {
  return queryOptions({
    queryKey: ["wards", "single", id],
    queryFn: async () => {
      try {
        const query = await db
          .select({
            ...getTableColumns(kenyaWards),
            geom: sql<string>`AsGeoJSON(${kenyaWards.geom})`,
          })
          .from(kenyaWards)
          .where(eq(kenyaWards.id, id))
          .limit(1);
        const ward = query?.[0];
        if (!ward) {
          throw new Error("Ward not found");
        }

        return {
          result: ward,
          error: null,
        };
      } catch (e) {
        return {
          result: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
    enabled: !!id,
    // staleTime: 0,
    // placeholderData: (prevData) => prevData,
  });
}

// data-access-layer/wards-query-options.ts

interface GetWardsByIdsProps {
  ids: number[];
}

export function getWardsByIdsQueryOptions({ ids }: GetWardsByIdsProps) {
  return queryOptions({
    queryKey: ["wards", "multiple", ids],
    queryFn: async () => {
      if (ids.length === 0) {
        return { result: [], error: null };
      }

      try {
        const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
        const result = await executeQuery<KenyaWardsSelect>(
          `
SELECT 
  "id", 
  "ward", 
  "county", 
  "constituency", 
  "ward_code" as "wardCode", 
  "county_code" as "countyCode", 
  "sub_county" as "subCounty", 
  "constituency_code" as "constituencyCode", 
  "minx", 
  "miny", 
  "maxx", 
  "maxy",
  AsGeoJSON("geom") AS "geom"
FROM "kenya_wards" AS "kenyaWards" 
WHERE "kenyaWards"."id" IN (${placeholders})
        `,
          ids
        ); // 👈 Pass IDs as parameters for safety

        const wards = result?.data || [];

        return {
          result: wards,
          error: null,
        };
      } catch (e) {
        return {
          result: [],
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
    enabled: ids.length > 0,
  });
}

interface gGtClosestWardsByCorrdsQueryOptionsProps {
  lat: number;
  lng: number;
}

export function getClosestWardsByCorrdsQueryOptions({
  lat,
  lng,
}: gGtClosestWardsByCorrdsQueryOptionsProps) {
  return queryOptions({
    queryKey: ["closest-ward", lat, lng],
    queryFn: async () => {
      try {
        const query = await executeQuery<KenyaWardsSelect>(
          `
                SELECT 
                  id,
                  ward_code AS "wardCode",
                  ward,
                  county,
                  county_code AS "countyCode",
                  sub_county AS "subCounty",
                  constituency,
                  constituency_code AS "constituencyCode",
                  AsGeoJSON(geom) AS geometry,
                  ST_Distance(ST_Centroid(geom), MakePoint(${lng}, ${lat}, 4326), 1) AS distance
                FROM kenya_wards
                ORDER BY distance
                LIMIT 10
              `
        );

        // const query = await db
        //   .select({
        //     ...getTableColumns(kenyaWards),
        //     geom: sql`AsGeoJSON(${kenyaWards.geom})`,
        //     distance: sql`ST_Distance(${kenyaWards.geom}, MakePoint(${lng}, ${lat}, 4326), 1)`,
        //   })
        //   .from(kenyaWards)
        //   .where(sql`ST_Distance(${kenyaWards.geom}, MakePoint(${lng}, ${lat}, 4326), 1) < 5000`)
        //   .limit(10);

        // logger.log(" plain strin closest location results ", query);
        const results = query?.data?.slice(1);
        if (!results.length) {
          throw new Error("No nearby wards found");
        }

        return {
          results: results,
          error: null,
        };
      } catch (e) {
        logger.log("error getting closest wards", e);
        return {
          results: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
    // staleTime: 0,
    placeholderData: (prevData) => prevData,
  });
}

interface GetClosestWardsByGeomProps {
  wardId?: number;
}
export function getClosestWardsByGeomQueryOptions({ wardId }: GetClosestWardsByGeomProps) {
  return queryOptions({
    queryKey: ["closest-wards-by-geom", wardId],
    queryFn: async () => {
      try {
        const query = await executeQuery<KenyaWardsSelect & { geometry: string; distance: number }>(
          `
            SELECT 
              w2.id,
              w2.ward,
              w2.county,
              w2.constituency,
              w2.ward_code AS "wardCode",
              w2.county_code AS "countyCode",
              w2.sub_county AS "subCounty",
              w2.constituency_code AS "constituencyCode",
              AsGeoJSON(w2.geom) AS geometry,
              ST_Distance(ST_Centroid(w1.geom), ST_Centroid(w2.geom), 1) AS distance
            FROM kenya_wards w1
            JOIN kenya_wards w2 ON w2.id != w1.id
            WHERE w1.id = ${wardId}
            ORDER BY distance
            LIMIT 10
          `
        );

        const results = query.data;
        if (!results.length) {
          throw new Error("No nearby wards found");
        }

        return {
          results,
          error: null,
        };
      } catch (e) {
        return {
          results: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
    enabled: !!wardId,
    placeholderData: (prevData) => prevData,
  });
}

interface CheckIsPointInKenyaQueryOptionsProps {
  lat: number | undefined;
  lng: number | undefined;
}

export function checkIsPointInKenyaQueryOptions({
  lat,
  lng,
}: CheckIsPointInKenyaQueryOptionsProps) {
  return queryOptions({
    queryKey: ["in-kenya", lat, lng],
    queryFn: async () => {
      return isPointInkenya({ lat, lng });
    },
    // staleTime: 0,
    placeholderData: (prevData) => prevData,
  });
}
