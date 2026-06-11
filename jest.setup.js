import 'react-native-gesture-handler/jestSetup';

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

jest.mock('@maplibre/maplibre-react-native', () => ({
  Map: 'Map',
  Camera: 'Camera',
  GeoJSONSource: 'GeoJSONSource',
  Layer: 'Layer',
  Logger: { setLogLevel: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Ionicons: 'Ionicons',
}));

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

jest.mock('@/lib/drizzle/InitDatabase', () => ({
  InitDatabase: ({ children }) => children,
}));

jest.mock('@/components/default/ui/icon-symbol', () => ({
  MaterialIcon: 'MaterialIcon',
}));

jest.mock('expo', () => ({
  ...jest.requireActual('expo'),
  requireNativeModule: jest.fn((moduleName) => {
    if (moduleName === 'ExpoRouter') {
      return {
        Material3DynamicColor: {
          isSupported: jest.fn(() => false),
          getTheme: jest.fn(() => null),
        },
      };
    }
    return {};
  }),
}));
