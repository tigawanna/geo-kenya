import { cloudflare } from "@cloudflare/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import evlog from "evlog/vite";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: { "*": "vp check --fix" },
  server: {
    host: "::",
  },
  ssr: {
    optimizeDeps: {
      exclude: ["better-auth"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    evlog({ service: "geo-kenya" }),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: {
          build: "mock",
        },
      },
      router: {
        routeToken: "layout",
      },
    }),
    viteReact(),
  ],
});
