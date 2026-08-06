import { isEmailVerified, viewerqueryOptions } from "@/data-access-layer/auth/viewer";
import {
  applyFirebaseEmailActionCode,
  getFirebaseErrorMessage,
  syncBetterAuthFromFirebaseUser,
} from "@/lib/firebase/email-actions";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { AppConfig } from "@/utils/system";
import { extractOobCodeFromUrl } from "better-auth-firebase-auth/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";

const searchparams = z.object({
  mode: z.string().optional(),
  oobCode: z.string().optional(),
  continueUrl: z.string().optional(),
  returnTo: z.string().default("/dashboard"),
});

export const Route = createFileRoute("/auth/action")({
  component: AuthActionPage,
  validateSearch: (search) => searchparams.parse(search),
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Email action` }],
  }),
});

function AuthActionPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const qc = useQueryClient();
  const started = useRef(false);

  const oobCode = useMemo(() => search.oobCode || extractOobCodeFromUrl() || "", [search.oobCode]);
  const mode = search.mode ?? "";

  const verifyMutation = useMutation({
    mutationFn: async (code: string | null) => {
      if (code) {
        await applyFirebaseEmailActionCode(code);
      } else {
        const user = getFirebaseClientAuth().currentUser;
        if (!user) {
          throw new Error("Open this link while signed in, or use Resend from the verify page.");
        }
        await syncBetterAuthFromFirebaseUser(user);
        if (!user.emailVerified) {
          throw new Error("Email is still unverified.");
        }
      }
      await router.invalidate();
      await qc.fetchQuery(viewerqueryOptions);
    },
    onSuccess: async () => {
      toast.success("Email verified");
      const viewer = await qc.fetchQuery(viewerqueryOptions);
      if (isEmailVerified(viewer.data?.user)) {
        void router.navigate({ to: search.returnTo || "/dashboard" });
      } else {
        void router.navigate({ to: "/auth/verify-email", search: { returnTo: search.returnTo } });
      }
    },
    onError: (error: unknown) => {
      toast.error("Verification failed", {
        description: getFirebaseErrorMessage(error),
      });
    },
  });

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (mode === "resetPassword") {
      void router.navigate({
        to: "/auth/reset-password",
        search: { oobCode: oobCode || undefined, returnTo: search.returnTo },
      });
      return;
    }

    if (mode === "verifyEmail" || oobCode || mode === "") {
      verifyMutation.mutate(oobCode || null);
    }
    // Intentionally run once on mount for the inbound email link.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only email action handler
  }, []);

  const unknownAction = Boolean(mode && mode !== "verifyEmail" && mode !== "resetPassword");

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-base-300 bg-base-100/90 p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <AppConfig.icon className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Finishing up</h1>
            <p className="text-sm text-base-content/60">
              {verifyMutation.isPending
                ? "Confirming your email…"
                : verifyMutation.isError || unknownAction
                  ? "Something went wrong"
                  : "Redirecting…"}
            </p>
          </div>
        </div>

        {verifyMutation.isError || unknownAction ? (
          <p className="text-center text-sm text-base-content/70">
            <Link
              to="/auth/verify-email"
              search={{ returnTo: search.returnTo }}
              className="link link-primary"
            >
              Back to verification
            </Link>
            {" · "}
            <Link to="/auth" search={{ returnTo: search.returnTo }} className="link link-primary">
              Sign in
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
