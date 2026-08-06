import { isEmailVerified, viewerqueryOptions } from "@/data-access-layer/auth/viewer";
import { authClient } from "@/lib/better-auth/client";
import { getFirebaseErrorMessage } from "@/lib/firebase/email-actions";
import { firebaseClientConfigured, getFirebaseClientAuth } from "@/lib/firebase/client";
import { AppConfig } from "@/utils/system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { toast } from "sonner";
import { z } from "zod";
import { Route } from "../index";

const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type SigninValues = z.infer<typeof signinSchema>;

export function SigninComponent() {
  const qc = useQueryClient();
  const router = useRouter();
  const { returnTo } = Route.useSearch();

  const form = useForm<SigninValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function goAfterAuth() {
    await router.invalidate();
    const viewer = await qc.fetchQuery(viewerqueryOptions);
    const user = viewer.data?.user;
    if (user && !isEmailVerified(user)) {
      toast.message("Verify your email to continue");
      void router.navigate({ to: "/auth/verify-email", search: { returnTo } });
      return;
    }
    toast.success("Signed in");
    void router.navigate({ to: returnTo || "/dashboard" });
  }

  const mutation = useMutation({
    mutationFn: async (payload: SigninValues) => {
      if (!firebaseClientConfigured) {
        throw new Error("Firebase Auth is not configured.");
      }
      const credential = await signInWithEmailAndPassword(
        getFirebaseClientAuth(),
        payload.email,
        payload.password,
      );
      const idToken = await credential.user.getIdToken();
      const { data, error } = await authClient.signInWithEmail({ idToken });
      if (error) throw error;
      return data;
    },
    onError: (error: unknown) => {
      toast.error("Sign in failed", {
        description: getFirebaseErrorMessage(error),
      });
    },
    onSuccess: async () => {
      await goAfterAuth();
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      if (!firebaseClientConfigured) {
        throw new Error("Firebase Auth is not configured.");
      }
      const result = await signInWithPopup(getFirebaseClientAuth(), new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();
      const { data, error } = await authClient.signInWithGoogle({ idToken });
      if (error) throw error;
      return data;
    },
    onError: (error: unknown) => {
      toast.error("Google sign-in failed", {
        description: getFirebaseErrorMessage(error),
      });
    },
    onSuccess: async () => {
      await goAfterAuth();
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-base-300 bg-base-100/90 p-8 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <AppConfig.icon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="text-sm text-base-content/60">{AppConfig.name} admin</p>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            className="input-bordered input w-full"
            autoComplete="username"
            {...form.register("email")}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="flex items-center justify-between gap-2">
            Password
            <Link
              to="/auth/forgot-password"
              search={{ returnTo }}
              className="link text-xs font-normal link-primary"
            >
              Forgot password?
            </Link>
          </span>
          <input
            type="password"
            className="input-bordered input w-full"
            autoComplete="current-password"
            {...form.register("password")}
          />
        </label>

        <button type="submit" className="btn w-full btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in…" : "Sign in"}
        </button>

        {firebaseClientConfigured ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-base-300" />
              <span className="text-xs text-base-content/60">OR</span>
              <div className="h-px flex-1 bg-base-300" />
            </div>
            <button
              type="button"
              className="btn w-full btn-outline"
              disabled={googleMutation.isPending || mutation.isPending}
              onClick={() => googleMutation.mutate()}
            >
              <FaGoogle />
              Continue with Google
            </button>
          </>
        ) : null}

        <p className="text-center text-sm text-base-content/70">
          No account?{" "}
          <Link to="/auth/signup" search={{ returnTo }} className="link link-primary">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
