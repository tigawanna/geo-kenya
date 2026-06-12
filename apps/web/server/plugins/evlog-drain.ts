import { definePlugin } from "nitro";

function isCloudflareWorker(): boolean {
  return typeof caches !== "undefined";
}

export default definePlugin(async (nitroApp) => {
  if (!import.meta.env.DEV) {
    return;
  }

  if (isCloudflareWorker()) {
    const { createMemoryDrain } = await import("evlog/memory");
    nitroApp.hooks.hook("evlog:drain", createMemoryDrain({ maxEvents: 1000 }));
    return;
  }

  const { createFsDrain } = await import("evlog/fs");
  nitroApp.hooks.hook(
    "evlog:drain",
    createFsDrain({
      maxFiles: 7,
    }),
  );
});
