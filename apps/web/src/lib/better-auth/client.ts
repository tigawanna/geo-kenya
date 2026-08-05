import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { getApiOrigin } from "../client-env";

export const authClient = createAuthClient({
  // Browser: live origin. SSR/build: VITE_API_URL / local default.
  baseURL: getApiOrigin(),
  basePath: "/api/auth",
  plugins: [adminClient()],
});

export type BetterAuthSession = typeof authClient.$Infer.Session;
