import crashlytics from "@react-native-firebase/crashlytics";

/**
 * Log a non-fatal error to Crashlytics
 */
export function logError(error: Error, context?: string) {
  if (context) {
    crashlytics().log(`Error in ${context}`);
  }
  crashlytics().recordError(error);
}

/**
 * Set user identifier for crash reports
 */
export function setUserId(userId: string) {
  crashlytics().setUserId(userId);
}

/**
 * Set custom attribute for crash reports
 */
export function setAttribute(key: string, value: string) {
  crashlytics().setAttribute(key, value);
}

/**
 * Log a message to Crashlytics
 */
export function log(message: string) {
  crashlytics().log(message);
}

/**
 * Test crash - ONLY FOR DEVELOPMENT
 */
export function testCrash() {
  if (__DEV__) {
    crashlytics().log("Testing crash from development");
    crashlytics().crash();
  }
}
