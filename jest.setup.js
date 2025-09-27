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
    fromModule: jest.fn(() => ({ uri: 'mock-asset-uri' })),
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