import { logger } from "@/utils/logger";
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
    try {
      const sqlInput = sql.toLowerCase();
      if (sqlInput.includes("pragma")) {
        const result = await ExpoSpatialiteModule.executePragmaQuery(sql);
        return { rows: result.data, columns: Object.keys(result?.data?.[0]) };
      }

      if (
        sqlInput.startsWith("update") ||
        sqlInput.startsWith("insert") ||
        sqlInput.startsWith("delete")
      ) {
        // logger.log(" sqlInput.includes(update) :: executeStatement");

        await ExpoSpatialiteModule.executeStatement(sql, params);
        return { rows: [], columns: [] };
      }

      switch (method) {
        case "run":
          // logger.log("RUN :: executeStatement");
          await ExpoSpatialiteModule.executeStatement(sql, params);
          return { rows: [], columns: [] };

        case "get":
          // logger.log("GET :: executeQuery");
          const getResult = await ExpoSpatialiteModule.executeQuery(sql, params);
          const sampleRow = getResult?.data?.[0];
          if(!sampleRow) return { rows: [], columns: [] };
          const getColumns = Object.keys(sampleRow);
          const getRows = Object.values(sampleRow);
          return { rows: getRows, columns: getColumns };

        case "all":
        case "values":
        default:
          // logger.log("DEAFULT :: executeQuery");
          const allResult = await ExpoSpatialiteModule.executeQuery(sql, params);
          const allRows = allResult.data.map((row: { [key: string]: any }) => Object.values(row));
          const sampleAllRow = allResult?.data?.[0];
          if(!sampleAllRow) return { rows: [], columns: [] };
          const allColumns = Object.keys(sampleAllRow);
          const result = { rows: allRows, columns: allColumns };
          return result;
      }
    } catch (error) {
      logger.error("❌ SQL Error in DrizzleAdapter:", {
        sql,
        params,
        method,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  async execBatch(
    queries: { sql: string; params: SpatialiteParam[]; method: Sqlite3Method }[]
  ): Promise<RawResultData[]> {
    try {
      const statements: TransactionStatement[] = queries.map((q) => ({
        sql: q.sql,
        params: q.params,
        method: q.method,
      }));

      const results = await ExpoSpatialiteModule.executeTransaction(statements, false);
      return results.map((result) => {
        const rows = result.data ? (Array.isArray(result.data) ? result.data : [result.data]) : [];
        const columns = rows.length > 0 && typeof rows[0] === "object" ? Object.keys(rows[0]) : [];
        return { rows, columns };
      });
    } catch (error) {
      logger.error("❌ Batch SQL Error in DrizzleAdapter:", {
        queries: queries.map(q => ({ sql: q.sql, params: q.params, method: q.method })),
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  // Drizzle driver interface - must be arrow function to preserve 'this'
  driver = async (
    sql: string,
    params: any[],
    method: "run" | "all" | "values" | "get"
  ): Promise<{ rows: any[] }> => {
    try {
      const result = await this.exec(sql, params as SpatialiteParam[], method as Sqlite3Method);
      return result;
    } catch (error) {
      logger.error("❌ Driver Error:", {
        sql,
        params,
        method,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  };

  // Drizzle batch driver interface - must be arrow function to preserve 'this'
  batchDriver = async (
    queries: { sql: string; params: any[]; method: "run" | "all" | "values" | "get" }[]
  ): Promise<{ rows: any[] }[]> => {
    try {
      const results = await this.execBatch(
        queries.map((q) => ({
          sql: q.sql,
          params: q.params as SpatialiteParam[],
          method: q.method as Sqlite3Method,
        }))
      );
      return results.map((result) => ({ rows: result.rows }));
    } catch (error) {
      logger.error("❌ Batch Driver Error:", {
        queries: queries.map(q => ({ sql: q.sql, params: q.params, method: q.method })),
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  };

  // Transaction method for proper isolation
  async transaction<T>(fn: (tx: ExpoSpatialiteDrizzle) => Promise<T>): Promise<T> {
    try {
      await ExpoSpatialiteModule.executeStatement("BEGIN");
      const result = await fn(this);
      await ExpoSpatialiteModule.executeStatement("COMMIT");
      return result;
    } catch (error) {
      try {
        await ExpoSpatialiteModule.executeStatement("ROLLBACK");
      } catch (rollbackError) {
        logger.error("❌ Transaction rollback failed:", rollbackError);
      }
      logger.error("❌ Transaction Error:", {
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
}
