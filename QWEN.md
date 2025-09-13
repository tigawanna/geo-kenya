# GeoKenya Project Context

## Project Overview
GeoKenya is a React Native mobile application built with Expo that provides geographic information about Kenya's administrative divisions, specifically focusing on wards, counties, and constituencies. The app uses SQLite with Spatialite for geospatial data storage and leverages modern React Native development practices.

### Key Technologies
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **UI Library**: React Native Paper with Material Design 3
- **State Management**: Zustand for global state, React Query for server state
- **Database**: SQLite with Spatialite extension via custom Expo modules
- **ORM**: Drizzle ORM for database operations
- **Storage**: AsyncStorage for persisted settings
- **Theming**: Dynamic color support with Material You

### Project Structure
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
│   ├── locations/         # Location-specific components
│   ├── default/           # Default UI components
│   ├── shared/            # Shared components
│   └── state-screens/     # State-specific screens (loading, error, etc.)
├── constants/           # Application constants
├── hooks/               # Custom React hooks
├── lib/                 # Library integrations and utilities
│   ├── drizzle/           # Drizzle ORM configuration
│   ├── expo-spatialite/   # Spatialite integration
│   └── react-native-paper/# Paper components extensions
├── store/               # Global state management
└── modules/             # Custom Expo modules
    ├── expo-material-dynamic-colors/
    └── expo-spatialite/
```

## Core Functionality
1. **Geospatial Data Display**: Shows Kenya's wards with county and constituency information
2. **Search & Filter**: Allows searching through wards, counties, and constituencies
3. **Dynamic Theming**: Supports Material You dynamic colors and dark/light mode
4. **Offline Data**: Uses SQLite with Spatialite for local data storage
5. **Responsive UI**: Material Design 3 compliant interface with adaptive components

## Building and Running

### Prerequisites
- Node.js (LTS version)
- Expo CLI
- Android Studio or Xcode for native development
- pnpm package manager

### Development Commands
```bash
# Start the development server
pnpm start

# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run on Web
pnpm web

# Lint the codebase
pnpm lint
```

### Building for Production
```bash
# Prebuild for Android
pnpm prebuild:android

# Build APK locally
pnpm build-apk

# Build for Android (requires EAS setup)
pnpm build:android
```

## Development Conventions

### Code Style
- TypeScript for type safety
- ESLint for code linting with Expo configuration
- Prettier for code formatting (inferred from project setup)

### Architecture Patterns
1. **File-based Routing**: Using Expo Router with tab navigation
2. **Component-based UI**: Reusable components with clear separation of concerns
3. **State Management**: 
   - Zustand for global app settings (theme, preferences)
   - React Query for server/database state management
4. **Data Layer**: 
   - Drizzle ORM for type-safe database queries
   - SQLite with Spatialite for geospatial data storage
5. **Theming**: 
   - Material Design 3 with dynamic color support
   - Automatic dark/light mode based on system preference

### Testing
Currently, the project doesn't have explicit test configurations in package.json. Testing practices would need to be established:
- Unit tests with Jest
- Component tests with React Native Testing Library
- E2E tests with Detox or Maestro

### Contributing Guidelines
1. Follow the existing code structure and patterns
2. Use TypeScript for type safety
3. Maintain consistent styling with React Native Paper
4. Ensure components are reusable and well-documented
5. Follow the folder structure conventions
6. Use the existing state management patterns (Zustand + React Query)

## Key Features Implementation Details

### Geospatial Data Handling
- Custom Expo module for Spatialite integration
- Drizzle ORM schema with geometry column support
- Query optimization with React Query caching

### Theme System
- Dynamic color support with Material You
- User preference persistence with AsyncStorage
- Adaptive components for iOS and Android

### Navigation
- Tab-based navigation with bottom tabs
- Stack navigation for detail views
- Deep linking support with custom scheme

## Environment Variables
The project uses a `.env` file for configuration, though the specific variables would need to be checked in that file.

## Custom Modules
1. **expo-material-dynamic-colors**: Implements Material You dynamic color generation
2. **expo-spatialite**: Integrates SQLite with Spatialite extension for geospatial operations

## Database Schema
The application uses Drizzle ORM with a schema that includes:
- `kenya_wards` table with ward information and geometry data
- `notes` table for user notes with optional location data

This context should provide sufficient information for understanding and working with the GeoKenya project.