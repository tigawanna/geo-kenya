import type { AppDatabase } from "./src/db/d1";
import { createAuth } from "./src/lib/better-auth/auth";
import { createFirebaseAuthPlugin } from "./src/lib/firebase/plugin";

const baseURL = process.env.BETTER_AUTH_URL;
const firebasePlugin = createFirebaseAuthPlugin(process.env);

/**
 * CLI entry for `pnpm auth:generate`.
 * Uses the same factory as the worker; only the runtime inputs differ.
 */
export const auth = createAuth({
  db: {} as AppDatabase,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  trustedOrigins: [baseURL],
  adminEmail: process.env.ADMIN_EMAIL ?? undefined,
  plugins: firebasePlugin ? [firebasePlugin] : [],
});
