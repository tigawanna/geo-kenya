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
type UniqueIDT = ReturnType<typeof getUniqueIdentifier>;

const getAppName = () => {
  if (IS_DEV) {
    return { name: "GeoKenya (Dev)", slug: "geo-kenya" };
  }

  if (IS_PREVIEW) {
    return { name: "GeoKenya (Preview)", slug: "geo-kenya" };
  }

  return { name: "GeoKenya", slug: "geo-kenya" };
};

const getPlugins = (idt: UniqueIDT) => {
  const is_production = idt === "com.tigawanna.geokenya";
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
  console.log("\n\n===== APP_VARIANT =====", process.env.APP_VARIANT,"\n\n");
  const { name, slug } = getAppName();
  const appIdentifier = getUniqueIdentifier();
  const plugins = getPlugins(appIdentifier);
  const is_production = appIdentifier === "com.tigawanna.geokenya";
  const use_firebase = process.env.APP_VARIANT === "production";
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
