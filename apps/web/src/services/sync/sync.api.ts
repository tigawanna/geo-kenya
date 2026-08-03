import type { SyncEventsListResponse, SyncEventRecord, SyncPullResponse } from "@/types/sync";

export async function fetchAdminSyncEvents(
  after?: string | null,
  page = 1,
  limit = 100,
): Promise<SyncEventsListResponse> {
  const params = new URLSearchParams({
    includeUnverified: "true",
    limit: String(limit),
    page: String(page),
  });
  if (after) {
    params.set("after", after);
  }
  const response = await fetch(`/api/sync/events?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load sync events");
  }

  return response.json() as Promise<SyncEventsListResponse>;
}

export async function fetchSyncEventsPull(
  after?: string | null,
  page = 1,
  limit = 100,
): Promise<SyncPullResponse> {
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page),
  });
  if (after) {
    params.set("after", after);
  }
  const response = await fetch(`/api/sync/events?${params.toString()}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to pull sync events");
  }
  return response.json() as Promise<SyncPullResponse>;
}

export async function fetchUpstreamSyncEventsPreview(
  after?: string | null,
  page = 1,
  limit = 100,
): Promise<SyncEventsListResponse> {
  return fetchSyncEventsPull(after, page, limit);
}

export async function verifySyncEvent(eventId: string): Promise<void> {
  const response = await fetch(`/api/sync/events/${eventId}/verify`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to verify event");
  }
}

export async function fetchMySyncEvents(limit = 50): Promise<SyncEventsListResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(`/api/sync/events/mine?${params.toString()}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load your contributions");
  }

  return response.json() as Promise<SyncEventsListResponse>;
}

export async function withdrawMySyncEvent(eventId: string): Promise<void> {
  const response = await fetch(`/api/sync/events/${eventId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Failed to withdraw contribution");
  }
}

export function parseSyncEventPayload(event: SyncEventRecord): Record<string, unknown> {
  return JSON.parse(event.payloadJson) as Record<string, unknown>;
}
