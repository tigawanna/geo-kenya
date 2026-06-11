import * as schema from "@/lib/drizzle/schema";
import { opsqliteDb } from "@/lib/op-sqlite/client";
import type { Scalar } from "@op-engineering/op-sqlite";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/op-sqlite";
import { discardRegisteredGeometryColumns } from "./spatial-setup";

export const db = drizzle(opsqliteDb, {
  logger: __DEV__,
  schema,
});

export type DrizzleDB = typeof db;

let spatialMetadataReady = false;

export function resetLocalDatabase(): void {
  spatialMetadataReady = false;
  opsqliteDb.delete();
}

export async function ensureSpatialMetadata(): Promise<void> {
  if (spatialMetadataReady) {
    return;
  }
  await db.run(sql`SELECT InitSpatialMetaData(1)`);
  discardRegisteredGeometryColumns(opsqliteDb);
  spatialMetadataReady = true;
}

export function executeQuerySync<T extends object>(query: string, params?: Scalar[]): T[] {
  const result = params ? opsqliteDb.executeSync(query, params) : opsqliteDb.executeSync(query);
  return (result.rows ?? []) as T[];
}
