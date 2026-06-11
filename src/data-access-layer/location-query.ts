import { isPointInKenyaBounds } from "@/geo/kenya-bounds";

interface IsPointInkenyaProps {
  lng: number | undefined;
  lat: number | undefined;
}

export async function isPointInkenya({ lat, lng }: IsPointInkenyaProps) {
  try {
    if (lat == null || lng == null) {
      throw new Error("Invalid coordinates");
    }

    if (isPointInKenyaBounds(lat, lng)) {
      return {
        results: "in_kenya",
        error: null,
      } as const;
    }

    return {
      results: "outside_kenya",
      error: null,
    } as const;
  } catch (e) {
    return {
      results: null,
      error: e instanceof Error ? e.message : JSON.stringify(e),
    };
  }
}
