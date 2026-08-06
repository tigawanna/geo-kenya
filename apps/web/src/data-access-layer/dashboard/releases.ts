import { isAdminUser, viewerMiddleware } from "@/data-access-layer/auth/viewer";
import { createDb } from "@/db/d1";
import {
  appReleases,
  RELEASE_CHANNELS,
  type ReleaseChannel,
} from "@/lib/drizzle/schema/releases-schema";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { z } from "zod";

export type AppRelease = {
  id: string;
  channel: ReleaseChannel;
  url: string;
  label: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
};

export type PublicReleaseState = {
  closedTesting: AppRelease | null;
  openTesting: AppRelease | null;
  production: AppRelease | null;
};

/** Landing / dashboard CTA mode derived from active open + production links. */
export type LandingAccessMode = "waitlist" | "open_testing" | "production" | "open_and_production";

const releaseChannelSchema = z.enum(RELEASE_CHANNELS);

const releaseUrlSchema = z
  .url("Enter a valid URL")
  .refine((value) => value.startsWith("https://"), "URL must start with https://");

function mapRow(row: typeof appReleases.$inferSelect): AppRelease {
  return {
    id: row.id,
    channel: row.channel,
    url: row.url,
    label: row.label,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
  };
}

function toPublicState(rows: AppRelease[]): PublicReleaseState {
  const active = rows.filter((row) => row.isActive);
  return {
    closedTesting: active.find((row) => row.channel === "closed_testing") ?? null,
    openTesting: active.find((row) => row.channel === "open_testing") ?? null,
    production: active.find((row) => row.channel === "production") ?? null,
  };
}

export function getLandingAccessMode(state: PublicReleaseState): LandingAccessMode {
  if (state.openTesting && state.production) {
    return "open_and_production";
  }
  if (state.openTesting) {
    return "open_testing";
  }
  if (state.production) {
    return "production";
  }
  return "waitlist";
}

export function shouldShowWaitlist(state: PublicReleaseState): boolean {
  return getLandingAccessMode(state) === "waitlist";
}

async function listAllReleases(): Promise<AppRelease[]> {
  const db = createDb(env.DB);
  const rows = await db.select().from(appReleases);
  return rows.map(mapRow);
}

/** Public: active release links for landing page + signed-in hubs. */
export const fetchPublicReleases = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicReleaseState> => {
    const rows = await listAllReleases();
    return toPublicState(rows);
  },
);

/** Admin: all channels including inactive rows. */
export const fetchAdminReleases = createServerFn({ method: "GET" })
  .middleware([viewerMiddleware])
  .handler(async ({ context }): Promise<AppRelease[]> => {
    if (!isAdminUser(context.viewer.user)) {
      throw new Error("Forbidden");
    }
    return listAllReleases();
  });

export const upsertAppRelease = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .validator(
    z.object({
      channel: releaseChannelSchema,
      url: releaseUrlSchema,
      label: z.string().trim().max(80).optional().nullable(),
      isActive: z.boolean().optional().default(true),
    }),
  )
  .handler(async ({ data, context }): Promise<AppRelease> => {
    if (!isAdminUser(context.viewer.user)) {
      throw new Error("Forbidden");
    }

    const db = createDb(env.DB);
    const now = new Date().toISOString();
    const label = data.label?.trim() ? data.label.trim() : null;
    const existing = await db
      .select()
      .from(appReleases)
      .where(eq(appReleases.channel, data.channel))
      .limit(1);

    if (existing[0]) {
      const [updated] = await db
        .update(appReleases)
        .set({
          url: data.url,
          label,
          isActive: data.isActive,
          updatedAt: now,
          updatedBy: context.viewer.user?.id ?? null,
        })
        .where(eq(appReleases.channel, data.channel))
        .returning();

      return mapRow(updated);
    }

    const [inserted] = await db
      .insert(appReleases)
      .values({
        id: crypto.randomUUID(),
        channel: data.channel,
        url: data.url,
        label,
        isActive: data.isActive,
        createdAt: now,
        updatedAt: now,
        updatedBy: context.viewer.user?.id ?? null,
      })
      .returning();

    return mapRow(inserted);
  });

export const setAppReleaseActive = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .validator(
    z.object({
      channel: releaseChannelSchema,
      isActive: z.boolean(),
    }),
  )
  .handler(async ({ data, context }): Promise<AppRelease> => {
    if (!isAdminUser(context.viewer.user)) {
      throw new Error("Forbidden");
    }

    const db = createDb(env.DB);
    const existing = await db
      .select()
      .from(appReleases)
      .where(eq(appReleases.channel, data.channel))
      .limit(1);

    if (!existing[0]) {
      throw new Error("Release channel not configured yet");
    }

    const [updated] = await db
      .update(appReleases)
      .set({
        isActive: data.isActive,
        updatedAt: new Date().toISOString(),
        updatedBy: context.viewer.user?.id ?? null,
      })
      .where(eq(appReleases.channel, data.channel))
      .returning();

    return mapRow(updated);
  });

export const clearAppRelease = createServerFn({ method: "POST" })
  .middleware([viewerMiddleware])
  .validator(z.object({ channel: releaseChannelSchema }))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    if (!isAdminUser(context.viewer.user)) {
      throw new Error("Forbidden");
    }

    const db = createDb(env.DB);
    await db.delete(appReleases).where(eq(appReleases.channel, data.channel));
    return { ok: true as const };
  });

export const publicReleasesQueryOptions = queryOptions({
  queryKey: ["releases", "public"],
  queryFn: () => fetchPublicReleases(),
  staleTime: 60_000,
});

export const adminReleasesQueryOptions = queryOptions({
  queryKey: ["releases", "admin"],
  queryFn: () => fetchAdminReleases(),
});
