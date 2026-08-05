import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";

/**
 * CLI-only auth config for `pnpm auth:generate`.
 * Keep plugins in sync with `src/server/create-auth.ts`.
 */
export const auth = betterAuth({
  database: drizzleAdapter({} as never, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});
