const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
    if (IS_DEV) {
        return 'com.tigawanna.geokenya.dev';
    }

    if (IS_PREVIEW) {
        return 'com.tigawanna.geokenya.preview';
    }

    return 'com.tigawanna.geokenya';
};

const getAppName = () => {
    if (IS_DEV) {
        return 'GeoKenya (Dev)';
    }

    if (IS_PREVIEW) {
        return 'GeoKenya (Preview)';
    }

    return 'StickerSmash: Emoji Stickers';
};

export default ({ config }) => ({
    ...config,
    "name": "geo-kenya",
    "slug": "geo-kenya",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "geokenya",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
        ...config.ios,
        "supportsTablet": true,
        "icon": {
            "light": "./assets/icons/ios-light.png",
            "dark": "./assets/icons/ios-dark.png",
            "tinted": "./assets/icons/ios-tinted.png"
        },
        bundleIdentifier: getUniqueIdentifier(),
    },
    "android": {
        ...config.android,
        "adaptiveIcon": {
            "backgroundColor": "#E6F4FE",
            "foregroundImage": "./assets/icons/adaptive-icon.png",
            "monochromeImage": "./assets/icons/adaptive-icon.png"
        },
        "edgeToEdgeEnabled": true,
        "predictiveBackGestureEnabled": false,
        package: getUniqueIdentifier(),
    },
    "web": {
        "output": "static",
        "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
        "expo-router",
        [
            "expo-splash-screen",
            {
                "image": "./assets/icons/splash-icon-light.png",
                "imageWidth": 200,
                "resizeMode": "contain",
                "backgroundColor": "#ffffff",
                "dark": {
                    "image": "./assets/icons/splash-icon-dark.png",
                    "backgroundColor": "#000000"
                }
            }
        ]
    ],
    "experiments": {
        "typedRoutes": true,
        "reactCompiler": true
    },
    "extra": {
        "router": {},
        "eas": {
            "projectId": "2ce4a1f5-0fe3-4728-8c3b-a8101b97f5fa"
        }
    }
}

);
