# ExpoSpatialiteProvider Usage Guide

The `ExpoSpatialiteProvider` is a React context provider that manages Spatialite database instances, ensuring the same database connection is shared across your entire app with full geospatial capabilities.

## Features

- ✅ **TypeScript support** - Full type safety with Spatialite functions
- ✅ **Context-based sharing** - Single database instance across your app
- ✅ **Asset database loading** - Import pre-populated Spatialite databases from app bundle
- ✅ **Geospatial operations** - Full Spatialite functionality for location-based queries
- ✅ **React Suspense integration** - Optional suspense support for loading states
- ✅ **Initialization hooks** - Run migrations and setup before app renders
- ✅ **Error handling** - Customizable error handling with fallbacks
- ✅ **Performance optimized** - Leverages native Spatialite performance features

## Basic Setup

```tsx
import { ExpoSpatialiteProvider, useExpoSpatialiteContext } from '@/lib/expo-spatialite/ExpoSpatialiteProvider';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <ExpoSpatialiteProvider databaseName="myapp.db">
      <MainApp />
    </ExpoSpatialiteProvider>
  );
}

function MainApp() {
  const { executeQuery } = useExpoSpatialiteContext();
  
  // Use the database
  const result = await executeQuery('SELECT spatialite_version()');
  console.log('Spatialite version:', result.data?.[0]);
  
  return <View />;
}
```

## Configuration Options

### Database Location

**Default location** (recommended for most apps):
```tsx
<ExpoSpatialiteProvider databaseName="myapp.db">
  <App />
</ExpoSpatialiteProvider>
```

**In-memory database** (faster, but data is lost when app closes):
```tsx
<ExpoSpatialiteProvider databaseName="temp.db" location=":memory:">
  <App />
</ExpoSpatialiteProvider>
```

**Custom location**:
```tsx
import * as FileSystem from 'expo-file-system';

<ExpoSpatialiteProvider 
  databaseName="myapp.db" 
  location={FileSystem.documentDirectory}
>
  <App />
</ExpoSpatialiteProvider>
```

### Loading from Assets

**Import a bundled Spatialite database** from your app's assets:
```tsx
<ExpoSpatialiteProvider 
  databaseName="kenya_locations.db"
  assetSource={{ assetId: require('../assets/databases/kenya_locations.db') }}
>
  <App />
</ExpoSpatialiteProvider>
```

This will automatically move the database from your app bundle to the writable directory.

### Database Initialization

Use `onInit` to run migrations, create tables, or apply performance tweaks:

```tsx
<ExpoSpatialiteProvider 
  databaseName="myapp.db"
  onInit={async ({ initDatabase, executeStatement }) => {
    // Initialize the Spatialite database
    await initDatabase(`${FileSystem.documentDirectory}myapp.db`);
    
    // Create spatial tables
    await executeStatement(`
      CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      )
    `);
    
    // Add geometry column
    await executeStatement(`
      SELECT AddGeometryColumn('locations', 'geom', 4326, 'POINT', 'XY')
    `);
    
    // Create spatial index
    await executeStatement(`
      SELECT CreateSpatialIndex('locations', 'geom')
    `);
    
    // Performance optimizations
    await executeStatement('PRAGMA mmap_size=268435456'); // 256MB memory mapping
    await executeStatement('PRAGMA journal_mode=WAL'); // Write-Ahead Logging
    await executeStatement('PRAGMA synchronous=NORMAL'); // Faster writes
  }}
>
  <App />
</ExpoSpatialiteProvider>
```

### Loading Pre-populated Spatialite Database

**Load a database with existing spatial data** from assets and then run additional setup:

```tsx
<ExpoSpatialiteProvider 
  databaseName="kenya_locations.db"
  assetSource={{ assetId: require('../assets/databases/kenya_locations.db') }}
  onInit={async ({ executeQuery, executeStatement }) => {
    // The database is already moved from assets
    // Now you can run additional setup or migrations
    
    // Check existing spatial data
    const locations = await executeQuery('SELECT COUNT(*) as count FROM locations');
    console.log('Existing locations:', locations.data?.[0]?.count);
    
    // Add any missing tables or columns
    await executeStatement(`
      CREATE TABLE IF NOT EXISTS location_categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )
    `);
  }}
>
  <App />
</ExpoSpatialiteProvider>
```

### Error Handling

