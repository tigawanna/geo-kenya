import { executeQuery } from "@/modules/expo-spatialite";

interface IsPointInkenyaProps {
  lng: number;
  lat: number;
}
export async function isPointInkenya({lat,lng}: IsPointInkenyaProps) {
      try {
        const query = await executeQuery<{ "1": 1 }>(
          `
    SELECT 1 
    FROM country 
    WHERE ST_Contains(geom, MakePoint(${lng}, ${lat}, 4326))
    LIMIT 1
              `
        );
        const results = query.data
        if (!results.length) {
          throw new Error("That point is not in kenya");
        }
        const is_inkenya = results?.[0]?.[1]
        return {
          results: !!is_inkenya,
          error: null,
        };
      } catch (e) {
        console.log("error getting closest wards", e);
        return {
          results: null,
          error: e instanceof Error ? e.message : JSON.stringify(e),
        };
      }
}
