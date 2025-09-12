# Expo Spatialite Module - Internals Documentation

## Overview

This document describes the implementation details, design choices, and key considerations for the Expo Spatialite module, which provides SpatiaLite-enabled SQLite database functionality for React Native/Expo applications.

## Architecture

### Core Components

1. **Native Module (Kotlin)**: `ExpoSpatialiteModule.kt`
2. **TypeScript Interface**: Module definitions and type safety
3. **React Provider**: `ExpoSpatialiteProvider` for context management
4. **Helper Functions**: Utility functions for common operations

## Key Design Decisions

### 1. Database Path Handling

**Choice**: Follow Expo's standard path resolution pattern
- Relative paths resolve to `FileSystem.documentDirectory/Spatialite/`
- Absolute paths used directly
- Memory databases handled with `:memory:` identifier

**Rationale**: 
- Consistency with Expo ecosystem
- Automatic directory creation and management
- Avoids permission issues with system directories

**Gotcha**: Never use root-level paths like `/test/app.db` - they're not accessible in Android's security model.

### 2. SpatiaLite Integration

**Choice**: Bundle SpatiaLite-enabled SQLite library
- Uses `org.spatialite.database.SQLiteDatabase` 
- No dynamic loading via `load_extension()`
- Automatic `InitSpatialMetaData()` for new databases

**Rationale**:
- Android doesn't support SQLite extension loading
- Compile-time integration is more reliable
- Automatic initialization improves developer experience

### 3. Asset Import Strategy

**Choice**: Dual approach for asset handling
- Direct file copying for Expo-downloaded assets
- AssetManager fallback for bundled assets
- Automatic backup/recovery for locale conflicts

**Rationale**:
- Expo stores assets in cache directories inaccessible via AssetManager
- Need to handle both bundled and downloaded assets
- Android locale conflicts can corrupt databases

## API Implementation Details

### Native Module Structure

```kotlin
class ExpoSpatialiteModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("ExpoSpatialite")
        Constants { /* Default paths */ }
        Function("getSpatialiteVersion") { /* Implementation */ }
        AsyncFunction("initDatabase") { /* Implementation */ }
        AsyncFunction("importAssetDatabaseAsync") { /* Implementation */ }
        AsyncFunction("executeQuery") { /* Implementation */ }
        AsyncFunction("executeStatement") { /* Implementation */ }
        AsyncFunction("executePragmaQuery") { /* Implementation */ }
        AsyncFunction("closeDatabase") { /* Implementation */ }
    }
}
```

### Statement Type Classification

SQL statements are categorized to ensure proper execution method:
- **QUERY**: `SELECT`, `WITH` - returns data via `rawQuery()`
- **MODIFY**: `INSERT`, `UPDATE`, `DELETE` - no return via `execSQL()`
- **PRAGMA_SET**: `PRAGMA name=value` - no return via `execSQL()`
- **OTHER**: `CREATE`, `DROP`, etc. - no return via `execSQL()`

## Error Handling & Recovery

### Locale Conflict Recovery

**Problem**: Android SQLite tries to set locale-specific collators that conflict with SpatiaLite databases.

**Solution**: 
1. Detect locale conflicts during database opening
2. Automatically backup problematic database
3. Delete and recreate database
4. Use `NO_LOCALIZED_COLLATORS` flag to prevent future issues

```kotlin
val openFlags = SQLiteDatabase.OPEN_READWRITE or 
               SQLiteDatabase.CREATE_IF_NECESSARY or
               SQLiteDatabase.NO_LOCALIZED_COLLATORS
```

### File System Handling

**Problem**: Directory creation failures and file access issues.

**Solution**:
1. Recursive directory creation with `mkdirs()`
2. Proper error checking and fallbacks
3. Clear logging for debugging

## TypeScript API

### Core Types

```typescript
interface QueryResult<T> {
  success: boolean;
  rowCount: number;
  data: T[];
}

interface StatementResult {
  success: boolean;
  rowsAffected: number;
}

interface InitResult {
  success: boolean;
  path: string;
  spatialiteVersion: string;
}
```

### Provider Pattern

```tsx
<ExpoSpatialiteProvider 
  databaseName="app.db"
  assetSource={{
    assetId: require("../assets/database.db"),
    forceOverwrite: true
  }}
  onInit={async ({ executeStatement }) => {
    // Database migrations/setup
  }}
>
  <App />
</ExpoSpatialiteProvider>
```

## Usage Examples

### Basic Database Operations

```typescript
// Initialize database
const { executeQuery, executeStatement } = useExpoSpatialiteContext();

// Query with typed results
interface User {
  id: number;
  name: string;
  location: string; // Geometry column
}

const users = await executeQuery<User>(
  "SELECT id, name, AsText(location) as location FROM users WHERE id = ?",
  [123]
);

// Insert spatial data
await executeStatement(
  "INSERT INTO users (name, location) VALUES (?, GeomFromText(?, 4326))",
  ["John", "POINT(-122.4194 37.7749)"]
);

// PRAGMA operations
const journalMode = await executePragmaQuery<{journal_mode: string}>(
  "PRAGMA journal_mode"
);
```

### Asset Import

```typescript
// Import bundled database
<ExpoSpatialiteProvider
  databaseName="preloaded.db"
  assetSource={{
    assetId: require("../assets/preloaded-database.db"),
    forceOverwrite: false
  }}
>
  <App />
</ExpoSpatialiteProvider>
```

## Gotchas & Troubleshooting

### 1. File Path Issues
- ❌ Never use absolute system paths like `/test/db.db`
- ✅ Use relative paths or `FileSystem.documentDirectory`
- ✅ Let the module handle path resolution

### 2. Asset Access Problems
- ❌ Don't pass raw asset paths to native module
- ✅ Use `importDatabaseFromAssetAsync()` helper
- ✅ Ensure assets are downloaded with `Asset.downloadAsync()`

### 3. Locale Conflicts
- ✅ Module automatically handles recovery
- ✅ Always use `NO_LOCALIZED_COLLATORS` flag
- ✅ Check logs for backup file locations

### 4. Suspense Integration
- ✅ Provider supports Suspense mode
- ✅ Use with error boundaries for robust error handling
- ✅ Proper loading state management

## Performance Considerations

### 1. Memory Databases
- Fastest option for temporary data
- No file I/O overhead
- Lost when app closes

### 2. File-based Databases
- Persistent storage
- Automatic directory management
- Locale conflict recovery adds slight overhead

### 3. Large Dataset Handling
- Use parameterized queries to prevent SQL injection
- Consider pagination for large result sets
- PRAGMA settings can optimize performance

## Security Notes

### 1. File System Access
- All databases stored in app's private directory
- No access to system or other app directories
- Cache files properly managed

### 2. SQL Injection Prevention
- Always use parameterized queries
- Never concatenate user input directly into SQL
- Module validates statement types to prevent misuse

## Future Improvements

### 1. Enhanced Spatial Operations
- Add geometry validation functions
- Spatial index optimization helpers
- Coordinate system transformation utilities

### 2. Performance Monitoring
- Query execution time tracking
- Database size monitoring
- Connection pooling for high-concurrency scenarios

### 3. Advanced Features
- Database encryption support
- Multi-database management
- Backup/restore functionality

## Dependencies

- `org.spatialite:spatialite-android` - SpatiaLite-enabled SQLite
- `expo-file-system` - Path management
- `expo-asset` - Asset handling
- React Native core modules

This documentation provides a comprehensive overview of the Expo Spatialite module's internal workings, helping developers understand the implementation choices and use the module effectively.
