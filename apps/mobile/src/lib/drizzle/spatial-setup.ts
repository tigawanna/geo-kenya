import type { DB } from "@op-engineering/op-sqlite";

type CountRow = { c: number };

const GEOMETRY_COLUMNS = [{ table: "kenya_wards", column: "geom" }] as const;

function readCount(rawDb: DB, sql: string): number {
  const result = rawDb.executeSync(sql);
  const row = result.rows?.[0] as CountRow | undefined;
  return row?.c ?? 0;
}

function isGeometryColumnRegistered(rawDb: DB, table: string, column: string): boolean {
  return (
    readCount(
      rawDb,
      `SELECT COUNT(*) AS c FROM geometry_columns
       WHERE f_table_name = '${table}' AND f_geometry_column = '${column}';`,
    ) > 0
  );
}

export function discardRegisteredGeometryColumns(rawDb: DB): void {
  for (const { table, column } of GEOMETRY_COLUMNS) {
    if (!isGeometryColumnRegistered(rawDb, table, column)) {
      continue;
    }
    rawDb.executeSync(`SELECT DiscardGeometryColumn('${table}', '${column}');`);
  }
}
