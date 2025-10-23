import {
  getCrashlytics,
  setAttribute,
  setCrashlyticsCollectionEnabled,
} from "@react-native-firebase/crashlytics";
import { useEffect } from "react";
import { Platform } from "react-native";

export function registerCrashalytics() {
  const crashlytics = getCrashlytics();
  setCrashlyticsCollectionEnabled(crashlytics, true);
  setAttribute(crashlytics, "framework", "expo");
  setAttribute(crashlytics, "platform", Platform.OS);
  setAttribute(crashlytics, "environment", __DEV__ ? "development" : "production");
}

export function useRegisterCrashalytics() {
  useEffect(() => {
    registerCrashalytics();
  }, []);
}
