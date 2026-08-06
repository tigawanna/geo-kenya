import type { Auth } from "@/lib/better-auth/auth";
import { adminClient } from "better-auth/client/plugins";
import { firebaseAuthClientPlugin } from "better-auth-firebase-auth/client";
import { createAuthClient } from "better-auth/react";
import { getApiOrigin } from "../client-env";

export const authClient = createAuthClient({
  // Browser: live origin. SSR/build: VITE_API_URL / local default.
  baseURL: getApiOrigin(),
  basePath: "/api/auth",
  plugins: [adminClient(), firebaseAuthClientPlugin()],
});

/**
 * Prefer the server Auth inference. The Firebase client plugin ships an empty
 * `$InferServerPlugin`, which otherwise erases admin fields (e.g. `role`).
 */
export type BetterAuthSession = Auth["$Infer"]["Session"];
