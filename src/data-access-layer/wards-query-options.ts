import { db } from "@/lib/drizzle/client";
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
export function getWardById({ id }: GetWardByIdProps) {
  return queryOptions({
    queryKey: ["wards","single", id],
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
    placeholderData: (prevData) => prevData,
  });
}
