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
      exclude: ["better-auth", "firebase-admin"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Plugin imports firebase-admin, but Workers only need verifyIdToken (jose).
      // Stub the Admin SDK so it never gets bundled into the worker.
      "firebase-admin/auth": fileURLToPath(
        new URL("./src/lib/firebase/firebase-admin-stub.ts", import.meta.url),
      ),
      "firebase-admin/app": fileURLToPath(
        new URL("./src/lib/firebase/firebase-admin-stub.ts", import.meta.url),
      ),
      "firebase-admin": fileURLToPath(
        new URL("./src/lib/firebase/firebase-admin-stub.ts", import.meta.url),
      ),
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
      // Prerender public marketing pages to static HTML at build time
      // (served as Cloudflare assets). Auth/dashboard stay SSR.
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        failOnError: true,
        concurrency: 4,
        retryCount: 2,
        retryDelay: 1000,
      },
      pages: [
        { path: "/", prerender: { enabled: true } },
        { path: "/privacy", prerender: { enabled: true } },
        { path: "/terms", prerender: { enabled: true } },
        // DEV-only route until account dashboard ships — skip prerender
        // { path: "/data-deletion", prerender: { enabled: true } },
      ],
    }),
    viteReact(),
  ],
});
