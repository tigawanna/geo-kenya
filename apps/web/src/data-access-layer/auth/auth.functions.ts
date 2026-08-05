import { getAuth } from "@/lib/auth";
import { createDb } from "@/db/d1";
import {
  account,
  deletedAccounts,
  session,
  syncEvents,
  user as userTable,
} from "@/lib/drizzle/schema";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "cloudflare:workers";
import { and, eq } from "drizzle-orm";
import { viewerMiddleware } from "./viewer";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const headers = getRequestHeaders();
    return await getAuth().api.getSession({ headers });
  } catch {
    // Public prerender / misconfigured local builds should not crash marketing pages.
    // Auth-gated routes still enforce session via their own middleware.
    return null;
  }
});

/**
 * Permanently deletes the signed-in account (sessions, credentials, profile).
 * The email is retained in `deleted_accounts` so we can block re-signup abuse
 * and keep a record that this address previously deleted their data.
 * Pending contributions are withdrawn; verified ones stay in the shared dataset
 * with the account linkage cleared.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .handler(async ({ context }) => {
    const currentUser = context.viewer.user;
    if (!currentUser?.id || !currentUser.email) {
      throw new Error("Unauthorized");
    }

    const userId = currentUser.id;
    const email = currentUser.email.trim().toLowerCase();
    const db = createDb(env.DB);

    await db
      .insert(deletedAccounts)
      .values({
        id: crypto.randomUUID(),
        email,
        formerUserId: userId,
        deletedAt: new Date().toISOString(),
      })
      .onConflictDoNothing();

    // Drop pending contributions linked to this account.
    await db
      .delete(syncEvents)
      .where(and(eq(syncEvents.userId, userId), eq(syncEvents.verified, false)));

    // Keep verified shared data; clear personal linkage.
    await db
      .update(syncEvents)
      .set({ userId: null })
      .where(and(eq(syncEvents.userId, userId), eq(syncEvents.verified, true)));

    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(account).where(eq(account.userId, userId));
    await db.delete(userTable).where(eq(userTable.id, userId));

    return { ok: true as const };
  });
