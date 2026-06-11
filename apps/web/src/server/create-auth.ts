import { createDb } from "@/db/d1";
import * as authSchema from "@/lib/drizzle/schema/auth-schema";
import { user as userTable } from "@/lib/drizzle/schema/auth-schema";
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
    databaseHooks: env.ADMIN_EMAIL
      ? {
          user: {
            create: {
              after: async (createdUser) => {
                if (createdUser.email === env.ADMIN_EMAIL) {
                  await db
                    .update(userTable)
                    .set({ role: "admin" })
                    .where(eq(userTable.id, createdUser.id));
                }
              },
            },
          },
        }
      : undefined,
    plugins: [admin(), tanstackStartCookies()],
  });
}
