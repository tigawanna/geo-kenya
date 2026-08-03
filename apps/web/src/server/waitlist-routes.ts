import { getAuth } from "@/lib/auth";
import { createDb } from "@/db/d1";
import { waitlist } from "@/lib/drizzle/schema/waitlist-schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const waitlistBodySchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  source: z.string().trim().min(1).max(64).optional().default("landing"),
});

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

export const waitlistRoutes = new Hono<{ Bindings: CloudflareBindings }>()
  .get("/me", async (c) => {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.email) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const email = session.user.email.trim().toLowerCase();
    const db = createDb(c.env.DB);
    const [row] = await db.select().from(waitlist).where(eq(waitlist.email, email)).limit(1);

    if (!row) {
      return c.json({ entry: null satisfies WaitlistEntry | null });
    }

    const entry: WaitlistEntry = {
      id: row.id,
      email: row.email,
      source: row.source,
      createdAt: row.createdAt,
    };

    return c.json({ entry });
  })
  .delete("/me", async (c) => {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session?.user?.email) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const email = session.user.email.trim().toLowerCase();
    const db = createDb(c.env.DB);
    await db.delete(waitlist).where(eq(waitlist.email, email));

    return c.json({ ok: true });
  })
  .post("/", async (c) => {
    const body: unknown = await c.req.json().catch(() => null);
    const parsed = waitlistBodySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: "Enter a valid email address." }, 400);
    }

    const db = createDb(c.env.DB);
    const existing = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, parsed.data.email))
      .limit(1);

    if (existing.length > 0) {
      return c.json({ ok: true, alreadyJoined: true });
    }

    await db.insert(waitlist).values({
      id: crypto.randomUUID(),
      email: parsed.data.email,
      source: parsed.data.source,
      createdAt: new Date().toISOString(),
      userAgent: c.req.header("user-agent")?.slice(0, 512) ?? null,
    });

    return c.json({ ok: true, alreadyJoined: false }, 201);
  });
