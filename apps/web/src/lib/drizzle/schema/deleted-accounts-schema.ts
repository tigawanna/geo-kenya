import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Emails retained after self-serve account deletion.
 * Used to remember prior deletions and block re-registration / abuse.
 */
export const deletedAccounts = sqliteTable("deleted_accounts", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  formerUserId: text("former_user_id").notNull(),
  deletedAt: text("deleted_at").notNull(),
});
