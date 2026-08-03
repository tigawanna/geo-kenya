import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const syncEvents = sqliteTable(
  "events",
  {
    id: text("id").primaryKey(),
    deviceId: text("device_id").notNull(),
    /** Set when pushed with a signed-in session; null for device/sync-secret pushes */
    userId: text("user_id"),
    tableName: text("table_name").notNull(),
    rowId: text("row_id").notNull(),
    action: text("action").notNull(),
    payloadJson: text("payload_json").notNull(),
    createdAt: text("created_at").notNull(),
    verified: integer("verified", { mode: "boolean" }).default(false).notNull(),
    verifiedAt: text("verified_at"),
    verifiedBy: text("verified_by"),
  },
  (table) => [
    index("events_created_at_idx").on(table.id),
    index("events_userId_idx").on(table.userId),
  ],
);
