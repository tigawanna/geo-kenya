import { defineConfig } from "nitro";
import evlog from "evlog/nitro/v3";

export default defineConfig({
  experimental: {
    asyncContext: true,
  },
  modules: [
    evlog({
      env: { service: "geo-kenya" },
      exclude: ["/_build/**", "/assets/**"],
    }),
  ],
});
