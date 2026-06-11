import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/drizzle/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "expo",
});
