import type { DrainContext } from "evlog";

type EvlogDrain = (ctx: DrainContext | DrainContext[]) => Promise<void>;

let drain: EvlogDrain | undefined;

function isCloudflareWorker(): boolean {
  return typeof caches !== "undefined";
}

export function createEvlogFsDrain(): ((ctx: DrainContext) => Promise<void>) | undefined {
  if (!import.meta.env.DEV) {
    return undefined;
  }

  return async (ctx) => {
    if (!drain) {
      if (isCloudflareWorker()) {
        const { createMemoryDrain } = await import("evlog/memory");
        drain = createMemoryDrain({ maxEvents: 1000 });
      } else {
        const { createFsDrain } = await import("evlog/fs");
        drain = createFsDrain({ maxFiles: 7 });
      }
    }

    await drain(ctx);
  };
}
