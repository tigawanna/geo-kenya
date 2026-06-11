import { z } from "zod";

const clientEnvSchema = z.object({
  VITE_API_URL: z.url().default("http://localhost:3050"),
});

export const clientEnv = clientEnvSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});
