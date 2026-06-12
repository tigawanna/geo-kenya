import type { SyncPullResponse } from "@/lib/sync/sync.types";

function resolveSyncApiBaseUrl(): string | null {
  const value = process.env.EXPO_PUBLIC_SYNC_API_URL?.trim();
  if (!value) {
    return null;
  }
  return value.replace(/\/$/, "");
}

export function getSyncApiBaseUrl(): string | null {
  return resolveSyncApiBaseUrl();
}

export async function fetchSyncEventsPull(
  after?: string | null,
  page = 1,
  limit = 100,
): Promise<SyncPullResponse> {
  const baseUrl = resolveSyncApiBaseUrl();
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_SYNC_API_URL is not configured.");
  }

  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });
  if (after) {
    params.set("after", after);
  }

  const response = await fetch(`${baseUrl}/api/sync/events?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to pull sync events");
  }

  return response.json() as Promise<SyncPullResponse>;
}
