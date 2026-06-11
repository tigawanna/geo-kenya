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

export interface SyncPushRequest {
  deviceId: string;
  events: SyncEventPayload[];
}

export interface SyncPushResponse {
  accepted: number;
  hasMore: boolean;
  lastAcceptedId: string | null;
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

export interface SyncEventsListResponse {
  events: SyncEventRecord[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
  remainingCount: number;
  hasMore: boolean;
  nextCursor: string | null;
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
