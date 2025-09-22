# GeoKenya

GeoKenya is a React Native mobile application built with Expo that provides comprehensive geographic information about Kenya's administrative divisions, specifically focusing on wards, counties, and constituencies. **All operations run 100% locally** - no internet connection required after initial installation. The app uses SQLite with Spatialite for offline geospatial data storage and leverages modern React Native development practices.

**Note:** This is currently an Android-only project. iOS support is not yet implemented.

## Prerequisites

- Node.js (LTS version recommended)
- Android Studio (for Android development/emulator)
- pnpm package manager (preferred) or npm

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/tigawanna/geo-kenya
   cd geo-kenya
   npm install
   npm run build:android
   ```



   Using pnpm (recommended):
   ```bash
   ```
   
## Building the Application

**Important**: This application requires a native build due to its custom Expo modules and SQLite with Spatialite extensions. The development server alone will not provide full functionality.

### Development Build

For development testing on a physical device or emulator:
```bash
npm run build:android
```

### Production Build

For creating a preview APK:

```bash
npm run build-apk
```



**Note**: A native build is required for the application to function properly due to the custom SQLite with Spatialite module and map functionality.

## Features

- **100% Offline Operation** - All data and functionality work without internet connection
- View comprehensive information about Kenya's 1,450+ wards, 47 counties, and 290 constituencies
- Real-time location-based ward detection and distance calculations
- Interactive map with ward boundaries and search by placing pin on map
- Advanced search and filtering through geographic data
- Material Design 3 with dynamic color theming (Material You)
- Dark/light mode with automatic system preference detection
- Local SQLite database with Spatialite extension for geospatial queries
- Responsive UI optimized for mobile devices
- Location search by coordinates (latitude, longitude)

## Screenshots

### Location-Based Ward Discovery
Find wards closest to your current location with distance calculations (all computed locally)

**Note:** For improved location accuracy, consider enabling your network/WiFi connection alongside location services, even though the app works completely offline.

![Kajulu Ward - Yellow Theme](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/yellowinsh-kajulu-ward.jpg)

![Nyalende Ward - Blue Theme](https://github.com/tigawanna/geo-kenya/raw/master/docs/reddish-kyamatu-ward.jpg)



## Loading Screens

![Blue Loading Screen](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/blueish-loading-screen.jpg)

![Yellow Loading Screen](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/yellowish-loading-screen.jpg)


## Complete Ward Listing

![Blue Ward List](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/blueish-ward-list.jpg)

![Nearest Wards - Blue Theme](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/blueish-nearest-wards.jpg)

![Brown Ward List](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/brownish-ward-list.jpg)

## Dynamic Material You Theming
The app automatically adapts to your device's color scheme

 **Green Theme Variant**

![Green Color Theme](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/greenish-theme.jpg)

**Yellow Theme Variant**

![Yellow Color Theme](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/yellowish-theme.jpg)

**Purple Theme Variant**

![Purple Color Theme](https://github.com/tigawanna/geo-kenya/raw/478368af31c74a993e8e9e88f406dc260f30e1ce/docs/purpleish-theme.jpg)

## Dataset

The geographic data used in this application is available in a separate repository: [kenya_wards_geojson_data](https://github.com/tigawanna/kenya_wards_geojson_data). This dataset contains GeoJSON files for Kenya's administrative boundaries that can be used in your own projects.

## Project Structure

```
src/
├── app/                    # File-based routing with Expo Router
│   ├── (tabs)/             # Tab navigation screens
│   │   ├── index.tsx         # Home screen (current location)
│   │   ├── explore.tsx       # Explore screen (ward list)
│   │   └── settings.tsx      # Settings screen
│   ├── ward-by-id/         # Ward detail screens by ID
│   ├── ward-by-lat-long/   # Ward detail screens by coordinates
│   ├── _layout.tsx         # Root layout with providers
│   └── +not-found.tsx      # 404 screen
├── components/             # Reusable UI components
│   ├── locations/          # Location-based components
│   │   ├── form/             # Input forms (coordinate search)
│   │   ├── list/             # Ward listings
│   │   ├── maps/             # Map components
│   │   ├── proximity/        # Proximity-based components
│   │   └── single-ward/      # Individual ward components
│   ├── default/            # Default UI components
│   └── state-screens/      # State screens (loading, error, empty)
├── constants/              # Application constants
├── data-access-layer/      # Database query layer
├── hooks/                  # Custom React hooks
├── lib/                    # Library integrations and utilities
├── store/                  # Global state management
├── modules/                # Custom Expo modules
└── utils/                  # Utility functions
```

## Key Technologies

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Library**: React Native Paper with Material Design 3
- **State Management**: Zustand for global state, React Query for local data caching
- **Database**: SQLite with Spatialite extension via custom Expo modules (100% local)
- **ORM**: Drizzle ORM for type-safe database operations
- **Storage**: AsyncStorage for persisted settings and preferences
- **Maps**: MapLibre GL for interactive mapping
- **Geospatial**: Local coordinate calculations and distance computations

## Interactive Map Features

GeoKenya includes powerful interactive map functionality:

1. **Visualize Wards**: View ward boundaries with color-coded styling for the selected ward and its neighbors
2. **Pin Placement Search**: Tap anywhere on the map to search for the nearest ward at that location
3. **Coordinate Search**: Enter latitude and longitude coordinates to find specific wards
4. **Location Services**: Use device GPS to automatically find your current ward
5. **County Boundaries**: Visualize Kenya's 47 counties with labeled overlays

## Search Functionality

GeoKenya offers multiple ways to find wards:

### Device Location
- Automatically detect your current ward using device GPS
- Find nearby wards with distance calculations

### Coordinate Search
- Enter latitude and longitude coordinates in the search bar (e.g., "-1.2921, 36.8219")
- Find wards at specific geographic points

### Interactive Map Search
- Tap anywhere on the map to search for the nearest ward at that location
- Visualize ward boundaries and neighboring wards

### Text Search
- Search wards by name, county, or constituency
- Filter through the complete list of 1,450+ wards

## Acknowledgments

This project builds upon several excellent open-source libraries and tools:

1. **[expo-material3-theme](https://github.com/pchmn/expo-material3-theme)** - Our dynamic color implementation is based on this project, which provides Material You theme generation for Expo applications.

2. **[android-spatialite](https://github.com/ev-map/android-spatialite)** - Our Expo Spatialite module is based on this Android library, which provides Spatialite extension support for SQLite on Android.

3. **[maplibre-react-native](https://github.com/maplibre/maplibre-react-native)** - Interactive map rendering and manipulation.

We're grateful to the maintainers of these projects for their excellent work that made GeoKenya possible.

## Privacy & Offline Operation

**GeoKenya operates entirely offline** - your location data never leaves your device. All geographic calculations, database queries, and ward lookups are performed locally using the embedded SQLite database with Spatialite extensions.

## Platform Support

This is currently an **Android-only** project. While the codebase uses cross-platform technologies, it has only been tested and optimized for Android devices. iOS support is not yet implemented and may require additional work to function properly.





