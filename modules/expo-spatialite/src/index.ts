import { Asset } from "expo-asset";
import { Directory, File, Paths } from "expo-file-system";
import ExpoSpatialiteModule from "./ExpoSpatialiteModule";



// Import types
import type {
  CloseDatabaseResult,
  ImportAssetDatabaseResult,
  InitDatabaseResult,
  PragmaQueryResult,
  QueryResult,
  ResetDatabaseResult,
  SmartInitDatabaseResult,
  SpatialiteParam,
  StatementResult,
} from "./ExpoSpatialiteModule";

// Re-export core types
export type {
  CloseDatabaseResult,
  ImportAssetDatabaseResult,
  InitDatabaseResult, PragmaQueryResult, QueryResult, ResetDatabaseResult, SmartInitDatabaseResult, SpatialiteParam,
  StatementResult
} from "./ExpoSpatialiteModule";



/**
 * Creates a database path in the document directory
 */

export function createDatabasePath(databaseName: string, directory?: string): string {
  try {
    let targetDir: Directory;

    // If directory is provided and absolute, create Directory from absolute path
    if (directory && (directory.startsWith("/") || directory.startsWith("file://"))) {
      const cleanPath = directory.replace("file://", "");
      targetDir = new Directory(cleanPath);
    } else {
      // If directory is relative or undefined, use default structure
      const dirPath = directory ? `Spatialite/${directory}` : "Spatialite";
      targetDir = new Directory(Paths.document, dirPath);
    }

    // Create the directory if it doesn't exist
    if (!targetDir.exists) {
      targetDir.create({ intermediates: true });
    }

    // Create a File instance for the database
    const databaseFile = new File(targetDir, databaseName);

    return databaseFile.uri;
  } catch (error) {
    console.error("Error creating database path:", error);
    throw new Error(`Failed to create database path: ${error instanceof Error ? error.message : String(error)}`);
  }
}



/**
 * Execute a SQL query and return results with generic type support
 * @param sql The SQL query to execute
 * @param params Optional parameters for the query
 * @returns Query result with rows of data
 */
export async function executeQuery<T extends Record<string, any> = Record<string, any>>(
  sql: string,
  params?: SpatialiteParam[]
): Promise<QueryResult<T>> {
  try {
    const result = await ExpoSpatialiteModule.executeQuery(sql, params);
    return {
      success: result.success,
      rowCount: result.rowCount,
      data: result.data as T[],
    };
  } catch (error) {
    console.error("❌ executeQuery Error:", {
      sql,
      params,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Execute a SQL statement that doesn't return results (INSERT, UPDATE, DELETE)
 * @param sql The SQL statement to execute
 * @param params Optional parameters for the statement
 * @returns Statement result with number of affected rows
 */
export async function executeStatement(
  sql: string,
  params?: SpatialiteParam[]
): Promise<StatementResult> {
  try {
    const result = await ExpoSpatialiteModule.executeStatement(sql, params);
    return {
      success: result.success,
      rowsAffected: result.rowsAffected,
    };
  } catch (error) {
    console.error("❌ executeStatement Error:", {
      sql,
      params,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Execute a PRAGMA query that returns results with generic type support
 * @param pragma The PRAGMA statement to execute
 * @returns PRAGMA query result with data
 */
export async function executePragmaQuery<T extends Record<string, any> = Record<string, any>>(
  pragma: string
): Promise<PragmaQueryResult<T>> {
  try {
    const result = await ExpoSpatialiteModule.executePragmaQuery(pragma);
    return {
      success: result.success,
      data: result.data as T[],
    };
  } catch (error) {
    console.error("❌ executePragmaQuery Error:", {
      pragma,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Execute a raw SQL query for absolute edge cases - bypasses all validation
 * Use this only when you need to execute complex queries that don't fit standard patterns
 * @param sql The raw SQL query to execute
 * @param params Optional parameters for the query
 * @returns Query result with rows of data
 */
export async function executeRawQuery<T extends Record<string, any> = Record<string, any>>(
  sql: string,
  params?: SpatialiteParam[]
): Promise<QueryResult<T>> {
  try {
    const result = await ExpoSpatialiteModule.executeRawQuery(sql, params);
    return {
      success: result.success,
      rowCount: result.rowCount,
      data: result.data as T[],
    };
  } catch (error) {
    console.error("❌ executeRawQuery Error:", {
      sql,
      params,
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Smart database initialization - only imports if database doesn't exist or lacks specified table
 * @param databasePath The path to the database file
 * @param assetDatabasePath Optional path to asset database to import
 * @param checkTableName Optional table name to check for existence
 * @param forceOverwrite Whether to force overwrite existing database
 * @returns Smart initialization result
 */
export async function smartInitDatabase(
  databasePath: string,
  assetDatabasePath?: string,
  checkTableName?: string,
  forceOverwrite: boolean = false
): Promise<SmartInitDatabaseResult> {
  const result = await ExpoSpatialiteModule.smartInitDatabase(
    databasePath,
    assetDatabasePath,
    checkTableName,
    forceOverwrite
  );

  return {
    success: result.success,
    path: result.path || "",
    spatialiteVersion: result.spatialiteVersion,
    imported: result.imported,
    tableExists: result.tableExists,
  };
}

/**
 * Reset database - deletes current database and imports from asset if available
 * @param databasePath The path to the database file
 * @param assetDatabasePath Optional path to asset database to import
 * @returns Reset result
 */
export async function resetDatabase(
  databasePath: string,
  assetDatabasePath?: string
): Promise<ResetDatabaseResult> {
  const result = await ExpoSpatialiteModule.resetDatabase(
    databasePath,
    assetDatabasePath
  );

  return {
    success: result.success,
    path: result.path || "",
    spatialiteVersion: result.spatialiteVersion,
    imported: result.imported,
    message: result.message,
  };
}

/**
 * Close the currently open database
 * @returns Close result with success status
 */
export async function closeDatabase(): Promise<CloseDatabaseResult> {
  const result = await ExpoSpatialiteModule.closeDatabase();

  return {
    success: result.success,
    message: result.message,
  };
}

// Export Drizzle adapter
export { ExpoSpatialiteDrizzle } from './DrizzleAdapter';
