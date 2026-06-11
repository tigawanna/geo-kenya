import { getAuth } from "@/lib/auth";
import { createDb } from "@/db/d1";
import { syncEvents } from "@/lib/drizzle/schema/sync-events-schema";
import type {
  SyncEventPayload,
  SyncEventRecord,
  SyncPullResponse,
  SyncPushRequest,
  SyncPushResponse,
} from "@/types/sync";
import { and, asc, count, eq, gt } from "drizzle-orm";
import { Hono } from "hono";

const PUSH_BATCH_LIMIT = 50;
const PULL_BATCH_LIMIT = 100;

function mapRow(row: typeof syncEvents.$inferSelect): SyncEventRecord {
  return {
    id: row.id,
    deviceId: row.deviceId,
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

function isValidPushPayload(body: unknown): body is SyncPushRequest {
  if (!body || typeof body !== "object") return false;
  const value = body as SyncPushRequest;
  return typeof value.deviceId === "string" && Array.isArray(value.events);
}

function normalizeIncomingEvent(event: SyncEventPayload, deviceId: string) {
  return {
    id: event.id,
    deviceId,
    tableName: event.table,
    rowId: event.rowId,
    action: event.action,
    payloadJson: JSON.stringify(event.payload ?? {}),
    createdAt: event.createdAt,
    verified: false,
    verifiedAt: null,
    verifiedBy: null,
  };
}

export const syncRoutes = new Hono<{ Bindings: CloudflareBindings }>()
  .post("/events", async (c) => {
    const auth = getAuth();
    const syncSecret = c.env.SYNC_API_SECRET;
    const headerSecret = c.req.header("x-sync-secret");
    const hasSyncSecret = Boolean(syncSecret && headerSecret === syncSecret);

    if (!hasSyncSecret) {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session?.user) {
        return c.json({ error: "Unauthorized" }, 401);
      }
    }

    const body: unknown = await c.req.json();
    if (!isValidPushPayload(body)) {
      return c.json({ error: "Invalid payload" }, 400);
    }

    const db = createDb(c.env.DB);
    const batch = body.events.slice(0, PUSH_BATCH_LIMIT);
    let accepted = 0;
    let lastAcceptedId: string | null = null;

    for (const event of batch) {
      const row = normalizeIncomingEvent(event, body.deviceId);
      await db.insert(syncEvents).values(row).onConflictDoNothing({ target: syncEvents.id });
      accepted += 1;
      lastAcceptedId = row.id;
    }

    const response: SyncPushResponse = {
      accepted,
      hasMore: body.events.length > PUSH_BATCH_LIMIT,
      lastAcceptedId,
    };

    return c.json(response);
  })
  .get("/events", async (c) => {
    const auth = getAuth();
    const after = c.req.query("after");
    const pageParam = Number(c.req.query("page") ?? "1");
    const limit = Math.min(Number(c.req.query("limit") ?? PULL_BATCH_LIMIT), PULL_BATCH_LIMIT);
    const includeUnverified = c.req.query("includeUnverified") === "true";
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    const isAdmin = session?.user?.role === "admin";

    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conditions = [];
    if (after) {
      conditions.push(gt(syncEvents.id, after));
    }
    if (!includeUnverified || !isAdmin) {
      conditions.push(eq(syncEvents.verified, true));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const db = createDb(c.env.DB);

    const [totalRow] = await db.select({ total: count() }).from(syncEvents).where(whereClause);
    const totalCount = totalRow?.total ?? 0;
    const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / limit);
    const page = Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1;

    const rows = await db
      .select()
      .from(syncEvents)
      .where(whereClause)
      .orderBy(asc(syncEvents.id))
      .limit(limit + 1);

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;
    const remainingCount = Math.max(0, totalCount - items.length);

    const response: SyncPullResponse = {
      events: items.map(mapRow),
      hasMore,
      nextCursor,
      page,
      perPage: limit,
      totalCount,
      totalPages,
      remainingCount,
    };

    return c.json(response);
  })
  .patch("/events/:id/verify", async (c) => {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (session?.user?.role !== "admin") {
      return c.json({ error: "Forbidden" }, 403);
    }

    const eventId = c.req.param("id");
    const verifiedAt = new Date().toISOString();
    const db = createDb(c.env.DB);

    await db
      .update(syncEvents)
      .set({
        verified: true,
        verifiedAt,
        verifiedBy: session.user.id,
      })
      .where(eq(syncEvents.id, eventId));

    return c.json({ ok: true, id: eventId, verifiedAt });
  });
