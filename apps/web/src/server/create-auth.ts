import { createDb } from "@/db/d1";
import { createAuth } from "@/lib/better-auth/auth";
import { createFirebaseAuthPlugin } from "@/lib/firebase/plugin";
import { tanstackStartCookies } from "better-auth/tanstack-start";

/** Cloudflare worker entry — maps bindings into the shared auth factory. */
export function createAuthFromEnv(env: CloudflareBindings) {
  const trustedOrigins = String(env.CORS_ORIGINS ?? env.BETTER_AUTH_URL)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  // Prefer Firebase Google when Firebase is configured; otherwise keep BA OAuth.
  const firebasePlugin = createFirebaseAuthPlugin(env);
  const googleConfigured =
    !firebasePlugin && Boolean(env.GOOGLE_CLIENT_ID) && Boolean(env.GOOGLE_CLIENT_SECRET);
  const google = googleConfigured
    ? {
        clientId: env.GOOGLE_CLIENT_ID!,
        clientSecret: env.GOOGLE_CLIENT_SECRET!,
      }
    : undefined;

  return createAuth({
    db: createDb(env.DB),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    trustedOrigins,
    google,
    adminEmail: env.ADMIN_EMAIL || undefined,
    plugins: [tanstackStartCookies(), ...(firebasePlugin ? [firebasePlugin] : [])],
  });
}
