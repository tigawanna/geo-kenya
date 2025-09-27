import type {
  QueryResult,
  StatementResult,
  InitDatabaseResult,
  ImportAssetDatabaseResult,
  CloseDatabaseResult,
  TestFileHandlingResult,
  PragmaQueryResult,
  TransactionResult,
  SmartInitDatabaseResult,
  ResetDatabaseResult,
  SpatialiteParam,
  TransactionStatement,
} from '../modules/expo-spatialite/src/ExpoSpatialiteModule';

const mockDatabase = new Map<string, any[]>();

const ExpoSpatialiteModule = {
  getSpatialiteVersion: jest.fn(() => '5.0.1'),

  importAssetDatabaseAsync: jest.fn(async (): Promise<ImportAssetDatabaseResult> => ({
    success: true,
    message: 'Database imported successfully',
    path: '/mock/path/database.db',
  })),

  initDatabase: jest.fn(async (): Promise<InitDatabaseResult> => ({
    success: true,
    path: '/mock/path/database.db',
    spatialiteVersion: '5.0.1',
  })),

  executeQuery: jest.fn(async <T extends Record<string, any>>(
    sql: string,
    params?: SpatialiteParam[]
  ): Promise<QueryResult<T>> => ({
    success: true,
    rowCount: 0,
    data: [] as T[],
  })),

  executeStatement: jest.fn(async (): Promise<StatementResult> => ({
    success: true,
    rowsAffected: 1,
  })),

  executePragmaQuery: jest.fn(async <T extends Record<string, any>>(): Promise<PragmaQueryResult<T>> => ({
    success: true,
    data: [] as T[],
  })),

  executeRawQuery: jest.fn(async <T extends Record<string, any>>(
    sql: string,
    params?: SpatialiteParam[]
  ): Promise<QueryResult<T>> => ({
    success: true,
    rowCount: 0,
    data: [] as T[],
  })),

  closeDatabase: jest.fn(async (): Promise<CloseDatabaseResult> => ({
    success: true,
    message: 'Database closed successfully',
  })),

  testFileHandling: jest.fn(async (): Promise<TestFileHandlingResult> => ({
    success: true,
    fileCreated: true,
    lines: ['test line 1', 'test line 2'],
  })),

  executeTransaction: jest.fn(async (): Promise<TransactionResult[]> => ([
    {
      success: true,
      rowsAffected: 1,
      totalRowsAffected: 1,
    },
  ])),

  smartInitDatabase: jest.fn(async (): Promise<SmartInitDatabaseResult> => ({
    success: true,
    path: '/mock/path/database.db',
    spatialiteVersion: '5.0.1',
    imported: true,
    tableExists: true,
  })),

  resetDatabase: jest.fn(async (): Promise<ResetDatabaseResult> => ({
    success: true,
    path: '/mock/path/database.db',
    spatialiteVersion: '5.0.1',
    imported: true,
    message: 'Database reset successfully',
  })),
};

export default ExpoSpatialiteModule;