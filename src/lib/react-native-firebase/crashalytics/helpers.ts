function isCrashlyticsEnabled() {
  return process.env.APP_VARIANT !== "development" && !__DEV__;
}

async function getCrashlyticsInstance() {
  const { default: crashlytics } = await import("@react-native-firebase/crashlytics");
  return crashlytics();
}

export async function logError(error: Error, context?: string) {
  if (!isCrashlyticsEnabled()) {
    return;
  }

  const crashlytics = await getCrashlyticsInstance();
  if (context) {
    crashlytics.log(`Error in ${context}`);
  }
  crashlytics.recordError(error);
}

export async function setUserId(userId: string) {
  if (!isCrashlyticsEnabled()) {
    return;
  }

  const crashlytics = await getCrashlyticsInstance();
  crashlytics.setUserId(userId);
}

export async function setAttribute(key: string, value: string) {
  if (!isCrashlyticsEnabled()) {
    return;
  }

  const crashlytics = await getCrashlyticsInstance();
  crashlytics.setAttribute(key, value);
}

export async function logMessage(message: string) {
  if (!isCrashlyticsEnabled()) {
    return;
  }

  const crashlytics = await getCrashlyticsInstance();
  crashlytics.log(message);
}

export async function testCrash() {
  if (!isCrashlyticsEnabled()) {
    return;
  }

  const crashlytics = await getCrashlyticsInstance();
  crashlytics.log("Testing crash from development");
  crashlytics.crash();
}
