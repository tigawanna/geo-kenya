# API Reference

## Hooks

### `useMaterialDynamicColors(params?)`

Hook to manage Material Dynamic Colors theme with automatic updates.

#### Parameters

- `params?: object` - Optional configuration object
  - `fallbackSourceColor?: string` - Source color for fallback theme when dynamic colors are not supported (default: '#6750A4')
  - `sourceColor?: string` - If provided, generates a custom theme based on this color instead of using system theme

#### Returns

- `theme: MaterialDynamicTheme` - Current theme object with light and dark variants
- `updateTheme: (sourceColor: string) => void` - Function to update theme with a new source color
- `resetTheme: () => void` - Function to reset theme to default (system theme or fallback)

#### Example

```tsx
const { theme, updateTheme, resetTheme } = useMaterialDynamicColors({
  fallbackSourceColor: '#6750A4'
});
```

## Functions

### `getMaterialDynamicTheme(fallbackSourceColor?)`

Get the Material Dynamic Colors theme synchronously.

#### Parameters

- `fallbackSourceColor?: string` - Source color for fallback theme (default: '#6750A4')

#### Returns

- `MaterialDynamicTheme` - Theme object with light and dark color schemes

#### Example

```tsx
const theme = getMaterialDynamicTheme('#3E8260');
```

### `getMaterialDynamicThemeAsync(fallbackSourceColor?)`

Get the Material Dynamic Colors theme asynchronously.

#### Parameters

- `fallbackSourceColor?: string` - Source color for fallback theme (default: '#6750A4')

#### Returns

- `Promise<MaterialDynamicTheme>` - Promise resolving to theme object

#### Example

```tsx
const theme = await getMaterialDynamicThemeAsync('#3E8260');
```

### `createMaterialDynamicTheme(sourceColor)`

Create a Material Dynamic Colors theme based on a specific source color.

#### Parameters

- `sourceColor: string` - Source color for theme generation

#### Returns

- `MaterialDynamicTheme` - Generated theme object

#### Example

```tsx
const customTheme = createMaterialDynamicTheme('#FF5722');
```

## Constants

### `isDynamicThemeSupported`

Boolean indicating whether dynamic themes are supported on the current device.

#### Value

- `boolean` - `true` if device supports dynamic themes (Android 12+), `false` otherwise

#### Example

```tsx
if (isDynamicThemeSupported) {
  console.log('Dynamic themes are supported');
} else {
  console.log('Using fallback theme');
}
```

## Types

### `MaterialDynamicTheme`

Main theme object containing light and dark color schemes.

```typescript
type MaterialDynamicTheme = {
  light: MaterialDynamicColors;
  dark: MaterialDynamicColors;
};
```

### `MaterialDynamicColors`

Complete color scheme following Material Design 3 specifications.

```typescript
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
  
  // Extended surface colors
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

### `SystemScheme`

Base system color scheme retrieved from Android 12+ devices.

```typescript
type SystemScheme = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  inverseSurface: string;
  inverseOnSurface: string;
  inversePrimary: string;
};
```

## Usage Patterns

### Basic Theme Usage

```tsx
import { useMaterialDynamicColors } from 'expo-material-dynamic-colors';
import { useColorScheme } from 'react-native';

function MyComponent() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterialDynamicColors();
  
  const currentColors = theme[colorScheme];
  
  return (
    <View style={{ backgroundColor: currentColors.background }}>
      <Text style={{ color: currentColors.onBackground }}>
        Dynamic themed text
      </Text>
    </View>
  );
}
```

### Custom Theme Updates

```tsx
function ThemeSelector() {
  const { theme, updateTheme, resetTheme } = useMaterialDynamicColors();
  
  const handleColorSelect = (color: string) => {
    updateTheme(color);
  };
  
  const handleReset = () => {
    resetTheme();
  };
  
  return (
    <View>
      <Button title="Blue Theme" onPress={() => handleColorSelect('#2196F3')} />
      <Button title="Reset" onPress={handleReset} />
    </View>
  );
}
```

### React Native Paper Integration

```tsx
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterialDynamicColors();
  
  const paperTheme = useMemo(() => 
    colorScheme === 'dark' 
      ? { ...MD3DarkTheme, colors: theme.dark }
      : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );
  
  return (
    <PaperProvider theme={paperTheme}>
      {/* Your app content */}
    </PaperProvider>
  );
}
```

## Platform Compatibility

| Platform | Dynamic Colors | Fallback Theme |
|----------|----------------|----------------|
| Android 12+ | ✅ Supported | ✅ Supported |
| Android <12 | ❌ Not supported | ✅ Supported |
| iOS | ❌ Not supported | ✅ Supported |
| Web | ❌ Not supported | ✅ Supported |

## Error Handling

The library handles errors gracefully:

- If dynamic colors are not supported, it falls back to generated themes
- If system theme retrieval fails, it uses the fallback source color
- Invalid color strings are handled by the underlying color utilities

## Performance Considerations

- Theme generation is cached to avoid unnecessary recalculations
- The `useMaterialDynamicColors` hook only re-renders when theme changes
- System theme retrieval is optimized for Android 12+ devices
