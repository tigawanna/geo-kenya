import { argbFromHex, Scheme, themeFromSourceColor, TonalPalette } from '@material/material-color-utilities';
import color from 'color';

// import { MaterialDynaicColors, MaterialDynamicTheme, SystemScheme } from '../ExpoMaterialDynamicTheme.types';
import {MaterialDynamicColors,SystemScheme,MaterialDynamicTheme} from "../ExpoMaterialDynamicColors.types"

const opacity = {
  level1: 0.08,
  level2: 0.12,
  level3: 0.16,
  level4: 0.38,
};

const elevations = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];

type Palettes = {
  primary: TonalPalette;
  secondary: TonalPalette;
  tertiary: TonalPalette;
  neutral: TonalPalette;
  neutralVariant: TonalPalette;
  error: TonalPalette;
};

export function createThemeFromSystemSchemes(schemes: { light: SystemScheme; dark: SystemScheme }): MaterialDynamicTheme {
  const { light, dark, palettes } = generateSchemesFromSourceColor(schemes.light.primary);
  schemes = {
    light: { ...light, ...schemes.light },
    dark: { ...dark, ...schemes.dark },
  };

  return {
    light: { ...schemes.light, ...generateMissingFields(schemes.light, palettes, 'light') } as MaterialDynamicColors,
    dark: { ...schemes.dark, ...generateMissingFields(schemes.dark, palettes, 'dark') } as MaterialDynamicColors,
    elevation:{
      level0: 'transparent',
      level1: color(schemes.light.surface).mix(color(schemes.light.primary), 0.05).hex(),
      level2: color(schemes.light.surface).mix(color(schemes.light.primary), 0.08).hex(),
      level3: color(schemes.light.surface).mix(color(schemes.light.primary), 0.11).hex(),
      level4: color(schemes.light.surface).mix(color(schemes.light.primary), 0.12).hex(),
      level5: color(schemes.light.surface).mix(color(schemes.light.primary), 0.14).hex(),
    }
  };
}

export function createThemeFromSourceColor(sourceColor: string): MaterialDynamicTheme {
  const { light, dark, palettes } = generateSchemesFromSourceColor(sourceColor);

  return {
    light: { ...light, ...generateMissingFields(light, palettes, 'light') } as MaterialDynamicColors,
    dark: { ...dark, ...generateMissingFields(dark, palettes, 'dark') } as MaterialDynamicColors,
    elevation: {
      level0: 'transparent',
      level1: color(light.surface).mix(color(light.primary), 0.05).hex(),
      level2: color(light.surface).mix(color(light.primary), 0.08).hex(),
      level3: color(light.surface).mix(color(light.primary), 0.11).hex(),
      level4: color(light.surface).mix(color(light.primary), 0.12).hex(),
      level5: color(light.surface).mix(color(light.primary), 0.14).hex(),
    },
  };
}

function generateMissingFields(scheme: SystemScheme, palettes: Palettes, colorScheme: 'light' | 'dark') {
  const elevation = elevations.reduce(
    (acc, value, index) => ({
      ...acc,
      [`level${index}`]: index === 0 ? value : color(scheme.surface).mix(color(scheme.primary), Number(value)).hex(),
    }),
    {}
  ) as MaterialDynamicColors['elevation'];

  const customColors = {
    surfaceDisabled: color(scheme.onSurface).alpha(opacity.level2).rgb().string(),
    onSurfaceDisabled: color(scheme.onSurface).alpha(opacity.level4).rgb().string(),
    backdrop: color(palettes.neutralVariant.tone(20)).alpha(0.4).rgb().string(),
    surfaceContainer: color(palettes.neutral.tone(colorScheme === 'dark' ? 12 : 94)).hex(),
    surfaceContainerLow: color(palettes.neutral.tone(colorScheme === 'dark' ? 10 : 96)).hex(),
    surfaceContainerLowest: color(palettes.neutral.tone(colorScheme === 'dark' ? 4 : 100)).hex(),
    surfaceContainerHigh: color(palettes.neutral.tone(colorScheme === 'dark' ? 17 : 92)).hex(),
    surfaceContainerHighest: color(palettes.neutral.tone(colorScheme === 'dark' ? 22 : 90)).hex(),
    surfaceBright: color(palettes.neutral.tone(colorScheme === 'dark' ? 24 : 98)).hex(),
    surfaceDim: color(palettes.neutral.tone(colorScheme === 'dark' ? 6 : 87)).hex(),
    surfaceTint: scheme.primary,
  };

  return { elevation, ...customColors };
}

function generateSchemesFromSourceColor(sourceColor: string) {
  const { schemes, palettes } = themeFromSourceColor(argbFromHex(sourceColor));

  return {
    light: transformScheme(schemes.light),
    dark: transformScheme(schemes.dark),
    palettes,
  };
}

function transformScheme(scheme: Scheme) {
  const jsonScheme = scheme.toJSON();
  type SchemeKeys = keyof typeof jsonScheme;

  return Object.entries(jsonScheme).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: color(value).hex(),
    };
  }, {} as { [key in SchemeKeys]: string });
}
