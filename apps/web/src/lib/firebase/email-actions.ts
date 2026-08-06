import { authClient } from "@/lib/better-auth/client";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import type { ActionCodeSettings } from "firebase/auth";
import {
  applyActionCode,
  sendEmailVerification,
  sendPasswordResetEmail,
  type User,
} from "firebase/auth";

/** Continue URL Firebase appends / redirects to after email actions. */
export function createActionCodeSettings(path: string): ActionCodeSettings {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return {
    url: `${origin}${path.startsWith("/") ? path : `/${path}`}`,
    handleCodeInApp: true,
  };
}

export function getFirebaseErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: string }).code ?? "");
    switch (code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again later.";
      case "auth/expired-action-code":
        return "This link has expired. Request a new one.";
      case "auth/invalid-action-code":
        return "This link is invalid or has already been used.";
      default:
        break;
    }
  }
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}

/** Push a fresh Firebase ID token into Better Auth (updates emailVerified, profile). */
export async function syncBetterAuthFromFirebaseUser(user: User) {
  await user.reload();
  const idToken = await user.getIdToken(true);
  const { data, error } = await authClient.signInWithEmail({ idToken });
  if (error) throw error;
  return data;
}

export async function sendFirebaseVerificationEmail(user: User) {
  await sendEmailVerification(user, createActionCodeSettings("/auth/action"));
}

export async function applyFirebaseEmailActionCode(oobCode: string) {
  const auth = getFirebaseClientAuth();
  await applyActionCode(auth, oobCode);
  if (auth.currentUser) {
    return syncBetterAuthFromFirebaseUser(auth.currentUser);
  }
  return null;
}

export async function sendFirebasePasswordReset(email: string) {
  await sendPasswordResetEmail(
    getFirebaseClientAuth(),
    email,
    createActionCodeSettings("/auth/reset-password"),
  );
}
