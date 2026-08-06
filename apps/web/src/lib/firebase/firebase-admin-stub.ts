/**
 * Cloudflare Workers stub for `firebase-admin`.
 *
 * The better-auth-firebase-auth server plugin imports Admin SDK, but we pass a
 * jose-based `verifyIdToken` implementation instead. This stub keeps the
 * import graph Workers-safe.
 */
export function getAuth(): never {
  throw new Error(
    "firebase-admin is not available on Cloudflare Workers. Pass firebaseAdminAuth with a Workers-safe verifyIdToken implementation.",
  );
}

export function initializeApp(): never {
  throw new Error("firebase-admin/app is not available on Cloudflare Workers.");
}

export function getApps(): [] {
  return [];
}

export function cert(): never {
  throw new Error("firebase-admin/app cert() is not available on Cloudflare Workers.");
}

export default {
  getAuth,
  initializeApp,
  getApps,
  cert,
};
