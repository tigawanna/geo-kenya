// jest.setup.js
import 'react-native-gesture-handler/jestSetup';

// Mock native modules
jest.mock('./modules/expo-spatialite', () => require('./__mocks__/expo-spatialite'));
jest.mock('./modules/expo-material-dynamic-colors', () => require('./__mocks__/expo-material-dynamic-colors'));

// Mock Expo modules
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: -1.2921, longitude: 36.8219 }
  })),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(() => {
      const asset = {
        uri: 'mock-asset-uri',
        localUri: 'mock-local-uri',
        downloadAsync: jest.fn(() => {
          asset.localUri = 'mock-downloaded-uri';
          return Promise.resolve(asset);
        })
      };
      return asset;
    }),
  },
}));

jest.mock('expo-file-system', () => ({
  Directory: jest.fn(),
  File: jest.fn(),
  Paths: { document: '/mock/document/path' },
}));

// Mock MapLibre React Native
jest.mock('@maplibre/maplibre-react-native', () => ({
  MapView: 'MapView',
  Camera: 'Camera',
  FillLayer: 'FillLayer',
  Images: 'Images',
  ShapeSource: 'ShapeSource',
  SymbolLayer: 'SymbolLayer',
  LineLayer: 'LineLayer',
  UserLocation: 'UserLocation',
  Logger: { setLogLevel: jest.fn() },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock material color utilities
jest.mock('@material/material-color-utilities', () => ({
  argbFromHex: jest.fn(() => 0xff6750a4),
  themeFromSourceColor: jest.fn(() => ({
    schemes: {
      light: {
        primary: 0xff6750a4,
        toJSON: () => ({ primary: 0xff6750a4 })
      },
      dark: {
        primary: 0xffd0bcff,
        toJSON: () => ({ primary: 0xffd0bcff })
      },
    },
    palettes: {
      neutralVariant: {
        tone: jest.fn(() => 0xff49454f)
      },
      neutral: {
        tone: jest.fn(() => 0xfffbfdf7)
      }
    }
  })),
}));

// Mock ExpoSpatialiteProvider to avoid database initialization
jest.mock('@/lib/expo-spatialite/ExpoSpatialiteProvider', () => ({
  ExpoSpatialiteProvider: ({ children }) => children,
}));

// Mock MaterialIcon component
jest.mock('@/components/default/ui/icon-symbol', () => ({
  MaterialIcon: 'MaterialIcon',
}));

// Mock Expo native modules at the requireNativeModule level
jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  requireNativeModule: jest.fn((moduleName) => {
    if (moduleName === 'ExpoMaterialDynamicColors') {
      return require('./__mocks__/ExpoMaterialDynamicColors').default;
    }
    if (moduleName === 'ExpoSpatialite') {
      return require('./__mocks__/ExpoSpatialite').default;
    }
    return {};
  }),
}));
