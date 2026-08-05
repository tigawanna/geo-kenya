import { isAdminUser, viewerMiddleware } from "@/data-access-layer/auth/viewer";
import { createDb } from "@/db/d1";
import { syncEvents } from "@/lib/drizzle/schema/sync-events-schema";
import type { SyncEventRecord, SyncEventsListResponse, SyncPullResponse } from "@/types/sync";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, count, desc, eq, gt } from "drizzle-orm";
import { z } from "zod";

const PULL_BATCH_LIMIT = 100;

function mapRow(row: typeof syncEvents.$inferSelect): SyncEventRecord {
  return {
    id: row.id,
    deviceId: row.deviceId,
    userId: row.userId ?? null,
    tableName: row.tableName,
    rowId: row.rowId,
    action: row.action as SyncEventRecord["action"],
    payloadJson: row.payloadJson,
    createdAt: row.createdAt,
    verified: row.verified,
    verifiedAt: row.verifiedAt,
    verifiedBy: row.verifiedBy,
  };
}

async function listSyncEvents(options: {
  after?: string | null;
  page: number;
  limit: number;
  includeUnverified: boolean;
  isAdmin: boolean;
}): Promise<SyncPullResponse> {
  const limit = Math.min(options.limit, PULL_BATCH_LIMIT);
  const conditions = [];

  if (options.after) {
    conditions.push(gt(syncEvents.id, options.after));
  }
  if (!options.includeUnverified || !options.isAdmin) {
    conditions.push(eq(syncEvents.verified, true));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  const db = createDb(env.DB);

  const [totalRow] = await db.select({ total: count() }).from(syncEvents).where(whereClause);
  const totalCount = totalRow?.total ?? 0;
  const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / limit);

  const rows = await db
    .select()
    .from(syncEvents)
    .where(whereClause)
    .orderBy(asc(syncEvents.id))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;

  return {
    events: items.map(mapRow),
    hasMore,
    nextCursor,
    page: options.page,
    perPage: limit,
    totalCount,
    totalPages,
    remainingCount: Math.max(0, totalCount - items.length),
  };
}

export const fetchSyncEvents = createServerFn({ method: "GET" })
  .middleware([viewerMiddleware])
  .validator(
    z.object({
      after: z.string().nullable().optional(),
      page: z.number().int().positive().optional().default(1),
      limit: z.number().int().positive().max(PULL_BATCH_LIMIT).optional().default(100),
      includeUnverified: z.boolean().optional().default(false),
    }),
  )
  .handler(async ({ data, context }) => {
    return listSyncEvents({
      after: data.after,
      page: data.page,
      limit: data.limit,
      includeUnverified: data.includeUnverified,
      isAdmin: isAdminUser(context.viewer.user),
    });
  });

export const fetchAdminSyncEvents = createServerFn({ method: "GET" })
  .middleware([viewerMiddleware])
  .validator(
    z.object({
      after: z.string().nullable().optional(),
      page: z.number().int().positive().optional().default(1),
      limit: z.number().int().positive().max(PULL_BATCH_LIMIT).optional().default(100),
    }),
  )
  .handler(async ({ data, context }): Promise<SyncEventsListResponse> => {
    if (!isAdminUser(context.viewer.user)) {
      throw new Error("Forbidden");
    }

    return listSyncEvents({
      after: data.after,
      page: data.page,
      limit: data.limit,
      includeUnverified: true,
      isAdmin: true,
    });
  });

export const fetchMySyncEvents = createServerFn({ method: "GET" })
  .middleware([viewerMiddleware])
  .validator(
    z.object({
      limit: z.number().int().positive().max(100).optional().default(50),
    }),
  )
  .handler(async ({ data, context }): Promise<SyncEventsListResponse> => {
    const limit = Math.min(data.limit, 100);
    const userId = context.viewer.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const db = createDb(env.DB);
    const whereClause = eq(syncEvents.userId, userId);

    const [totalRow] = await db.select({ total: count() }).from(syncEvents).where(whereClause);
    const totalCount = totalRow?.total ?? 0;

    const rows = await db
      .select()
      .from(syncEvents)
      .where(whereClause)
      .orderBy(desc(syncEvents.createdAt))
      .limit(limit);

    return {
      events: rows.map(mapRow),
      page: 1,
      perPage: limit,
      totalCount,
      totalPages: totalCount === 0 ? 0 : 1,
      remainingCount: Math.max(0, totalCount - rows.length),
      hasMore: totalCount > rows.length,
      nextCursor: null,
    };
  });

export const verifySyncEvent = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .validator(z.object({ eventId: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    if (!isAdminUser(context.viewer.user)) {
      throw new Error("Forbidden");
    }

    const verifiedAt = new Date().toISOString();
    const db = createDb(env.DB);

    await db
      .update(syncEvents)
      .set({
        verified: true,
        verifiedAt,
        verifiedBy: context.viewer.user!.id,
      })
      .where(eq(syncEvents.id, data.eventId));

    return { ok: true as const, id: data.eventId, verifiedAt };
  });

export const withdrawMySyncEvent = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .validator(z.object({ eventId: z.string().min(1) }))
  .handler(async ({ data, context }) => {
    const userId = context.viewer.user?.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const db = createDb(env.DB);
    const [row] = await db
      .select()
      .from(syncEvents)
      .where(eq(syncEvents.id, data.eventId))
      .limit(1);

    if (!row || row.userId !== userId) {
      throw new Error("Not found");
    }

    if (row.verified) {
      throw new Error("Verified contributions stay in the shared dataset and cannot be withdrawn.");
    }

    await db.delete(syncEvents).where(eq(syncEvents.id, data.eventId));
    return { ok: true as const, id: data.eventId };
  });

export function parseSyncEventPayload(event: SyncEventRecord): Record<string, unknown> {
  return JSON.parse(event.payloadJson) as Record<string, unknown>;
}

export const syncStatusQueryOptions = queryOptions({
  queryKey: ["sync", "status"],
  queryFn: () =>
    fetchSyncEvents({
      data: { after: null, page: 1, limit: 25, includeUnverified: false },
    }),
});

export function adminSyncEventsQueryOptions(page: number, limit = 50) {
  return queryOptions({
    queryKey: ["sync", "admin", "events", page],
    queryFn: () =>
      fetchAdminSyncEvents({
        data: { after: null, page, limit },
      }),
  });
}

export function mySyncEventsQueryOptions(limit = 50) {
  return queryOptions({
    queryKey: ["sync", "mine", limit],
    queryFn: () => fetchMySyncEvents({ data: { limit } }),
  });
}
