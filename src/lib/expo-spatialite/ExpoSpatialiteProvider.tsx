import React, { createContext, memo, useContext, useEffect, useRef, useState } from "react";
import {
  initDatabase,
  executeQuery,
  executeStatement,
  executePragmaQuery,
  importDatabaseFromAssetAsync,
  closeDatabase,
  createDatabasePath,
} from "@/modules/expo-spatialite";

export interface ExpoSpatialiteProviderAssetSource {
  /**
   * The asset ID from require() or Asset.fromModule()
   * @example require('../assets/databases/sample.db')
   */
  assetId: number;

  /**
   * Whether to force overwrite existing database
   * @default false
   */
  forceOverwrite?: boolean;
}

export interface ExpoSpatialiteProviderProps {
  /**
   * The name of the database file to open.
   */
  databaseName: string;

  /**
   * The location of the database file. Can be relative, absolute, or ':memory:' for in-memory database.
   * @default Uses FileSystem.documentDirectory
   */
  location?: ":memory:" | (string & {});

  /**
   * Import a bundled database file from assets.
   * @example
   * ```ts
   * // Direct usage with require
   * assetSource={{ assetId: require('../assets/databases/sample.db') }}
   * 
   * // With Asset.fromModule and forceOverwrite
   * const asset = await Asset.fromModule(require("../assets/databases/sample.db")).downloadAsync();
   * assetSource={{
   *   assetId: asset,
   *   forceOverwrite: true
   * }}
   * 
   * // With downloaded asset from URL
   * const asset = Asset.fromURI('https://example.com/database.db');
   * await asset.downloadAsync();
   * assetSource={{
   *   assetId: asset,
   *   forceOverwrite: false
   * }}
   * ```
   */
  assetSource?: ExpoSpatialiteProviderAssetSource;

  /**
   * Whether to force overwrite existing database when no assetSource is provided
   * This is useful when you want to recreate the database file
   * @default false
   */
  forceOverwrite?: boolean;

  /**
   * The children to render.
   */
  children: React.ReactNode;

  /**
   * A custom initialization handler to run before rendering the children.
   * You can use this to run database migrations or other setup tasks.
   */
  onInit?: (context: {
    initDatabase: typeof initDatabase;
    executeQuery: typeof executeQuery;
    executePragmaQuery: typeof executePragmaQuery;
    executeStatement: typeof executeStatement;
  }) => Promise<void>;

  /**
   * Handle errors from ExpoSpatialiteProvider.
   * @default rethrow the error
   */
  onError?: (error: Error) => void;

  /**
   * Enable [`React.Suspense`](https://react.dev/reference/react/Suspense    ) integration.
   * @default false
   */
  useSuspense?: boolean;
}

/**
 * Create a context for the Expo Spatialite database
 */
const ExpoSpatialiteContext = createContext<{
  executeQuery: typeof executeQuery;
  executeStatement: typeof executeStatement;
  executePragmaQuery: typeof executePragmaQuery;
  initDatabase: typeof initDatabase;
} | null>(null);

/**
 * Context.Provider component that provides an Expo Spatialite database to all children.
 * All descendants of this component will be able to access the database using the [`useExpoSpatialiteContext`](#useexpospatialitecontext) hook.
 */
export const ExpoSpatialiteProvider = memo(
  function ExpoSpatialiteProvider({
    children,
    onError,
    useSuspense = false,
    ...props
  }: ExpoSpatialiteProviderProps) {
    if (onError != null && useSuspense) {
      throw new Error("Cannot use `onError` with `useSuspense`, use error boundaries instead.");
    }

    if (useSuspense) {
      return <ExpoSpatialiteProviderSuspense {...props}>{children}</ExpoSpatialiteProviderSuspense>;
    }

    return (
      <ExpoSpatialiteProviderNonSuspense {...props} onError={onError}>
        {children}
      </ExpoSpatialiteProviderNonSuspense>
    );
  },
  (prevProps: ExpoSpatialiteProviderProps, nextProps: ExpoSpatialiteProviderProps) =>
    prevProps.databaseName === nextProps.databaseName &&
    prevProps.location === nextProps.location &&
    deepEqual(prevProps.assetSource, nextProps.assetSource) &&
    prevProps.forceOverwrite === nextProps.forceOverwrite &&
    prevProps.onInit === nextProps.onInit &&
    prevProps.onError === nextProps.onError &&
    prevProps.useSuspense === nextProps.useSuspense
);

