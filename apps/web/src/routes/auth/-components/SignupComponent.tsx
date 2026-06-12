import { viewerqueryOptions } from "@/data-access-layer/auth/viewer";
import { authClient } from "@/lib/better-auth/client";
import { clientEnv } from "@/lib/client-env";
import { AppConfig } from "@/utils/system";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Route } from "../signup";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

type SignupValues = z.infer<typeof signupSchema>;

const googleEnabled = Boolean(import.meta.env.VITE_GOOGLE_AUTH_ENABLED);

export function SignupComponent() {
  const qc = useQueryClient();
  const router = useRouter();
  const { returnTo } = Route.useSearch();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: SignupValues) => {
      const { data, error } = await authClient.signUp.email({
        name: payload.name,
        email: payload.email,
        password: payload.password,
      });
      if (error) throw error;
      return data;
    },
    onError: (error: unknown) => {
      toast.error("Sign up failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
    onSuccess: async () => {
      toast.success("Account created");
      await router.invalidate();
      await qc.fetchQuery(viewerqueryOptions);
      void router.navigate({ to: returnTo || "/dashboard" });
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${clientEnv.VITE_API_URL}${returnTo || "/dashboard"}`,
      });
    },
    onError: (error: unknown) => {
      toast.error("Google sign-in failed", {
        description: error instanceof Error ? error.message : "Unknown error",
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
            <h1 className="text-2xl font-semibold">Create account</h1>
            <p className="text-sm text-base-content/60">{AppConfig.name}</p>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span>Name</span>
          <input type="text" className="input-bordered input w-full" {...form.register("name")} />
        </label>

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
          <span>Password</span>
          <input
            type="password"
            className="input-bordered input w-full"
            autoComplete="new-password"
            {...form.register("password")}
          />
        </label>

        <button type="submit" className="btn w-full btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating account…" : "Sign up"}
        </button>

        {googleEnabled ? (
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
              Continue with Google
            </button>
          </>
        ) : null}

        <p className="text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link to="/auth" search={{ returnTo }} className="link link-primary">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
