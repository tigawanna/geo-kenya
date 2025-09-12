import { NativeModule, requireNativeModule } from "expo";

export type SpatialiteRow = { [key: string]: any };
export type SpatialiteParam = string | number | boolean | null;

export type QueryResult<T extends SpatialiteRow = SpatialiteRow> = {
  success: boolean;
  rowCount: number;
  data: T[];
};

export type StatementResult = {
  success: boolean;
  rowsAffected: number;
};

export type InitDatabaseResult = {
  success: boolean;
  path: string | null;
  spatialiteVersion: string;
};

export type ImportAssetDatabaseResult = {
  success: boolean;
  message: string;
  path?: string;
};

export type CloseDatabaseResult = {
  success: boolean;
  message: string;
};

export type TestFileHandlingResult = {
  success: boolean;
  lines?: string[];
  fileCreated?: boolean;
  error?: string;
};

export type PragmaQueryResult<T extends SpatialiteRow = SpatialiteRow> = {
  success: boolean;
  data: T[];
};



export type TransactionStatement = {
  sql: string;
  params?: SpatialiteParam[];
  method?: 'run' | 'get' | 'all' | 'values';
};

export type TransactionResult = {
  success: boolean;
  data?: any;
  rowsAffected?: number;
  rowCount?: number;
  totalRowsAffected?: number;
  results?: TransactionResult[];
};



declare class ExpoSpatialiteModule extends NativeModule {
  getSpatialiteVersion(): string;

  importAssetDatabaseAsync(
    databasePath: string,
    assetDatabasePath: string,
    forceOverwrite: boolean
  ): Promise<ImportAssetDatabaseResult>;

  initDatabase(databasePath: string): Promise<InitDatabaseResult>;

  executeQuery<T extends SpatialiteRow = SpatialiteRow>(
    sql: string,
    params?: SpatialiteParam[]
  ): Promise<QueryResult<T>>;

  executeStatement(sql: string, params?: SpatialiteParam[]): Promise<StatementResult>;

  executePragmaQuery<T extends SpatialiteRow = SpatialiteRow>(
    pragma: string
  ): Promise<PragmaQueryResult<T>>;

  executeRawQuery<T extends SpatialiteRow = SpatialiteRow>(
    sql: string,
    params?: SpatialiteParam[]
  ): Promise<QueryResult<T>>;

  closeDatabase(): Promise<CloseDatabaseResult>;

  testFileHandling(filePath: string): Promise<TestFileHandlingResult>;

  executeTransaction(statements: TransactionStatement[], useTransaction?: boolean): Promise<TransactionResult[]>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoSpatialiteModule>("ExpoSpatialite");


