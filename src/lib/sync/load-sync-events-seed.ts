import type { KenyaEventsSeedJson } from "@/lib/sync/sync.types";

import rawSeed from "../../../assets/data/kenya-events.json";

function isKenyaEventsSeed(value: unknown): value is KenyaEventsSeedJson {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as KenyaEventsSeedJson;
  return (
    candidate.format === "geo-kenya-sync-events-seed" &&
    Array.isArray(candidate.events)
  );
}

export function loadSyncEventsSeed(): KenyaEventsSeedJson {
  let data: unknown = rawSeed;

  if (typeof data === "string") {
    data = JSON.parse(data) as unknown;
  }

  if (data && typeof data === "object" && "default" in data) {
    data = (data as { default: unknown }).default;
  }

  if (!isKenyaEventsSeed(data)) {
    throw new Error(
      "kenya-events.json is not a valid sync events seed. Run pnpm generate:events and rebuild.",
    );
  }

  return data;
}
