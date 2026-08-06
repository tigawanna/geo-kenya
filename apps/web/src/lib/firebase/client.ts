import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

function readFirebaseWebConfig() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !projectId) {
    return null;
  }

  return { apiKey, authDomain, projectId };
}

/** True when browser Firebase Auth env vars are present. */
export const firebaseClientConfigured = Boolean(readFirebaseWebConfig());

function getFirebaseApp(): FirebaseApp {
  const config = readFirebaseWebConfig();
  if (!config) {
    throw new Error(
      "Firebase web config missing. Set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, and VITE_FIREBASE_PROJECT_ID.",
    );
  }

  return getApps().length > 0 ? getApp() : initializeApp(config);
}

/** Lazy Firebase Auth instance for client-side email/Google sign-in. */
export function getFirebaseClientAuth(): Auth {
  return getAuth(getFirebaseApp());
}
