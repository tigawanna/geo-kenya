import { ConfigContext, ExpoConfig } from "expo/config";
const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.tigawanna.geokenya.dev";
  }

  if (IS_PREVIEW) {
    return "com.tigawanna.geokenya.preview";
  }

  return "com.tigawanna.geokenya";
};

const getAppName = () => {
  if (IS_DEV) {
    return { name: "GeoKenya (Dev)", slug: "geo-kenya" };
  }

  if (IS_PREVIEW) {
    return { name: "GeoKenya (Preview)", slug: "geo-kenya" };
  }

  return { name: "GeoKenya", slug: "geo-kenya" };
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const { name, slug } = getAppName();

  return {
    ...config,
    name: name,
    slug: slug,
    scheme: slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/splash-icon-dark.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      ...config.ios,
      supportsTablet: true,
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsArbitraryLoads: true }, // ? enable HTTP requests
      },
      icon: {
        light: "./assets/icons/ios-light.png",
        dark: "./assets/icons/ios-dark.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
      bundleIdentifier: getUniqueIdentifier(),
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        // backgroundColor: "#693535ff",
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
      },
      googleServicesFile: IS_DEV
        ? "./google-services.dev.json"
        : process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: getUniqueIdentifier(),
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/icons/splash-icon-light.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#534545ff",
          dark: {
            image: "./assets/icons/splash-icon-dark.png",
            backgroundColor: "#390F0F",
          },
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            usesCleartextTraffic: true, // ? enable HTTP requests
          },
          ios: {
            flipper: true,
          },
        },
      ],
      "@maplibre/maplibre-react-native",
      "expo-background-task",
      "@react-native-firebase/app",
      "@react-native-firebase/crashlytics",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    updates: {
      url: "https://u.expo.dev/2ce4a1f5-0fe3-4728-8c3b-a8101b97f5fa",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      router: {},
      eas: {
        projectId: "2ce4a1f5-0fe3-4728-8c3b-a8101b97f5fa",
      },
    },
  };
};
