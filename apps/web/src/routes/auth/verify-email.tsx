import { isEmailVerified, useViewer, viewerqueryOptions } from "@/data-access-layer/auth/viewer";
import {
  getFirebaseErrorMessage,
  sendFirebaseVerificationEmail,
  syncBetterAuthFromFirebaseUser,
} from "@/lib/firebase/email-actions";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { AppConfig } from "@/utils/system";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";

const searchparams = z.object({
  returnTo: z.string().default("/dashboard"),
});

export const Route = createFileRoute("/auth/verify-email")({
  component: VerifyEmailPage,
  validateSearch: (search) => searchparams.parse(search),
  beforeLoad: ({ context, search }) => {
    const user = context.viewer?.user;
    if (!user) {
      throw redirect({ to: "/auth", search: { returnTo: search.returnTo } });
    }
    if (isEmailVerified(user)) {
      throw redirect({ to: search.returnTo || "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Verify email` }],
  }),
});

function VerifyEmailPage() {
  const { returnTo } = Route.useSearch();
  const { viewer, logoutMutation } = useViewer();
  const qc = useQueryClient();
  const router = useRouter();
  const email = viewer.user?.email;

  const resendMutation = useMutation({
    mutationFn: async () => {
      const user = getFirebaseClientAuth().currentUser;
      if (!user) {
        throw new Error("Sign in again to resend the verification email.");
      }
      await sendFirebaseVerificationEmail(user);
    },
    onSuccess: () => {
      toast.success("Verification email sent");
    },
    onError: (error: unknown) => {
      toast.error("Could not resend email", {
        description: getFirebaseErrorMessage(error),
      });
    },
  });

  const checkMutation = useMutation({
    mutationFn: async () => {
      const user = getFirebaseClientAuth().currentUser;
      if (!user) {
        throw new Error("Sign in again, then return here to confirm verification.");
      }
      await syncBetterAuthFromFirebaseUser(user);
      await router.invalidate();
      const next = await qc.fetchQuery(viewerqueryOptions);
      if (!isEmailVerified(next.data?.user)) {
        throw new Error("Email is still unverified. Open the link in your inbox first.");
      }
    },
    onSuccess: () => {
      toast.success("Email verified");
      void router.navigate({ to: returnTo || "/dashboard" });
    },
    onError: (error: unknown) => {
      toast.error("Not verified yet", {
        description: getFirebaseErrorMessage(error),
      });
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-base-300 bg-base-100/90 p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <AppConfig.icon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Verify your email</h1>
            <p className="text-sm text-base-content/60">
              We sent a link to {email ?? "your inbox"}
            </p>
          </div>
        </div>

        <p className="text-sm text-base-content/70">
          Confirm your address before accessing the dashboard. This helps keep sign-ups honest and
          recoverable.
        </p>

        <button
          type="button"
          className="btn w-full btn-primary"
          disabled={checkMutation.isPending}
          onClick={() => checkMutation.mutate()}
        >
          {checkMutation.isPending ? "Checking…" : "I've verified — continue"}
        </button>

        <button
          type="button"
          className="btn w-full btn-outline"
          disabled={resendMutation.isPending}
          onClick={() => resendMutation.mutate()}
        >
          {resendMutation.isPending ? "Sending…" : "Resend verification email"}
        </button>

        <p className="text-center text-sm text-base-content/70">
          Wrong account?{" "}
          <button
            type="button"
            className="link link-primary"
            onClick={() => logoutMutation.mutate()}
          >
            Sign out
          </button>
          {" · "}
          <Link to="/auth" search={{ returnTo }} className="link link-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
