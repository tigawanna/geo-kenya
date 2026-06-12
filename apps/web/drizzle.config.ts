import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/drizzle/schema",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/3dd27f64a8e6b7092b4dc42ea2a5f93d01d65d27a0f4927b2e4bc344a6a2f6f6.sqlite",
  },
});
