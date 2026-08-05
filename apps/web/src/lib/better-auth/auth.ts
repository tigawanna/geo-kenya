import type { AppDatabase } from "@/db/d1";
import * as authSchema from "@/lib/drizzle/schema/auth-schema";
import { deletedAccounts } from "@/lib/drizzle/schema/deleted-accounts-schema";
import { user as userTable } from "@/lib/drizzle/schema/auth-schema";
import { APIError } from "better-auth/api";
import { betterAuth, type BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { eq } from "drizzle-orm";

export type CreateAuthOptions = {
  db: AppDatabase;
  secret: string;
  baseURL: string;
  trustedOrigins: string[];
  google?: {
    clientId: string;
    clientSecret: string;
  };
  adminEmail?: string;
  /** Platform-specific plugins (e.g. tanstackStartCookies in the worker). */
  plugins?: BetterAuthPlugin[];
};

/**
 * Shared Better Auth factory used by the Cloudflare worker and the CLI config.
 * Pass runtime/env-specific values from the caller; keep plugins/hooks here.
 */
export function createAuth(options: CreateAuthOptions) {
  const { db, secret, baseURL, trustedOrigins, google, adminEmail, plugins = [] } = options;

  return betterAuth({
    database: drizzleAdapter(db, { provider: "sqlite", schema: authSchema }),
    secret,
    baseURL,
    basePath: "/api/auth",
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: google
      ? {
          google: {
            clientId: google.clientId,
            clientSecret: google.clientSecret,
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
            if (adminEmail && createdUser.email === adminEmail) {
              await db
                .update(userTable)
                .set({ role: "admin" })
                .where(eq(userTable.id, createdUser.id));
            }
          },
        },
      },
    },
    plugins: [admin(), ...plugins],
  });
}

export type Auth = ReturnType<typeof createAuth>;
