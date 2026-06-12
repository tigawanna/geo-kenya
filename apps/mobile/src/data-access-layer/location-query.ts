import { isPointInKenyaBounds } from "@/geo/kenya-bounds";

interface IsPointInkenyaProps {
  lng: number | undefined;
  lat: number | undefined;
}

export type KenyaLocationStatus = "in_kenya" | "outside_kenya" | "unresolved";

export function hasResolvableCoordinates(
  lat: number | undefined,
  lng: number | undefined,
): boolean {
  if (lat == null || lng == null) {
    return false;
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }

  return !(lat === 0 && lng === 0);
}

export async function isPointInkenya({ lat, lng }: IsPointInkenyaProps) {
  try {
    if (!hasResolvableCoordinates(lat, lng)) {
      return {
        results: "unresolved" as const,
        error: null,
      };
    }

    if (isPointInKenyaBounds(lat!, lng!)) {
      return {
        results: "in_kenya" as const,
        error: null,
      };
    }

    return {
      results: "outside_kenya" as const,
      error: null,
    };
  } catch (e) {
    return {
      results: null,
      error: e instanceof Error ? e.message : JSON.stringify(e),
    };
  }
}
