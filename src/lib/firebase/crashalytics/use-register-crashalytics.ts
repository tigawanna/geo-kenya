import crashlytics from "@react-native-firebase/crashlytics";
import { useEffect } from "react";
import { Platform } from "react-native";

export function useRegisterCrashalytics() {
  useEffect(() => {
    // Initialize Firebase Crashlytics
    crashlytics().setCrashlyticsCollectionEnabled(true);
    crashlytics().setAttribute("framework", "expo");
    crashlytics().setAttribute("platform", Platform.OS);
    crashlytics().setAttribute("environment", __DEV__ ? "development" : "production");
  }, []);
}
