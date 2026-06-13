import { useEffect } from "react";
import { Platform } from "react-native";

function isCrashlyticsEnabled() {
  return process.env.APP_VARIANT === "production" && !__DEV__;
}

export async function registerCrashalytics() {
  if (!isCrashlyticsEnabled()) {
    return;
  }

  const {
    getCrashlytics,
    setAttribute,
    setCrashlyticsCollectionEnabled,
  } = await import("@react-native-firebase/crashlytics");

  const crashlytics = getCrashlytics();
  setCrashlyticsCollectionEnabled(crashlytics, true);
  setAttribute(crashlytics, "framework", "expo");
  setAttribute(crashlytics, "platform", Platform.OS);
  setAttribute(crashlytics, "environment", process.env.APP_VARIANT ?? "production");
}

export function useRegisterCrashalytics() {
  useEffect(() => {
    void registerCrashalytics();
  }, []);
}
