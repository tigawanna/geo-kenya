import { getFirebaseErrorMessage, sendFirebasePasswordReset } from "@/lib/firebase/email-actions";
import { firebaseClientConfigured } from "@/lib/firebase/client";
import { AppConfig } from "@/utils/system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const searchparams = z.object({
  returnTo: z.string().default("/dashboard"),
});

const forgotSchema = z.object({
  email: z.email(),
});

type ForgotValues = z.infer<typeof forgotSchema>;

export const Route = createFileRoute("/auth/forgot-password")({
  component: ForgotPasswordPage,
  validateSearch: (search) => searchparams.parse(search),
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Forgot password` }],
  }),
});

function ForgotPasswordPage() {
  const { returnTo } = Route.useSearch();
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: async (payload: ForgotValues) => {
      if (!firebaseClientConfigured) {
        throw new Error("Firebase Auth is not configured.");
      }
      await sendFirebasePasswordReset(payload.email);
      return payload.email;
    },
    onSuccess: (email) => {
      setSentTo(email);
      toast.success("Reset email sent");
    },
    onError: (error: unknown) => {
      // Avoid email enumeration: still show a generic success-ish path on some Firebase codes.
      toast.error("Could not send reset email", {
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
            <h1 className="text-2xl font-semibold">Forgot password</h1>
            <p className="text-sm text-base-content/60">We'll email you a reset link</p>
          </div>
        </div>

        {sentTo ? (
          <p className="text-sm text-base-content/70">
            If an account exists for <span className="font-medium">{sentTo}</span>, a reset link is
            on the way. You can close this tab after you open the email.
          </p>
        ) : (
          <label className="flex flex-col gap-1 text-sm">
            <span>Email</span>
            <input
              type="email"
              className="input-bordered input w-full"
              autoComplete="username"
              {...form.register("email")}
            />
          </label>
        )}

        {!sentTo ? (
          <button type="submit" className="btn w-full btn-primary" disabled={mutation.isPending}>
            {mutation.isPending ? "Sending…" : "Send reset link"}
          </button>
        ) : null}

        <p className="text-center text-sm text-base-content/70">
          <Link to="/auth" search={{ returnTo }} className="link link-primary">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
