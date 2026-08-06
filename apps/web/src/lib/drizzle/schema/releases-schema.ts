import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

/** Play / store distribution channels the landing page and dashboard react to. */
export const RELEASE_CHANNELS = ["closed_testing", "open_testing", "production"] as const;
export type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];

export const appReleases = sqliteTable(
  "app_releases",
  {
    id: text("id").primaryKey(),
    /** One managed row per channel; admin upserts URL / active flag. */
    channel: text("channel").$type<ReleaseChannel>().notNull(),
    url: text("url").notNull(),
    /** Optional button / card label shown to users. */
    label: text("label"),
    isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    updatedBy: text("updated_by"),
  },
  (table) => [uniqueIndex("app_releases_channel_unique").on(table.channel)],
);
