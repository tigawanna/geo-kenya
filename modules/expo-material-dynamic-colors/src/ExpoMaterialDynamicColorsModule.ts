import { NativeModule, requireNativeModule } from 'expo';

import { SystemScheme } from './ExpoMaterialDynamicColors.types';

declare class ExpoMaterialDynamicColorsModule extends NativeModule {
  getSystemTheme(): { light: SystemScheme; dark: SystemScheme } | null;
  getSystemThemeAsync(): Promise<{ light: SystemScheme; dark: SystemScheme } | null>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoMaterialDynamicColorsModule>('ExpoMaterialDynamicColors');
