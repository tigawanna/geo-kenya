# GeoKenya

GeoKenya is a React Native mobile application built with Expo that provides geographic information about Kenya's administrative divisions, specifically focusing on wards, counties, and constituencies. The app uses SQLite with Spatialite for geospatial data storage and leverages modern React Native development practices.

**Note:** This is currently an Android-only project. iOS support is not yet implemented.

## Features

- View comprehensive information about Kenya's wards, counties, and constituencies
- Search and filter through geographic data
- Material Design 3 with dynamic color support (Material You)
- Dark/light mode with automatic system preference detection
- Offline data storage using SQLite with Spatialite extension
- Responsive UI optimized for mobile devices

## Dataset

The geographic data used in this application is available in a separate repository: [kenya_wards_geojson_data](https://github.com/tigawanna/kenya_wards_geojson_data). This dataset contains GeoJSON files for Kenya's administrative boundaries that can be used in your own projects.

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
- **State Management**: Zustand for global state, React Query for server state
- **Database**: SQLite with Spatialite extension via custom Expo modules
- **ORM**: Drizzle ORM for database operations
- **Storage**: AsyncStorage for persisted settings

## Acknowledgments

This project builds upon several excellent open-source libraries and tools:

1. **[expo-material3-theme](https://github.com/pchmn/expo-material3-theme)** - Our dynamic color implementation is based on this project, which provides Material You theme generation for Expo applications.

2. **[android-spatialite](https://github.com/ev-map/android-spatialite)** - Our Expo Spatialite module is based on this Android library, which provides Spatialite extension support for SQLite on Android.

We're grateful to the maintainers of these projects for their excellent work that made GeoKenya possible.

## Disclaimer

This is currently an Android-only project. While the codebase uses cross-platform technologies, it has only been tested and optimized for Android devices. iOS support is not yet implemented and may require additional work to function properly.






