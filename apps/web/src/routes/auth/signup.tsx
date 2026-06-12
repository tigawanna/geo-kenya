import { isAdminUser } from "@/data-access-layer/auth/viewer";
import { AppConfig } from "@/utils/system";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { SignupComponent } from "./-components/SignupComponent";

const searchparams = z.object({
  returnTo: z.string().default("/dashboard"),
});

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  validateSearch: (search) => searchparams.parse(search),
  beforeLoad: ({ context, search }) => {
    if (isAdminUser(context.viewer?.user)) {
      throw redirect({ to: search.returnTo || "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Sign up` }],
  }),
});

function SignupPage() {
  return <SignupComponent />;
}
