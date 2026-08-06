import { getFirebaseErrorMessage } from "@/lib/firebase/email-actions";
import { firebaseClientConfigured, getFirebaseClientAuth } from "@/lib/firebase/client";
import { AppConfig } from "@/utils/system";
import { extractOobCodeFromUrl } from "better-auth-firebase-auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { confirmPasswordReset } from "firebase/auth";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const searchparams = z.object({
  oobCode: z.string().optional(),
  returnTo: z.string().default("/dashboard"),
});

const resetSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

export const Route = createFileRoute("/auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search) => searchparams.parse(search),
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Reset password` }],
  }),
});

function ResetPasswordPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const oobCode = useMemo(() => search.oobCode || extractOobCodeFromUrl() || "", [search.oobCode]);

  const form = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: async (payload: ResetValues) => {
      if (!firebaseClientConfigured) {
        throw new Error("Firebase Auth is not configured.");
      }
      if (!oobCode) {
        throw new Error("Missing reset code. Open the link from your email again.");
      }
      await confirmPasswordReset(getFirebaseClientAuth(), oobCode, payload.password);
    },
    onSuccess: () => {
      toast.success("Password updated");
      void router.navigate({ to: "/auth", search: { returnTo: search.returnTo } });
    },
    onError: (error: unknown) => {
      toast.error("Could not reset password", {
        description: getFirebaseErrorMessage(error),
      });
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
            <h1 className="text-2xl font-semibold">Choose a new password</h1>
            <p className="text-sm text-base-content/60">Then sign in with it</p>
          </div>
        </div>

        {!oobCode ? (
          <p className="text-sm text-error">
            This page needs a valid reset link. Request a new one from forgot password.
          </p>
        ) : null}

        <label className="flex flex-col gap-1 text-sm">
          <span>New password</span>
          <input
            type="password"
            className="input-bordered input w-full"
            autoComplete="new-password"
            {...form.register("password")}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span>Confirm password</span>
          <input
            type="password"
            className="input-bordered input w-full"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <span className="text-xs text-error">
              {form.formState.errors.confirmPassword.message}
            </span>
          ) : null}
        </label>

        <button
          type="submit"
          className="btn w-full btn-primary"
          disabled={mutation.isPending || !oobCode}
        >
          {mutation.isPending ? "Updating…" : "Update password"}
        </button>

        <p className="text-center text-sm text-base-content/70">
          <Link
            to="/auth/forgot-password"
            search={{ returnTo: search.returnTo }}
            className="link link-primary"
          >
            Request another link
          </Link>
          {" · "}
          <Link to="/auth" search={{ returnTo: search.returnTo }} className="link link-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
