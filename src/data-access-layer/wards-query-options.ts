import { db } from "@/lib/drizzle/client";
import { KenyaWardsSelect } from "@/lib/drizzle/schema";
import { executeQuery } from "@/modules/expo-spatialite";
import { queryOptions } from "@tanstack/react-query";
import { sql } from "drizzle-orm";

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
        const result = await db.query.kenyaWards.findFirst({
          where: (fields, { eq, or }) =>
            or(
              sql`
                        Within(GeomFromText('POINT(' || ${lng} || ' ' || ${lat} || ')', 4326), geom)
                    `
            ),
        });

        if (!result) {
          throw new Error("Ward not found");
        }

        return {
          result,
          error: null,
        };
      } catch (e) {
        return {
          result: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
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
        const result = await db.query.kenyaWards.findFirst({
          where: (fields, { eq }) => eq(fields.id, id),
        });

        if (!result) {
          throw new Error("Ward not found");
        }

        return {
          result,
          error: null,
        };
      } catch (e) {
        return {
          result: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
    staleTime: 0,
    // placeholderData: (prevData) => prevData,
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
                  ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1) AS distance
                FROM kenya_wards
                WHERE ST_Distance(geom, MakePoint(${lng}, ${lat}, 4326), 1) < 5000
                ORDER BY distance
                LIMIT 10
              `
        );
        // logger.log(" plain strin closest location results ", query);
        const results = query.data.slice(1);
        if (!results.length) {
          throw new Error("No nearby wards found");
        }

        return {
          results: results,
          error: null,
        };
      } catch (e) {
        console.log("error getting closest wards", e);
        return {
          results: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
    },
    staleTime: 0,
    // placeholderData: (prevData) => prevData,
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
        const query = await executeQuery<KenyaWardsSelect>(
          `
            SELECT 
              w2.id,
              w2.ward_code AS "wardCode",
              w2.ward,
              w2.county,
              w2.county_code AS "countyCode",
              w2.sub_county AS "subCounty",
              w2.constituency,
              w2.constituency_code AS "constituencyCode",
              AsGeoJSON(w2.geom) AS geometry,
              ST_Distance(w1.geom, w2.geom, 1) AS distance
            FROM kenya_wards w1, kenya_wards w2
            WHERE w1.id = ${wardId} 
              AND w2.id != ${wardId}
              AND ST_Distance(w1.geom, w2.geom, 1) < 50000
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