```tsx
<ExpoSpatialiteProvider 
  databaseName="myapp.db"
  onError={(error) => {
    console.error('Spatialite database error:', error);
    // Log to crash reporting service
    // Show user-friendly error message
  }}
>
  <App />
</ExpoSpatialiteProvider>
```

### React Suspense Integration

```tsx
import { Suspense } from 'react';

export default function App() {
  return (
    <Suspense fallback={<Text>Loading Spatialite database...</Text>}>
      <ExpoSpatialiteProvider databaseName="myapp.db" useSuspense={true}>
        <MainApp />
      </ExpoSpatialiteProvider>
    </Suspense>
  );
}
```

## Using the Database

### Basic Geospatial Queries

```tsx
function LocationList() {
  const { executeQuery } = useExpoSpatialiteContext();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function loadLocations() {
      const result = await executeQuery(`
        SELECT id, name, description,
               ST_X(geom) as longitude,
               ST_Y(geom) as latitude
        FROM locations 
        ORDER BY name
      `);
      setLocations(result.data || []);
    }
    
    loadLocations();
  }, []);

  return (
    <FlatList
      data={locations}
      renderItem={({ item }) => (
        <Text>{item.name} ({item.latitude}, {item.longitude})</Text>
      )}
    />
  );
}
```

### Spatial Queries - Find Nearby Locations

```tsx
function NearbyLocations({ latitude, longitude, radius = 10000 }) {
  const { executeQuery } = useExpoSpatialiteContext();
  const [nearbyLocations, setNearbyLocations] = useState([]);

  useEffect(() => {
    async function findNearby() {
      const result = await executeQuery(`
        SELECT id, name, description,
               ST_X(geom) as longitude,
               ST_Y(geom) as latitude,
               ST_Distance(geom, MakePoint(?, ?, 4326)) as distance
        FROM locations
        WHERE ST_Distance(geom, MakePoint(?, ?, 4326)) <= ?
        ORDER BY distance
      `, [longitude, latitude, longitude, latitude, radius]);
      
      setNearbyLocations(result.data || []);
    }
    
    findNearby();
  }, [latitude, longitude, radius]);

  return (
    <FlatList
      data={nearbyLocations}
      renderItem={({ item }) => (
        <Text>{item.name} - {Math.round(item.distance)}m away</Text>
      )}
    />
  );
}
```

### Inserting Spatial Data

```tsx
function AddLocation() {
  const { executeStatement } = useExpoSpatialiteContext();
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const addLocation = async () => {
    try {
      const result = await executeStatement(
        `INSERT INTO locations (name, geom) 
         VALUES (?, MakePoint(?, ?, 4326))`,
        [name, parseFloat(longitude), parseFloat(latitude)]
      );
      
      console.log('Location added with ID:', result.rowsAffected);
      // Reset form
      setName('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Location name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <Button title="Add Location" onPress={addLocation} />
    </View>
  );
}
```

### Spatial Bounding Box Queries

```tsx
function LocationsInBoundingBox({ minLat, minLng, maxLat, maxLng }) {
  const { executeQuery } = useExpoSpatialiteContext();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function loadLocationsInBounds() {
      const result = await executeQuery(`
        SELECT id, name, description,
               ST_X(geom) as longitude,
               ST_Y(geom) as latitude
        FROM locations
        WHERE geom INTERSECTS BuildMBR(?, ?, ?, ?, 4326)
      `, [minLng, minLat, maxLng, maxLat]);
      
      setLocations(result.data || []);
    }
    
    loadLocationsInBounds();
  }, [minLat, minLng, maxLat, maxLng]);

  return (
    <FlatList
      data={locations}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

## Performance Tips

### Memory Mapping
Enable memory mapping for faster read/write operations:
```tsx
onInit={async ({ executeStatement }) => {
  await executeStatement('PRAGMA mmap_size=268435456'); // 256MB
}}
```

### Write-Ahead Logging (WAL)
Better for concurrent access:
```tsx
onInit={async ({ executeStatement }) => {
  await executeStatement('PRAGMA journal_mode=WAL');
}}
```

### Synchronous Mode
Faster writes (with slightly less durability):
```tsx
onInit={async ({ executeStatement }) => {
  await executeStatement('PRAGMA synchronous=NORMAL');
}}
```

### Spatial Indexes
Always create spatial indexes for better query performance:
```tsx
onInit={async ({ executeStatement }) => {
  await executeStatement("SELECT CreateSpatialIndex('locations', 'geom')");
}}
```

## Asset Database Setup

To include a Spatialite database file in your app bundle:

1. **Add the database file** to your project's assets folder (e.g., `assets/databases/`)
2. **Configure the bundler** to include the file:

**For Expo/Metro bundler**, add to `metro.config.js`:
```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add sqlite files to asset extensions
config.resolver.assetExts.push('sqlite', 'db');

