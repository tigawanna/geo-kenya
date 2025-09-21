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
  console.log("APP NAME :: ",name)
  console.log("APP SLUG :: ", slug)
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
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/icons/adaptive-icon.png",
        monochromeImage: "./assets/icons/adaptive-icon.png",
      },
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
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/icons/splash-icon-dark.png",
            backgroundColor: "#000000",
          },
        },
      ],
      "@maplibre/maplibre-react-native",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "2ce4a1f5-0fe3-4728-8c3b-a8101b97f5fa",
      },
    },
  };
};
