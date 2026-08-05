import { createDb } from "@/db/d1";
import { waitlist } from "@/lib/drizzle/schema";
import { serializeError } from "@/utils/error";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { viewerMiddleware } from "../auth/viewer";

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
  userAgent: string | null;
};

export type WaitlistJoinResponse = {
  ok: true;
  alreadyJoined: boolean;
};

export const viewerWaitList = createServerFn({ method: "GET" })
  .middleware([viewerMiddleware])
  .handler(async ({ context }) => {
    try {
      const email = context.viewer.user?.email?.trim().toLowerCase();
      if (!email) {
        return { data: null, error: null };
      }

      const db = createDb(env.DB);
      const waitList = await db.query.waitlist.findFirst({
        where: eq(waitlist.email, email),
      });

      return {
        data: waitList,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: serializeError(error),
      };
    }
  });

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.email().transform((value) => value.trim().toLowerCase()),
      source: z.string().trim().min(1).max(64).optional().default("landing"),
    }),
  )
  .handler(async ({ data }): Promise<WaitlistJoinResponse> => {
    const db = createDb(env.DB);
    const existing = await db
      .select({ id: waitlist.id })
      .from(waitlist)
      .where(eq(waitlist.email, data.email))
      .limit(1);

    if (existing.length > 0) {
      return { ok: true, alreadyJoined: true };
    }

    const headers = getRequestHeaders();
    await db.insert(waitlist).values({
      id: crypto.randomUUID(),
      email: data.email,
      source: data.source,
      createdAt: new Date().toISOString(),
      userAgent: headers.get("user-agent")?.slice(0, 512) ?? null,
    });

    return { ok: true, alreadyJoined: false };
  });

export const removeMyWaitlist = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .handler(async ({ context }) => {
    const email = context.viewer.user?.email?.trim().toLowerCase();
    if (!email) {
      throw new Error("Unauthorized");
    }

    const db = createDb(env.DB);
    await db.delete(waitlist).where(eq(waitlist.email, email));
    return { ok: true as const };
  });

export const waitListQueryOptions = queryOptions({
  queryKey: ["waitlist"],
  queryFn: () => viewerWaitList(),
});
