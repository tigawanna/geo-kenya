import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { clientEnv } from "../client-env";

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_API_URL,
  basePath: "/api/auth",
  plugins: [adminClient()],
});

export type BetterAuthSession = typeof authClient.$Infer.Session;
