export type SyncAction = "create" | "update" | "delete";

export interface SyncEventPayload {
  id: string;
  deviceId: string;
  table: string;
  rowId: string;
  action: SyncAction;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface SyncEventRecord {
  id: string;
  deviceId: string;
  tableName: string;
  rowId: string;
  action: SyncAction;
  payloadJson: string;
  createdAt: string;
  verified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
}

export interface KenyaEventsSeedJson {
  version: number;
  format: "geo-kenya-sync-events-seed";
  generatedAt: string;
  events: SyncEventPayload[];
}

export interface SyncPullResponse {
  events: SyncEventRecord[];
  hasMore: boolean;
  nextCursor: string | null;
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  remainingCount: number;
}

export function payloadToRecord(event: SyncEventPayload, verified = true): SyncEventRecord {
  const verifiedAt = verified ? new Date().toISOString() : null;
  return {
    id: event.id,
    deviceId: event.deviceId,
    tableName: event.table,
    rowId: event.rowId,
    action: event.action,
    payloadJson: JSON.stringify(event.payload ?? {}),
    createdAt: event.createdAt,
    verified,
    verifiedAt,
    verifiedBy: verified ? "local-seed" : null,
  };
}
