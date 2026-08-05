import type { AppDatabase } from "./src/db/d1";
import { createAuth } from "./src/lib/better-auth/auth";

const baseURL = process.env.BETTER_AUTH_URL;
const google =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }
    : undefined;
/**
 * CLI entry for `pnpm auth:generate`.
 * Uses the same factory as the worker; only the runtime inputs differ.
 */
export const auth = createAuth({
  db: {} as AppDatabase,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [baseURL],
  google,
  adminEmail: process.env.ADMIN_EMAIL ?? undefined,
});
