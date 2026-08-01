import { createDb } from "@/db/d1";
import { waitlist } from "@/lib/drizzle/schema/waitlist-schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const waitlistBodySchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  source: z.string().trim().min(1).max(64).optional().default("landing"),
});

export const waitlistRoutes = new Hono<{ Bindings: CloudflareBindings }>().post("/", async (c) => {
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
