# GeoKenya

GeoKenya is a React Native mobile application built with Expo that provides comprehensive geographic information about Kenya's administrative divisions, specifically focusing on wards, counties, and constituencies. **All operations run 100% locally** - no internet connection required after initial installation. The app uses SQLite with Spatialite for offline geospatial data storage and leverages modern React Native development practices.

**Note:** This is currently an Android-only project. iOS support is not yet implemented.

![Ward Detail View - Soy Ward](https://github.com/tigawanna/geo-kenya/raw/4bab15a993660254634b55b58a34fd6e71a08072/docs/soy-ward.jpg)

## Features

- **100% Offline Operation** - All data and functionality work without internet connection
- View comprehensive information about Kenya's 1,450+ wards, 47 counties, and 290 constituencies
- Real-time location-based ward detection and distance calculations
- Advanced search and filtering through geographic data
- Material Design 3 with dynamic color theming (Material You)
- Dark/light mode with automatic system preference detection
- Local SQLite database with Spatialite extension for geospatial queries
- Responsive UI optimized for mobile devices

## Dataset

The geographic data used in this application is available in a separate repository: [kenya_wards_geojson_data](https://github.com/tigawanna/kenya_wards_geojson_data). This dataset contains GeoJSON files for Kenya's administrative boundaries that can be used in your own projects.

## Screenshots

### Location-Based Ward Discovery
Find wards closest to your current location with distance calculations (all computed locally)

**Note:** For improved location accuracy, consider enabling your network/WiFi connection alongside location services, even though the app works completely offline.

![Wagalla Ward - Location View](https://github.com/tigawanna/geo-kenya/raw/4bab15a993660254634b55b58a34fd6e71a08072/docs/wagalla-ward.jpg)

![Lokichar Ward - Detailed Information](https://github.com/tigawanna/geo-kenya/raw/4bab15a993660254634b55b58a34fd6e71a08072/docs/lokchar-ward.jpg)

### Application Interface

**Loading Screen**
![Initial Loading Screen](https://github.com/tigawanna/geo-kenya/raw/4bab15a993660254634b55b58a34fd6e71a08072/docs/loading-screen.jpg)

**Complete Ward Listing**
![All Wards List View](https://github.com/tigawanna/geo-kenya/raw/master/docs/list-all-view.jpg)

### Dynamic Material You Theming
The app automatically adapts to your device's color scheme

**Green Theme Variant**
![Green Color Theme](https://github.com/tigawanna/geo-kenya/raw/4bab15a993660254634b55b58a34fd6e71a08072/docs/greenish-theme.jpg)

**Red Theme Variant**
![Red Color Theme](https://github.com/tigawanna/geo-kenya/raw/4bab15a993660254634b55b58a34fd6e71a08072/docs/red-theme.jpg)

**Blue Theme Variant**
![Blue Color Theme](https://github.com/tigawanna/geo-kenya/raw/master/docs/blueish-theme.jpg)

## Prerequisites

- Node.js (LTS version recommended)
- Expo CLI
- Android Studio (for Android development/emulator)
- pnpm package manager

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd geo-kenya
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the development server:**

   ```bash
   pnpm start
   ```

4. **Run on Android:**

   ```bash
   pnpm android
   ```

5. **Build for Android:**
   ```bash
   pnpm build:android
   ```

## Project Structure

```
src/
├── app/                 # File-based routing with Expo Router
│   ├── (tabs)/          # Tab navigation screens
│   │   ├── index.tsx      # Home screen (wards list)
│   │   ├── explore.tsx    # Explore screen
│   │   └── settings.tsx   # Settings screen
│   ├── _layout.tsx        # Root layout with providers
│   └── +not-found.tsx     # 404 screen
├── components/          # Reusable UI components
├── constants/           # Application constants
├── hooks/               # Custom React hooks
├── lib/                 # Library integrations and utilities
├── store/               # Global state management
└── modules/             # Custom Expo modules
```

## Key Technologies

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Library**: React Native Paper with Material Design 3
- **State Management**: Zustand for global state, React Query for local data caching
- **Database**: SQLite with Spatialite extension via custom Expo modules (100% local)
- **ORM**: Drizzle ORM for type-safe database operations
- **Storage**: AsyncStorage for persisted settings and preferences
- **Geospatial**: Local coordinate calculations and distance computations

## Acknowledgments

This project builds upon several excellent open-source libraries and tools:

1. **[expo-material3-theme](https://github.com/pchmn/expo-material3-theme)** - Our dynamic color implementation is based on this project, which provides Material You theme generation for Expo applications.

2. **[android-spatialite](https://github.com/ev-map/android-spatialite)** - Our Expo Spatialite module is based on this Android library, which provides Spatialite extension support for SQLite on Android.

We're grateful to the maintainers of these projects for their excellent work that made GeoKenya possible.

## Privacy & Offline Operation

**GeoKenya operates entirely offline** - your location data never leaves your device. All geographic calculations, database queries, and ward lookups are performed locally using the embedded SQLite database with Spatialite extensions.

## Platform Support

This is currently an **Android-only** project. While the codebase uses cross-platform technologies, it has only been tested and optimized for Android devices. iOS support is not yet implemented and may require additional work to function properly.

## TODO

### Location-Based Routing Features

- [ ] **Add location route with coordinates parameter** - Create a new route `/location/[lat]/[lng]` that accepts latitude and longitude parameters to display location-based ward information similar to the home screen

- [ ] **Implement location coordinate querying** - Add functionality to query wards by specific coordinates using the existing Spatialite geospatial database

- [ ] **Add conditional checks in ward detail component** - Update the `wards/[ward]` component to include conditional logic that routes to the location view when a map is clicked while viewing ward details



