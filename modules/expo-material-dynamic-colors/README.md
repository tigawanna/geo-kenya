<div align="center">

![Material Dynamic Colors](https://img.shields.io/badge/Material%20Dynamic%20Colors-Android%2012%2B-brightgreen)

</div>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yourusername/expo-material-dynamic-colors/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/expo-material-dynamic-colors/latest.svg)](https://www.npmjs.com/package/expo-material-dynamic-colors)
[![platform - android](https://img.shields.io/badge/platform-Android-3ddc84.svg?logo=android)](https://www.android.com)
[![platform - ios](https://img.shields.io/badge/platform-iOS-000.svg?logo=apple)](https://developer.apple.com/ios)

</div>

<h1 align="center">Expo Material Dynamic Colors</h1>

<div align="center">

This [Expo module](https://docs.expo.dev/modules/overview/) allows you to retrieve the [Material 3 dynamic theme](https://developer.android.com/develop/ui/views/theming/dynamic-colors) from Android 12+ devices, so that you can use it in your Expo (or bare React Native) app.

For devices not compatible (iOS or older Android versions) a fallback theme is returned based on Material Design 3 color tokens.

</div>

<br>

## ✨ Features

- 🎨 **Dynamic Theme Support**: Retrieve Material 3 dynamic colors from Android 12+ devices
- 🎯 **Fallback Theme**: Generate Material 3 theme based on any source color for unsupported devices
- 🌙 **Light & Dark Modes**: Complete support for both light and dark color schemes
- 📱 **Cross-Platform**: Works on both Android and iOS (with fallback)
- 🔧 **React Native Paper Compatible**: Works seamlessly with react-native-paper
- 🎭 **Elevation Support**: Includes all Material 3 elevation levels
- 🔄 **Dynamic Updates**: Update themes on-the-fly with custom source colors

<br>

## Installation

### Installation in managed Expo projects

> This library works with Expo Go, but you won't be able to retrieve the system theme (you'll get a fallback theme) because it requires custom native code and Expo Go [doesn't support it](https://docs.expo.dev/workflow/customizing/)

```bash
npx expo install expo-material-dynamic-colors
```

If you use development build, you'll have to rebuild development client (only Android) after adding the library because it contains native code:

```bash
npx expo prebuild --platform android
npx expo run:android
```

### Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

```bash
npx expo install expo-material-dynamic-colors
npx pod-install
```

## Usage

### Basic Usage with Dynamic Colors

Retrieve the Material 3 dynamic theme from the user's device (or a fallback theme if not supported):

```tsx
import { useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';

function App() {
  const colorScheme = useColorScheme();
  // If device doesn't support dynamic colors, fallback to a theme based on #6750A4
  const { theme } = useMaterialDynamicColors({ fallbackSourceColor: '#3E8260' });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme[colorScheme].background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme[colorScheme].onBackground,
      marginBottom: 20,
    },
    card: {
      backgroundColor: theme[colorScheme].surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    cardText: {
      color: theme[colorScheme].onSurface,
    },
    button: {
      backgroundColor: theme[colorScheme].primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: theme[colorScheme].onPrimary,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Material Dynamic Colors</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>This card uses dynamic surface colors</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Dynamic Primary Button</Text>
      </View>
    </View>
  );
}
```

### Custom Source Color Theme

Generate a theme based on a specific color instead of using the system theme:

```tsx
import { useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { useColorScheme, View, Text } from 'react-native';

function App() {
  const colorScheme = useColorScheme();
  // Theme will be based on #3E8260 color
  const { theme } = useMaterialDynamicColors({ sourceColor: '#3E8260' });

  return (
    <View style={{ backgroundColor: theme[colorScheme].background, flex: 1 }}>
      <Text style={{ color: theme[colorScheme].onBackground }}>
        Custom themed app
      </Text>
    </View>
  );
}
```

### Dynamic Theme Updates

Allow users to change the theme dynamically:

```tsx
import { useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { useColorScheme, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function App() {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterialDynamicColors();

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme[colorScheme].background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme[colorScheme].onBackground,
      marginBottom: 20,
    },
    colorPicker: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    colorButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: theme[colorScheme].outline,
    },
    resetButton: {
      backgroundColor: theme[colorScheme].secondaryContainer,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    resetButtonText: {
      color: theme[colorScheme].onSecondaryContainer,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Theme</Text>
      
      <View style={styles.colorPicker}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorButton, { backgroundColor: color }]}
            onPress={() => updateTheme(color)}
          />
        ))}
      </View>
      
      <TouchableOpacity style={styles.resetButton} onPress={resetTheme}>
        <Text style={styles.resetButtonText}>Reset to System Theme</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Usage with React Native Paper

The library provides themes compatible with `react-native-paper`:

```tsx
import { useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { useMemo } from 'react';
import { useColorScheme, View } from 'react-native';
import { 
  Button, 
  Card, 
  Title, 
  Paragraph,
  MD3DarkTheme, 
  MD3LightTheme, 
  Provider as PaperProvider 
} from 'react-native-paper';

function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterialDynamicColors();

  const paperTheme = useMemo(
    () =>
      colorScheme === 'dark' 
        ? { ...MD3DarkTheme, colors: theme.dark } 
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1, padding: 20 }}>
        <Card>
          <Card.Content>
            <Title>Material Dynamic Colors</Title>
            <Paragraph>
              This card automatically adapts to your device's dynamic theme colors.
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained">Action Button</Button>
          </Card.Actions>
        </Card>
      </View>
    </PaperProvider>
  );
}
```

## API Reference

### `useMaterialDynamicColors(params?)`

Hook to manage Material Dynamic Colors theme.

**Parameters:**
- `params.fallbackSourceColor?: string` - Source color for the fallback theme (default: '#6750A4')
- `params.sourceColor?: string` - Source color for the theme (overrides system theme)

**Returns:**
- `theme: MaterialDynamicTheme` - The current theme with light and dark variants
- `updateTheme: (sourceColor: string) => void` - Function to update theme with a new source color
- `resetTheme: () => void` - Function to reset theme to default (system or fallback)

### `getMaterialDynamicTheme(fallbackSourceColor?)`

Get the Material Dynamic Colors theme from the system (works only on Android 12+).

**Parameters:**
- `fallbackSourceColor?: string` - Source color for fallback theme (default: '#6750A4')

**Returns:**
- `MaterialDynamicTheme` - Theme object with light and dark variants

### `getMaterialDynamicThemeAsync(fallbackSourceColor?)`

Async version of `getMaterialDynamicTheme`.

**Parameters:**
- `fallbackSourceColor?: string` - Source color for fallback theme (default: '#6750A4')

**Returns:**
- `Promise<MaterialDynamicTheme>` - Promise resolving to theme object

### `createMaterialDynamicTheme(sourceColor)`

Create a Material Dynamic Colors theme based on a source color.

**Parameters:**
- `sourceColor: string` - Source color for the theme

**Returns:**
- `MaterialDynamicTheme` - Generated theme object

### `isDynamicThemeSupported`

Boolean indicating if dynamic theme is supported on the current device.

**Returns:**
- `boolean` - `true` if device supports dynamic themes (Android 12+), `false` otherwise

## Theme Structure

The `MaterialDynamicTheme` object contains the following structure:

```typescript
type MaterialDynamicTheme = {
  light: MaterialDynamicColors;
  dark: MaterialDynamicColors;
};

type MaterialDynamicColors = {
  // Primary colors
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  
  // Tertiary colors
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  
  // Surface colors
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  
  // Background colors
  background: string;
  onBackground: string;
  
  // Error colors
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  
  // Additional surface variants
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceBright: string;
  surfaceDim: string;
  surfaceTint: string;
  
  // Outline colors
  outline: string;
  outlineVariant: string;
  
  // Inverse colors
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
  
  // Utility colors
  shadow: string;
  scrim: string;
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;
  
  // Elevation levels
  elevation: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
};
```

## Advanced Usage

### Create a Custom Theme Provider

```tsx
import { MaterialDynamicTheme, useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  theme: MaterialDynamicTheme;
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  fallbackSourceColor = '#6750A4' 
}: { 
  children: ReactNode;
  fallbackSourceColor?: string;
}) {
  const colorScheme = useColorScheme();
  const { theme, updateTheme, resetTheme } = useMaterialDynamicColors({ 
    fallbackSourceColor 
  });

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        updateTheme, 
        resetTheme, 
        isDark: colorScheme === 'dark' 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

### Elevation Examples

```tsx
import { useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';

function ElevationExample() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterialDynamicColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme[colorScheme].background,
      padding: 20,
    },
    elevatedCard: {
      backgroundColor: theme[colorScheme].elevation.level2,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
    highElevatedCard: {
      backgroundColor: theme[colorScheme].elevation.level4,
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.elevatedCard}>
        <Text style={{ color: theme[colorScheme].onSurface }}>
          Elevation Level 2
        </Text>
      </View>
      <View style={styles.highElevatedCard}>
        <Text style={{ color: theme[colorScheme].onSurface }}>
          Elevation Level 4
        </Text>
      </View>
    </View>
  );
}
```

## Platform Support

| Platform | Dynamic Colors | Fallback Theme |
|----------|----------------|----------------|
| Android 12+ | ✅ Yes | ✅ Yes |
| Android <12 | ❌ No | ✅ Yes |
| iOS | ❌ No | ✅ Yes |

## Best Practices

1. **Always provide a fallback color** that matches your app's branding
2. **Use `useColorScheme()`** to respect the user's light/dark mode preference
3. **Test on both Android and iOS** to ensure fallback themes work correctly
4. **Consider accessibility** when choosing fallback colors
5. **Use elevation levels** for proper Material Design hierarchy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is released under the [MIT License](https://github.com/yourusername/expo-material-dynamic-colors/blob/main/LICENSE).

## Credits

This library is based on the excellent work from [@pchmn/expo-material3-theme](https://github.com/pchmn/expo-material3-theme) and uses [@material/material-color-utilities](https://github.com/material-foundation/material-color-utilities) for color generation.
