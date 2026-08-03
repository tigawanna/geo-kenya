import { FlagHairline, FlagMark } from "@/components/ui/flag-accents";
import { Reveal } from "@/components/ui/reveal";
import { landingWaitlist } from "@/content/landing";
import { joinWaitlist } from "@/services/waitlist/waitlist.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type WaitlistValues = z.infer<typeof waitlistSchema>;

export function LandingWaitlist() {
  const form = useForm<WaitlistValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: WaitlistValues) => joinWaitlist(values.email, "landing"),
    onError: (error: unknown) => {
      toast.error("Could not join waitlist", {
        description: error instanceof Error ? error.message : "Try again in a moment.",
      });
    },
  });

  const submitted = mutation.isSuccess;
  const alreadyJoined = mutation.data?.alreadyJoined ?? false;

  return (
    <section id="waitlist" data-test="landing-waitlist" className="scroll-mt-20">
      <FlagHairline className="h-px opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.14em] text-flag-green uppercase">
            <span className="size-1.5 rounded-full bg-flag-red" />
            {landingWaitlist.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance text-base-content">
            Join the testing <span className="text-flag-green">waitlist</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[30rem] text-pretty text-muted-foreground">
            {landingWaitlist.description}
          </p>

          <div className="mt-10">
            {submitted ? (
              <div className="overflow-hidden rounded-lg border border-flag-green/30 bg-flag-green-soft px-6 py-8">
                <FlagHairline className="mx-auto mb-5 h-0.5 w-16 rounded-full" />
                <p className="font-display text-2xl text-base-content">
                  {landingWaitlist.successTitle}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {alreadyJoined ? landingWaitlist.alreadyJoinedBody : landingWaitlist.successBody}
                </p>
              </div>
            ) : (
              <form
                onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                className="flex flex-col gap-3 sm:flex-row sm:items-start"
                noValidate
              >
                <div className="flex-1 text-left">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder={landingWaitlist.placeholder}
                    className="w-full rounded-md border border-border bg-base-100 px-4 py-3.5 text-[15px] text-base-content outline-none placeholder:text-muted-foreground/70 focus:border-flag-green/50 focus:ring-2 focus:ring-flag-green/20"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email ? (
                    <p className="mt-1.5 text-sm text-flag-red">
                      {form.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-flag-green-solid px-5 py-3.5 text-[15px] font-semibold whitespace-nowrap text-flag-green-content transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  <span>{mutation.isPending ? "Submitting…" : landingWaitlist.submitLabel}</span>
                  <FlagMark />
                </button>
              </form>
            )}

            {!submitted ? (
              <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                By joining you agree to our{" "}
                <Link
                  to="/privacy"
                  className="text-flag-green underline underline-offset-2 hover:text-base-content"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/terms"
                  className="text-flag-red underline underline-offset-2 hover:text-base-content"
                >
                  Terms
                </Link>
                .
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
