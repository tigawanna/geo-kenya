# Expo Spatialite

A powerful geospatial database module for Expo applications that extends SQLite with Spatialite capabilities for advanced location-based queries and operations.

## Overview

Expo Spatialite brings the power of Spatialite to your Expo/React Native applications, enabling you to perform complex geospatial operations directly on the device. This module provides:

- Native Spatialite integration for Android
- High-performance geospatial queries
- Support for spatial data types (points, lines, polygons)
- Geospatial functions (distance calculations, spatial relationships, etc.)
- Asset database import capabilities
- Type-safe TypeScript API

## Installation

The module is already included in this project as a local Expo module. To use it in your own project:

```bash
# Navigate to your project root
npx expo install expo-asset expo-file-system

# Add the module to your project (copy the modules/expo-spatialite directory)
```

## API Reference

### Core Functions

#### `getSpatialiteVersion()`
Get the current Spatialite version.

```typescript
import { getSpatialiteVersion } from 'expo-spatialite';

const version = getSpatialiteVersion();
console.log('Spatialite version:', version);
```

#### `initDatabase(databasePath: string)`
Initialize a Spatialite database from a file path.

```typescript
import { initDatabase } from 'expo-spatialite';

const result = await initDatabase('/path/to/database.db');
if (result.success) {
  console.log('Database initialized successfully');
  console.log('Spatialite version:', result.spatialiteVersion);
}
```

#### `executeQuery(sql: string, params?: SpatialiteParam[])`
Execute a SQL query and return results.

```typescript
import { executeQuery } from 'expo-spatialite';

// Simple query
const result = await executeQuery('SELECT * FROM users LIMIT 10');
if (result.success) {
  console.log(`Found ${result.rowCount} rows`);
  console.log(result.data);
}

// Parameterized query
const result = await executeQuery(
  'SELECT * FROM users WHERE age > ? AND city = ?',
  [25, 'Nairobi']
);
```

#### `executeStatement(sql: string, params?: SpatialiteParam[])`
Execute a SQL statement (INSERT, UPDATE, DELETE) that doesn't return results.

```typescript
import { executeStatement } from 'expo-spatialite';

// Insert data
const result = await executeStatement(
  'INSERT INTO users (name, age, city) VALUES (?, ?, ?)',
  ['John Doe', 30, 'Nairobi']
);
if (result.success) {
  console.log(`Rows affected: ${result.rowsAffected}`);
}

// Update data
const result = await executeStatement(
  'UPDATE users SET age = ? WHERE name = ?',
  [31, 'John Doe']
);

// Delete data
const result = await executeStatement(
  'DELETE FROM users WHERE age < ?',
  [18]
);
```

#### `closeDatabase()`
Close the currently open database connection.

```typescript
import { closeDatabase } from 'expo-spatialite';

const result = await closeDatabase();
if (result.success) {
  console.log('Database closed successfully');
}
```

### Utility Functions

#### `createDatabasePath(databaseName: string, directory?: string)`
Create a database path in the document directory.

```typescript
import { createDatabasePath } from 'expo-spatialite';

// Create path in root document directory
const dbPath = createDatabasePath('myapp.db');

// Create path in subdirectory
const dbPath = createDatabasePath('myapp.db', 'databases');
```

#### `importDatabaseFromAssetAsync(databaseName: string, assetId: number, forceOverwrite?: boolean, directory?: string)`
Import a database from app assets to the device storage.

```typescript
import { importDatabaseFromAssetAsync } from 'expo-spatialite';

// Import database from assets
const result = await importDatabaseFromAssetAsync(
  'kenya_locations.db',
  require('../assets/databases/kenya_locations.db'),
  false // Don't overwrite if exists
);

if (result.success) {
  console.log('Database imported successfully');
  console.log('Path:', result.path);
}
```

#### `importAssetDatabaseAsync(databasePath: string, assetDatabasePath: string, forceOverwrite?: boolean)`
Import a database from a file path.

```typescript
import { importAssetDatabaseAsync } from 'expo-spatialite';

const result = await importAssetDatabaseAsync(
  '/path/to/local.db',
  '/path/to/asset.db',
  true // Force overwrite
);
```

## Geospatial Usage Examples

### Creating Spatial Tables

```typescript
import { executeStatement } from 'expo-spatialite';

// Create a table with spatial capabilities
await executeStatement(`
  CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT
  )
`);

// Add a geometry column
await executeStatement(`
  SELECT AddGeometryColumn('locations', 'geom', 4326, 'POINT', 'XY')
`);

// Create a spatial index for better performance
await executeStatement(`
  SELECT CreateSpatialIndex('locations', 'geom')
