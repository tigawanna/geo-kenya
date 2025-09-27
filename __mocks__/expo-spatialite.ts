import type {
  QueryResult,
  StatementResult,
  PragmaQueryResult,
  SmartInitDatabaseResult,
  ResetDatabaseResult,
  CloseDatabaseResult,
  SpatialiteParam,
} from '../modules/expo-spatialite/src/ExpoSpatialiteModule';

export const createDatabasePath = jest.fn((databaseName: string, directory?: string): string => {
  return `/mock/path/${directory || 'Spatialite'}/${databaseName}`;
});

export const executeQuery = jest.fn(async <T extends Record<string, any>>(
  sql: string,
  params?: SpatialiteParam[]
): Promise<QueryResult<T>> => ({
  success: true,
  rowCount: 0,
  data: [] as T[],
}));

export const executeStatement = jest.fn(async (): Promise<StatementResult> => ({
  success: true,
  rowsAffected: 1,
}));

export const executePragmaQuery = jest.fn(async <T extends Record<string, any>>(): Promise<PragmaQueryResult<T>> => ({
  success: true,
  data: [] as T[],
}));

export const executeRawQuery = jest.fn(async <T extends Record<string, any>>(
  sql: string,
  params?: SpatialiteParam[]
): Promise<QueryResult<T>> => ({
  success: true,
  rowCount: 0,
  data: [] as T[],
}));

export const smartInitDatabase = jest.fn(async (): Promise<SmartInitDatabaseResult> => ({
  success: true,
  path: '/mock/path/database.db',
  spatialiteVersion: '5.0.1',
  imported: true,
  tableExists: true,
}));

export const resetDatabase = jest.fn(async (): Promise<ResetDatabaseResult> => ({
  success: true,
  path: '/mock/path/database.db',
  spatialiteVersion: '5.0.1',
  imported: true,
  message: 'Database reset successfully',
}));

export const closeDatabase = jest.fn(async (): Promise<CloseDatabaseResult> => ({
  success: true,
  message: 'Database closed successfully',
}));

export const ExpoSpatialiteDrizzle = {
  query: jest.fn(),
  run: jest.fn(),
  all: jest.fn(),
  get: jest.fn(),
  values: jest.fn(),
};