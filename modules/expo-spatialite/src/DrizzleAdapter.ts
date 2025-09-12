import type { SpatialiteParam, TransactionStatement } from "./ExpoSpatialiteModule";
import ExpoSpatialiteModule from "./ExpoSpatialiteModule";

export type Sqlite3Method = "run" | "get" | "all" | "values";

export type RawResultData = {
  rows: any[];
  columns: string[];
};

export class ExpoSpatialiteDrizzle {
  async exec(
    sql: string,
    params: SpatialiteParam[] = [],
    method: Sqlite3Method = "all"
  ): Promise<RawResultData> {
    // console.log("exec called with sql:", sql);
    // console.log("exec called with params:", JSON.stringify(params, null, 2));
    // console.log("exec called with method:", method);

    switch (method) {
      case "run":
        await ExpoSpatialiteModule.executeStatement(sql, params);
        return { rows: [], columns: [] };

      case "get":
        const getResult = await ExpoSpatialiteModule.executeQuery(sql, params);
        const getColumns = Object.keys(getResult.data[0]);
        const getRows = Object.values(getResult.data[0]);
        return { rows: getRows, columns: getColumns };

      case "all":
      case "values":
      default:
        const allResult = await ExpoSpatialiteModule.executeQuery(sql, params);
        const allRows = allResult.data.map((row: { [key: string]: any }) => Object.values(row));
        const allColumns = Object.keys(allResult.data[0]);
        const result = { rows: allRows, columns: allColumns };
        return result;
    }
  }

  async execBatch(
    queries: { sql: string; params: SpatialiteParam[]; method: Sqlite3Method }[]
  ): Promise<RawResultData[]> {
    const statements: TransactionStatement[] = queries.map((q) => ({
      sql: q.sql,
      params: q.params,
      method: q.method,
    }));

    const results = await ExpoSpatialiteModule.executeTransaction(statements, false);
    return results.map((result) => {
      const rows = result.data ? (Array.isArray(result.data) ? result.data : [result.data]) : [];
      const columns =
        rows.length > 0 && typeof rows[0] === "object"
          ? Object.keys(rows[0])
          : [];
      return { rows, columns };
    });
  }

  // Drizzle driver interface - must be arrow function to preserve 'this'
  driver = async (
    sql: string,
    params: any[],
    method: "run" | "all" | "values" | "get"
  ): Promise<{ rows: any[] }> => {
    const result = await this.exec(sql, params as SpatialiteParam[], method as Sqlite3Method);
    // console.log("returning", JSON.stringify(result, null, 2));
    return result;
  };

  // Drizzle batch driver interface - must be arrow function to preserve 'this'
  batchDriver = async (
    queries: { sql: string; params: any[]; method: "run" | "all" | "values" | "get" }[]
  ): Promise<{ rows: any[] }[]> => {
    const results = await this.execBatch(
      queries.map((q) => ({
        sql: q.sql,
        params: q.params as SpatialiteParam[],
        method: q.method as Sqlite3Method,
      }))
    );
    return results.map((result) => ({ rows: result.rows }));
  };

  // Transaction method for proper isolation
  async transaction<T>(fn: (tx: ExpoSpatialiteDrizzle) => Promise<T>): Promise<T> {
    await ExpoSpatialiteModule.executeStatement("BEGIN");
    try {
      const result = await fn(this);
      await ExpoSpatialiteModule.executeStatement("COMMIT");
      return result;
    } catch (error) {
      await ExpoSpatialiteModule.executeStatement("ROLLBACK");
      throw error;
    }
  }
}
