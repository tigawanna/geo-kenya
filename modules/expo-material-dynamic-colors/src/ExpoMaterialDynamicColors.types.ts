
type ElevationLevels = "level0" | "level1" | "level2" | "level3" | "level4" | "level5";

export type SystemScheme = {
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

export type MaterialDynamicColors = SystemScheme & {
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;

  shadow: string;
  scrim: string;
  surfaceDisabled: string;
  onSurfaceDisabled: string;
  backdrop: string;

  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerLowest: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  surfaceBright: string;
  surfaceDim: string;
  surfaceTint: string;

  elevation: {
    [key in ElevationLevels]: string;
  };
};

export type MaterialDynamicTheme = {
  light: MaterialDynamicColors;
  dark: MaterialDynamicColors;
  elevation: {
    [key in ElevationLevels]: string;
  };

}
