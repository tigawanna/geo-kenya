import { executeQuerySync } from "@/lib/drizzle/client";
import { db } from "@/lib/drizzle/client";
import { kenyaWards, KenyaWardsSelect } from "@/lib/drizzle/schema";
import {
  findClosestWardsByCoordinates,
  findWardByCoordinates,
} from "@/data-access-layer/ward-location-lookup";
import { queryOptions } from "@tanstack/react-query";
import { hasResolvableCoordinates, isPointInkenya } from "./location-query";
import { sql, eq } from "drizzle-orm";

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
                operators.like(operators.sql`lower(${fields.constituency})`, `%${lowercaseSearch}%`),
              );
            }
            return undefined;
          },
        });
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
      const lookup = findWardByCoordinates(lat, lng);

      if (!lookup.ward) {
        console.log("[WardLocation] getWardByLocation: no ward found", {
          lat,
          lng,
          error: lookup.error,
        });
        return {
          result: null,
          error: lookup.error ?? "Ward not found",
        };
      }

      console.log("[WardLocation] getWardByLocation: success", {
        lat,
        lng,
        strategy: lookup.strategy,
        wardId: lookup.ward.id,
        wardName: lookup.ward.ward,
      });

      return {
        result: lookup.ward,
        error: null,
      };
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
        const query = executeQuerySync<KenyaWardsSelect & { geom: string | null }>(
          `
            SELECT
              id,
              ward_code AS wardCode,
              ward,
              county,
              county_code AS countyCode,
              sub_county AS subCounty,
              constituency,
              constituency_code AS constituencyCode,
              minx AS minX,
              miny AS minY,
              maxx AS maxX,
              maxy AS maxY,
              AsGeoJSON(geom) AS geom
            FROM kenya_wards
            WHERE id = ?
            LIMIT 1
          `,
          [id],
        );
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
  });
}

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
        const placeholders = ids.map(() => "?").join(", ");
        const result = executeQuerySync<KenyaWardsSelect>(
          `
SELECT 
  id, 
  ward, 
  county, 
  constituency, 
  ward_code as wardCode, 
  county_code as countyCode, 
  sub_county as subCounty, 
  constituency_code as constituencyCode, 
  minx, 
  miny, 
  maxx, 
  maxy,
  AsGeoJSON(geom) AS geom
FROM kenya_wards
WHERE id IN (${placeholders})
          `,
          ids,
        );

        return {
          result,
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

interface GetClosestWardsByCoordsQueryOptionsProps {
  lat: number;
  lng: number;
}

export function getClosestWardsByCorrdsQueryOptions({
  lat,
  lng,
}: GetClosestWardsByCoordsQueryOptionsProps) {
  return queryOptions({
    queryKey: ["closest-ward", lat, lng],
    queryFn: async () => {
      const { results, error } = findClosestWardsByCoordinates(lat, lng, 10);

      if (error) {
        return { results: null, error };
      }

      if (!results.length) {
        return { results: null, error: "No nearby wards found" };
      }

      return { results, error: null };
    },
    enabled: lat !== 0 && lng !== 0,
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
        const query = executeQuerySync<KenyaWardsSelect & { geometry: string; distance: number }>(
          `
            SELECT 
              w2.id,
              w2.ward,
              w2.county,
              w2.constituency,
              w2.ward_code AS wardCode,
              w2.county_code AS countyCode,
              w2.sub_county AS subCounty,
              w2.constituency_code AS constituencyCode,
              AsGeoJSON(w2.geom) AS geometry,
              ST_Distance(ST_Centroid(w1.geom), ST_Centroid(w2.geom), 1) AS distance
            FROM kenya_wards w1
            JOIN kenya_wards w2 ON w2.id != w1.id
            WHERE w1.id = ?
            ORDER BY distance
            LIMIT 10
          `,
          [wardId!],
        );

        const results = query;
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
    enabled: hasResolvableCoordinates(lat, lng),
    placeholderData: (prevData) => prevData,
  });
}
