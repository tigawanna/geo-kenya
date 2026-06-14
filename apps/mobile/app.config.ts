import { ConfigContext, ExpoConfig } from "expo/config";

type AppVariant = "development" | "preview" | "production";



const getUniqueIdentifier = (APP_VARIANT: AppVariant) => {
  if (APP_VARIANT === "development") {
    return "com.tigawanna.geokenya.dev";
  }

  if (APP_VARIANT === "preview") {
    return "com.tigawanna.geokenya.preview";
  }

  return "com.tigawanna.geokenya";
};


const getAppName = (APP_VARIANT: AppVariant) => {
  if (APP_VARIANT === "development") {
    return { name: "GeoKenya (Dev)", slug: "geo-kenya" };
  }

  if (APP_VARIANT === "preview") {
    return { name: "GeoKenya (Preview)", slug: "geo-kenya" };
  }

  return { name: "GeoKenya", slug: "geo-kenya" };
};

const isProductionVariant = (APP_VARIANT: AppVariant) => {
  if (APP_VARIANT === "development" || APP_VARIANT === "preview") {
    return false
  }
  return true
};
const getPlugins = (APP_VARIANT: AppVariant) => {
  const is_production = isProductionVariant(APP_VARIANT);
  const plugins: ConfigContext["config"]["plugins"] = [
    "@react-native-vector-icons/material-icons",
    "@react-native-vector-icons/material-design-icons",
    "expo-router",
    "@maplibre/maplibre-react-native",
    "expo-background-task",
    "./plugins/opsqlite-spatialite/with-spatialite",
    "./plugins/with-gradle-memory",
    [
      "expo-splash-screen",
      {
        image: "./assets/icons/splash-icon-light.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#F3EDEB",
        dark: {
          image: "./assets/icons/splash-icon-dark.png",
          backgroundColor: "#8B685C",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: is_production ? false : true,
        },
      },
    ],
  ];
  return plugins;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_VARIANT = process.env.APP_VARIANT as AppVariant;
  const is_production = isProductionVariant(APP_VARIANT);
  console.log("\n\n===== APP_VARIANT =====", {APP_VARIANT,is_production}, "\n\n");
  const { name, slug } = getAppName(APP_VARIANT);
  const appIdentifier = getUniqueIdentifier(APP_VARIANT);
  const plugins = getPlugins(APP_VARIANT);
  const use_firebase = is_production;
  if (use_firebase) {
    plugins.push("@react-native-firebase/app");
    plugins.push("@react-native-firebase/crashlytics");
  }
  return {
    ...config,
    name: name,
    slug: slug,
    scheme: slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/splash-icon-dark.png",
    userInterfaceStyle: "automatic",
    ios: {
      ...config.ios,
      supportsTablet: true,
      infoPlist: {
        NSAppTransportSecurity: { NSAllowsArbitraryLoads: is_production ? false : true },
      },
      icon: {
        light: "./assets/icons/ios-light.png",
        dark: "./assets/icons/ios-dark.png",
        tinted: "./assets/icons/ios-tinted.png",
      },
      bundleIdentifier: appIdentifier,
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        backgroundColor: "#8B685C",
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
      },
      googleServicesFile: use_firebase ? "./google-services.json" : undefined,
      predictiveBackGestureEnabled: false,
      package: appIdentifier,
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins,
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    updates: {
      url: "https://u.expo.dev/2ce4a1f5-0fe3-4728-8c3b-a8101b97f5fa",
    },
    runtimeVersion: "1.0.0",
    extra: {
      router: {},
      eas: {
        projectId: "2ce4a1f5-0fe3-4728-8c3b-a8101b97f5fa",
      },
    },
  };
};
