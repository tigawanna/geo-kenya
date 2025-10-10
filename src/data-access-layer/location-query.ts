import { executeQuery } from "@/modules/expo-spatialite";
import { logger } from "@/utils/logger";
import { queryOptions } from "@tanstack/react-query";

interface IsPointInkenyaProps {
  lng: number | undefined;
  lat: number | undefined;
}
export async function isPointInkenya({ lat, lng }: IsPointInkenyaProps) {
  try {
    if (!lat || !lng) {
      throw new Error("Invalid coordinates");
    }
    const query = await executeQuery<{ "1": 1 }>(
      `
    SELECT 1 
    FROM country 
    WHERE ST_Contains(geom, MakePoint(${lng}, ${lat}, 4326))
    LIMIT 1
              `
    );
    const results = query.data;
    if (!results.length) {
      return {
        results: "outside_kenya",
        error: null,
      } as const;
    }
    const is_inkenya = results?.[0]?.[1];
    logger.log("is_inkenya", is_inkenya);
    if (is_inkenya) {
      return {
        results: "in_kenya",
        error: null,
      } as const;
    } else {
      return {
        results: "outside_kenya",
        error: null,
      } as const;
    }
  } catch (e) {
    console.log("error getting closest wards", e);
    return {
      results: null,
      error: e instanceof Error ? e.message : JSON.stringify(e),
    };
  }
}
