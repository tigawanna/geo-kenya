import type { Auth } from "firebase-admin/auth";
import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Workers-safe Firebase ID token verifier.
 *
 * `firebase-admin` is not supported on Cloudflare Workers. The plugin only
 * needs `verifyIdToken`, so we verify with Google's JWKS via `jose` instead.
 */
const firebaseJwks = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

export function createFirebaseIdTokenVerifier(projectId: string): Auth {
  return {
    async verifyIdToken(idToken: string) {
      const { payload } = await jwtVerify(idToken, firebaseJwks, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
      });

      if (!payload.sub) {
        throw new Error("Firebase ID token is missing subject (uid)");
      }

      return {
        uid: payload.sub,
        email: typeof payload.email === "string" ? payload.email : null,
        name: typeof payload.name === "string" ? payload.name : null,
        picture: typeof payload.picture === "string" ? payload.picture : null,
        email_verified: Boolean(payload.email_verified),
        phone_number: typeof payload.phone_number === "string" ? payload.phone_number : null,
        exp: typeof payload.exp === "number" ? payload.exp : undefined,
      };
    },
  } as unknown as Auth;
}
