import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const waitlist = sqliteTable("waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  source: text("source").default("landing").notNull(),
  createdAt: text("created_at").notNull(),
  userAgent: text("user_agent"),
});
