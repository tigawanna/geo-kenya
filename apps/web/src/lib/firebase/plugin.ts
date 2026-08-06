import type { BetterAuthPlugin } from "better-auth";
import { firebaseAuthPlugin } from "better-auth-firebase-auth/server";
import { createFirebaseIdTokenVerifier } from "@/lib/firebase/verify-id-token";

export type FirebaseAuthEnv = {
  FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  BETTER_AUTH_URL?: string;
};

/** Build the Firebase Better Auth plugin when a project id is configured. */
export function createFirebaseAuthPlugin(env: FirebaseAuthEnv): BetterAuthPlugin | null {
  const projectId = env.FIREBASE_PROJECT_ID || env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) {
    return null;
  }

  const apiKey = env.VITE_FIREBASE_API_KEY;
  const authDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
  const firebaseConfig =
    apiKey && authDomain
      ? {
          apiKey,
          authDomain,
          projectId,
        }
      : undefined;

  return firebaseAuthPlugin({
    useClientSideTokens: true,
    firebaseAdminAuth: createFirebaseIdTokenVerifier(projectId),
    // Needed later for password reset; optional for email/Google ID-token flows.
    firebaseConfig,
    passwordResetUrl: env.BETTER_AUTH_URL
      ? `${env.BETTER_AUTH_URL.replace(/\/$/, "")}/auth/reset-password`
      : undefined,
  });
}