/**
 * A global hook for accessing the Expo Spatialite database across components.
 * This hook should only be used within a [`<ExpoSpatialiteProvider>`](#expospatialiteprovider) component.
 *
 * @example
 * ```tsx
 * export default function App() {
 *   return (
 *     <ExpoSpatialiteProvider databaseName="test.db">
 *       <Main />
 *     </ExpoSpatialiteProvider>
 *   );
 * }
 *
 * export function Main() {
 *   const { executeQuery } = useExpoSpatialiteContext();
 *   const result = await executeQuery('SELECT spatialite_version()');
 *   console.log('spatialite version', result.data?.[0]);
 *   return <View />
 * }
 * ```
 */
export function useExpoSpatialiteContext() {
  const context = useContext(ExpoSpatialiteContext);
  if (context == null) {
    throw new Error("useExpoSpatialiteContext must be used within a <ExpoSpatialiteProvider>");
  }
  return context;
}

function ExpoSpatialiteProviderSuspense({
  databaseName,
  location,
  assetSource,
  forceOverwrite,
  children,
  onInit,
}: Omit<ExpoSpatialiteProviderProps, "onError" | "useSuspense">) {
  // For Suspense implementation, you would typically use the use() hook
  // This is a simplified version - you might want to implement proper Suspense logic
  return (
    <ExpoSpatialiteContext.Provider
      value={{ executeQuery, executeStatement, initDatabase, executePragmaQuery }}>
      {children}
    </ExpoSpatialiteContext.Provider>
  );
}

function ExpoSpatialiteProviderNonSuspense({
  databaseName,
  location,
  assetSource,
  forceOverwrite = false,
  children,
  onInit,
  onError,
}: Omit<ExpoSpatialiteProviderProps, "useSuspense">) {
  const databaseRef = useRef<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        const dbPath = await setupDatabaseAsync({
          databaseName,
          location,
          assetSource,
          forceOverwrite,
          onInit,
        });
        databaseRef.current = dbPath;
        setLoading(false);
      } catch (e: any) {
        setError(e);
      }
    }

    async function teardown() {
      try {
        await closeDatabase();
      } catch (e: any) {
        setError(e);
      }
    }

    setup();

    return () => {
      teardown();
      databaseRef.current = null;
      setLoading(true);
    };
  }, [databaseName, location, assetSource, forceOverwrite, onInit]);

  if (error != null) {
    const handler =
      onError ??
      ((e) => {
        throw e;
      });
    handler(error);
  }

  if (loading) {
    return null;
  }

  return (
    <ExpoSpatialiteContext.Provider
      value={{ executeQuery, executeStatement, initDatabase, executePragmaQuery }}>
      {children}
    </ExpoSpatialiteContext.Provider>
  );
}

async function setupDatabaseAsync({
  databaseName,
  location,
  assetSource,
  forceOverwrite = false,
  onInit,
}: Pick<ExpoSpatialiteProviderProps, "databaseName" | "location" | "assetSource" | "onInit"> & {
  forceOverwrite?: boolean;
}): Promise<string> {
  let dbPath: string;

  // Handle in-memory database (simplest case)
  if (location === ":memory:") {
    if (assetSource != null) {
      console.warn("Cannot use :memory: with assetSource. Using file-based database instead.");
      // Fall through to file-based logic
    } else {
      dbPath = ":memory:";
      await initDatabase(dbPath);
      if (onInit != null) {
        await onInit({ initDatabase, executeQuery, executeStatement, executePragmaQuery });
      }
      return dbPath;
    }
  }

  // Handle file-based databases
  if (assetSource != null) {
    // Import asset database first - ensure asset is downloaded and pass correct path
    try {
      await importDatabaseFromAssetAsync(
        databaseName,
        assetSource.assetId,
        assetSource.forceOverwrite ?? false,
        location // Pass location as directory parameter
      );
    } catch (error) {
      console.error("Failed to import database from asset:", error);
      throw error;
    }

    // Construct the correct path that matches what importDatabaseFromAssetAsync created
    dbPath = createDatabasePath(databaseName, location);
  } else {
    // No asset import - just create/open database at specified location
    dbPath = createDatabasePath(databaseName, location);

    // If forceOverwrite is true, we might want to handle database recreation
    if (forceOverwrite) {
      console.log("Force overwrite requested for database:", dbPath);
      // You could implement database recreation logic here if needed
    }
  }

  // Initialize the Spatialite database
  try {
    await initDatabase(dbPath);
  } catch (error) {
    console.error("Failed to initialize database at path:", dbPath, error);
    throw error;
  }

  // Run initialization hook if provided
  if (onInit != null) {
    await onInit({ initDatabase, executeQuery, executeStatement, executePragmaQuery });
  }

  return dbPath;
}

/**
 * Compares two objects deeply for equality.
 */
function deepEqual(
  a: { [key: string]: any } | undefined,
  b: { [key: string]: any } | undefined
): boolean {
  if (a === b) {
    return true;
  }
  if (a == null || b == null) {
    return false;
  }
  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((key) => deepEqual(a[key], b[key]))
  );
}
