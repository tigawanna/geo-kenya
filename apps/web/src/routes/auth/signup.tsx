import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AppConfig } from "@/utils/system";
import { isEmailVerified } from "@/data-access-layer/auth/viewer";
import { SignupComponent } from "./-components/SignupComponent";

const searchparams = z.object({
  returnTo: z.string().default("/dashboard"),
});

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  validateSearch: (search) => searchparams.parse(search),
  beforeLoad: ({ context, search }) => {
    const user = context.viewer?.user;
    if (!user) return;
    if (!isEmailVerified(user)) {
      throw redirect({ to: "/auth/verify-email", search: { returnTo: search.returnTo } });
    }
    throw redirect({ to: search.returnTo || "/dashboard" });
  },
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Sign up` }],
  }),
});

function SignupPage() {
  return <SignupComponent />;
}