`);
```

### Inserting Spatial Data

```typescript
import { executeStatement } from 'expo-spatialite';

// Insert a point geometry (longitude, latitude)
await executeStatement(
  `INSERT INTO locations (name, description, geom) 
   VALUES (?, ?, MakePoint(?, ?, 4326))`,
  ['Nairobi', 'Capital city of Kenya', 36.8167, -1.2833]
);
```

### Spatial Queries

#### Find Points Within Radius

```typescript
import { executeQuery } from 'expo-spatialite';

// Find locations within 10km of a point
const result = await executeQuery(`
  SELECT id, name, description,
         ST_X(geom) as longitude,
         ST_Y(geom) as latitude,
         ST_Distance(geom, MakePoint(36.8167, -1.2833, 4326)) as distance
  FROM locations
  WHERE ST_Distance(geom, MakePoint(36.8167, -1.2833, 4326)) <= 10000
  ORDER BY distance
`);
```

#### Bounding Box Queries

```typescript
import { executeQuery } from 'expo-spatialite';

// Find locations within a bounding box
const result = await executeQuery(`
  SELECT id, name, description,
         ST_X(geom) as longitude,
         ST_Y(geom) as latitude
  FROM locations
  WHERE geom INTERSECTS BuildMBR(35.0, -2.0, 38.0, 0.0, 4326)
`);
```

#### Distance Calculations

```typescript
import { executeQuery } from 'expo-spatialite';

// Calculate distances between points
const result = await executeQuery(`
  SELECT l1.name as location1, l2.name as location2,
         ST_Distance(l1.geom, l2.geom) as distance_meters
  FROM locations l1, locations l2
  WHERE l1.id != l2.id
  ORDER BY distance_meters
  LIMIT 10
`);
```

## Complete Example

```typescript
import {
  initDatabase,
  createDatabasePath,
  importDatabaseFromAssetAsync,
  executeQuery,
  executeStatement,
  closeDatabase,
  getSpatialiteVersion
} from 'expo-spatialite';

async function example() {
  try {
    // Get Spatialite version
    const version = getSpatialiteVersion();
    console.log('Spatialite version:', version);
    
    // Create database path
    const dbPath = createDatabasePath('kenya_locations.db');
    
    // Import database from assets if it doesn't exist
    const importResult = await importDatabaseFromAssetAsync(
      'kenya_locations.db',
      require('../assets/databases/kenya_locations.db'),
      false
    );
    
    if (importResult.success) {
      console.log('Database imported successfully');
    }
    
    // Initialize database
    const initResult = await initDatabase(dbPath);
    if (initResult.success) {
      console.log('Database initialized');
      
      // Query locations near Nairobi (within 50km)
      const queryResult = await executeQuery(`
        SELECT id, name, description,
               ST_X(geom) as longitude,
               ST_Y(geom) as latitude,
               ST_Distance(geom, MakePoint(36.8167, -1.2833, 4326)) as distance
        FROM locations
        WHERE ST_Distance(geom, MakePoint(36.8167, -1.2833, 4326)) <= 50000
        ORDER BY distance
      `);
      
      if (queryResult.success) {
        console.log(`Found ${queryResult.rowCount} locations near Nairobi:`);
        queryResult.data.forEach(row => {
          console.log(`${row.name}: ${row.distance} meters away`);
        });
      }
      
      // Close database
      await closeDatabase();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## TypeScript Types

The module provides comprehensive TypeScript support with the following types:

- `SpatialiteParam`: Type for SQL parameters (string | number | boolean | null)
- `QueryResult`: Type for query results
- `StatementResult`: Type for statement execution results
- `InitDatabaseResult`: Type for database initialization results
- `ImportAssetDatabaseResult`: Type for database import results
- `CloseDatabaseResult`: Type for database closing results

## Performance Tips

1. **Use Spatial Indexes**: Always create spatial indexes on geometry columns for better query performance
2. **Batch Operations**: Use transactions for multiple related operations
3. **Parameterized Queries**: Always use parameterized queries to prevent SQL injection
4. **Connection Management**: Initialize the database once and reuse the connection
5. **Memory Management**: Close the database when done to free resources

## Limitations

- Currently only supports Android (iOS support planned)
- Web support requires additional configuration
- Large spatial datasets may impact performance on older devices

## Troubleshooting

### Common Issues

1. **Database not found**: Ensure the database path is correct and the file exists
2. **Spatialite extension not loaded**: Make sure to call `initDatabase` before executing spatial queries
3. **Permission errors**: Ensure your app has the necessary file system permissions

### Debugging

Enable verbose logging by checking the React Native console logs for detailed information about database operations and errors.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT