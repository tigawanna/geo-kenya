import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AppConfig } from "@/utils/system";
import { isEmailVerified } from "@/data-access-layer/auth/viewer";
import { SigninComponent } from "./-components/SigninComponent";

const searchparams = z.object({
  returnTo: z.string().default("/dashboard"),
});

export const Route = createFileRoute("/auth/")({
  component: SigninPage,
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
    meta: [{ title: `${AppConfig.name} | Sign in` }],
  }),
});

function SigninPage() {
  return <SigninComponent />;
}