module.exports = config;
```

3. **Use in your provider**:
```tsx
<ExpoSpatialiteProvider 
  databaseName="myapp.db"
  assetSource={{ assetId: require('../assets/databases/myapp.db') }}
>
  <App />
</ExpoSpatialiteProvider>
```

## Common Patterns

### Custom Hook for Spatial Operations

```tsx
// hooks/useLocations.ts
export function useLocations() {
  const { executeQuery, executeStatement } = useExpoSpatialiteContext();
  
  const getLocations = useCallback(async () => {
    const result = await executeQuery('SELECT * FROM locations ORDER BY name');
    return result.data || [];
  }, []);
  
  const addLocation = useCallback(async (name: string, latitude: number, longitude: number) => {
    return await executeStatement(
      'INSERT INTO locations (name, geom) VALUES (?, MakePoint(?, ?, 4326))',
      [name, longitude, latitude]
    );
  }, []);
  
  const findNearbyLocations = useCallback(async (latitude: number, longitude: number, radius: number) => {
    const result = await executeQuery(`
      SELECT id, name, description,
             ST_X(geom) as longitude,
             ST_Y(geom) as latitude,
             ST_Distance(geom, MakePoint(?, ?, 4326)) as distance
      FROM locations
      WHERE ST_Distance(geom, MakePoint(?, ?, 4326)) <= ?
      ORDER BY distance
    `, [longitude, latitude, longitude, latitude, radius]);
    
    return result.data || [];
  }, []);
  
  const deleteLocation = useCallback(async (id: number) => {
    return await executeStatement('DELETE FROM locations WHERE id = ?', [id]);
  }, []);
  
  return { getLocations, addLocation, findNearbyLocations, deleteLocation };
}
```

### Migration System for Spatial Data

```tsx
const SPATIAL_MIGRATIONS = [
  {
    version: 1,
    sql: `
      CREATE TABLE locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
      );
      SELECT AddGeometryColumn('locations', 'geom', 4326, 'POINT', 'XY');
    `
  },
  {
    version: 2,
    sql: `
      SELECT CreateSpatialIndex('locations', 'geom');
    `
  }
];

async function runSpatialMigrations({ executeQuery, executeStatement }) {
  // Get current version
  let currentVersion = 0;
  try {
    const result = await executeQuery('PRAGMA user_version');
    currentVersion = result.data?.[0]?.user_version || 0;
  } catch (e) {
    // Table doesn't exist yet
  }
  
  // Run pending migrations
  for (const migration of SPATIAL_MIGRATIONS) {
    if (migration.version > currentVersion) {
      await executeStatement(migration.sql);
      await executeStatement(`PRAGMA user_version = ${migration.version}`);
    }
  }
}

// Use in provider
<ExpoSpatialiteProvider 
  databaseName="myapp.db"
  onInit={runSpatialMigrations}
>
  <App />
</ExpoSpatialiteProvider>
```

## Best Practices

1. **Always use parameterized queries** for user input to prevent SQL injection
2. **Create spatial indexes** on geometry columns for better query performance
3. **Use transactions** for multiple related operations
4. **Handle errors gracefully** with try/catch blocks
5. **Keep database operations off the main thread** when possible
6. **Use bounding box queries** to limit the number of spatial operations
7. **Test your spatial queries** with real-world data
8. **Monitor memory usage** when working with large spatial datasets

## Troubleshooting

### Database locked errors
- Make sure you're not opening multiple connections to the same database
- Use WAL mode: `PRAGMA journal_mode=WAL`

### Spatial queries not returning results
- Ensure spatial indexes are created: `SELECT CreateSpatialIndex('table', 'geom')`
- Verify coordinate system (SRID 4326 for WGS84)
- Check that geometry columns are properly populated

### Performance issues with spatial queries
- Add spatial indexes to geometry columns
- Use bounding box filters to reduce the dataset before spatial operations
- Enable memory mapping for large databases
- Consider using prepared statements for repeated queries

### Memory issues
- Don't keep large result sets in memory
- Use LIMIT and OFFSET for pagination
- Finalize prepared statements when done