import { createAuth } from "@/server/create-auth";
import { env } from "cloudflare:workers";

export function getAuth() {
  return createAuth(env as CloudflareBindings);
}
