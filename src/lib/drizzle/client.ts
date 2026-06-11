import * as schema from "@/lib/drizzle/schema";
import { getOpsqliteDb, reopenOpsqliteDb } from "@/lib/op-sqlite/client";
import type { Scalar } from "@op-engineering/op-sqlite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/op-sqlite";

const drizzleConfig = {
  logger: __DEV__,
  schema,
} as const;

function createDrizzle() {
  return drizzle(getOpsqliteDb(), drizzleConfig);
}

let drizzleDb = createDrizzle();

export type DrizzleDB = ReturnType<typeof createDrizzle>;

export const db: DrizzleDB = new Proxy({} as DrizzleDB, {
  get(_target, prop) {
    const value = Reflect.get(drizzleDb, prop, drizzleDb);
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(drizzleDb);
    }
    return value;
  },
});

let spatialMetadataReady = false;

export function resetLocalDatabase(): void {
  spatialMetadataReady = false;
  try {
    getOpsqliteDb().delete();
  } catch {
    // Database file may already be removed.
  }
  reopenOpsqliteDb();
  drizzleDb = createDrizzle();
}

export async function ensureSpatialMetadata(): Promise<void> {
  if (spatialMetadataReady) {
    return;
  }
  await db.run(sql`SELECT InitSpatialMetaData(1)`);
  spatialMetadataReady = true;
}

export function executeQuerySync<T extends object>(query: string, params?: Scalar[]): T[] {
  const connection = getOpsqliteDb();
  const result = params ? connection.executeSync(query, params) : connection.executeSync(query);
  return (result.rows ?? []) as T[];
}
