import { createDb } from "@/db/d1";
import * as authSchema from "@/lib/drizzle/schema/auth-schema";
import { deletedAccounts } from "@/lib/drizzle/schema/deleted-accounts-schema";
import { user as userTable } from "@/lib/drizzle/schema/auth-schema";
import { APIError } from "better-auth/api";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { eq } from "drizzle-orm";

export function createAuth(env: CloudflareBindings) {
  const trustedOrigins = String(env.CORS_ORIGINS ?? env.BETTER_AUTH_URL)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const db = createDb(env.DB);
  const googleConfigured = Boolean(env.GOOGLE_CLIENT_ID) && Boolean(env.GOOGLE_CLIENT_SECRET);

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: googleConfigured
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID!,
            clientSecret: env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : undefined,
    databaseHooks: {
      user: {
        create: {
          before: async (createdUser) => {
            const email = createdUser.email.trim().toLowerCase();
            const priorDeletion = await db.query.deletedAccounts.findFirst({
              where: eq(deletedAccounts.email, email),
            });
            if (priorDeletion) {
              throw new APIError("FORBIDDEN", {
                message:
                  "This email was used for an account that was deleted and cannot be registered again.",
              });
            }
          },
          after: async (createdUser) => {
            if (env.ADMIN_EMAIL && createdUser.email === env.ADMIN_EMAIL) {
              await db
                .update(userTable)
                .set({ role: "admin" })
                .where(eq(userTable.id, createdUser.id));
            }
          },
        },
      },
    },
    plugins: [admin(), tanstackStartCookies()],
  });
}
