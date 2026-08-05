import { createAuthFromEnv } from "@/server/create-auth";
import { env } from "cloudflare:workers";

export function getAuth() {
  return createAuthFromEnv(env as CloudflareBindings);
}
