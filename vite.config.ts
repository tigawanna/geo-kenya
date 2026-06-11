import { defineConfig } from "vite-plus";

const ignoredPaths = ["**/routeTree.gen.ts", "apps/mobile/**", "packages/ui/**"];

export default defineConfig({
  fmt: {
    ignorePatterns: ignoredPaths,
    sortTailwindcss: {
      stylesheet: "apps/web/src/styles.css",
      functions: ["cn", "clsx", "cva"],
    },
  },
  staged: {
    "apps/web/**": "vp check --fix",
    "packages/**": "vp check --fix",
    "*.{ts,json}": "vp check --fix",
  },
  lint: {
    ignorePatterns: ignoredPaths,
    options: { typeAware: true, typeCheck: true },
  },
});
