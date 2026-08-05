import { z } from "zod";

const clientEnvSchema = z.object({
  VITE_API_URL: z.url().optional(),
});

const parsed = clientEnvSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL || undefined,
});

/**
 * API origin for auth/API calls.
 * In the browser we always use the current origin so production never
 * accidentally calls a bake-time localhost URL from `VITE_API_URL`.
 * SSR / build falls back to `VITE_API_URL` (local default).
 */
export function getApiOrigin(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (parsed.VITE_API_URL) {
    return parsed.VITE_API_URL;
  }
  console.warn(" \n\n  returning hardcoded localhost:0000", "\n");
  return "http://localhost:0000";
}

export const clientEnv = {
  get VITE_API_URL() {
    return getApiOrigin();
  },
};
