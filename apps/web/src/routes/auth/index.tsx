import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AppConfig } from "@/utils/system";
import { isAdminUser } from "@/data-access-layer/auth/viewer";
import { SigninComponent } from "./-components/SigninComponent";

const searchparams = z.object({
  returnTo: z.string().default("/dashboard"),
});

export const Route = createFileRoute("/auth/")({
  component: SigninPage,
  validateSearch: (search) => searchparams.parse(search),
  beforeLoad: ({ context, search }) => {
    if (isAdminUser(context.viewer?.user)) {
      throw redirect({ to: search.returnTo || "/dashboard" });
    }
  },
  head: () => ({
    meta: [{ title: `${AppConfig.name} | Sign in` }],
  }),
});

function SigninPage() {
  return <SigninComponent />;
}
