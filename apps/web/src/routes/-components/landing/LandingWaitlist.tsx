import { FlagStripe } from "@/components/ui/kenya-marks";
import { Reveal } from "@/components/ui/reveal";
import { landingWaitlist } from "@/content/landing";
import { joinWaitlist } from "@/services/waitlist/waitlist.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Mail } from "lucide-react";
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
    <section
      id="waitlist"
      data-test="landing-waitlist"
      className="relative mx-auto max-w-360 scroll-mt-14 overflow-hidden border-x border-border/50"
    >
      <FlagStripe withSheen className="absolute inset-x-0 top-0 z-10 h-1" />

      <div className="relative border-t border-border/50 px-8 py-24 md:px-16 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-flag-green-soft px-4 py-1.5">
              <span className="size-1.5 animate-pulse rounded-full bg-flag-red" />
              <span className="text-xs font-medium tracking-wide text-flag-green uppercase">
                {landingWaitlist.eyebrow}
              </span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tighter text-balance text-base-content md:text-6xl">
              {landingWaitlist.heading}
            </h2>
            <p className="mt-4 max-w-[46ch] text-pretty text-muted-foreground md:text-lg">
              {landingWaitlist.description}
            </p>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-6">
            <div className="rounded-[1.75rem] border border-border/70 bg-base-100/80 p-6 shadow-sm backdrop-blur-md md:p-8">
              {submitted ? (
                <div className="flex flex-col items-start gap-4 py-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-flag-green-soft text-flag-green">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold tracking-tight text-base-content">
                      {landingWaitlist.successTitle}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {alreadyJoined
                        ? landingWaitlist.alreadyJoinedBody
                        : landingWaitlist.successBody}
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
                  className="flex flex-col gap-4"
                  noValidate
                >
                  <label className="flex flex-col gap-2">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                      Email
                    </span>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="email"
                        autoComplete="email"
                        placeholder={landingWaitlist.placeholder}
                        className="input-bordered input w-full rounded-2xl border-border bg-base-200/80 py-3 pr-4 pl-11 text-base-content placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        {...form.register("email")}
                      />
                    </div>
                    {form.formState.errors.email ? (
                      <span className="text-sm text-error">
                        {form.formState.errors.email.message}
                      </span>
                    ) : null}
                  </label>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="rounded-full bg-primary px-7 py-3.5 font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:translate-y-0 disabled:opacity-70"
                  >
                    {mutation.isPending ? "Submitting…" : `${landingWaitlist.submitLabel} →`}
                  </button>

                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {landingWaitlist.privacyNote.split("Privacy Policy")[0]}
                    <Link
                      to="/privacy"
                      className="underline underline-offset-2 hover:text-base-content"
                    >
                      Privacy Policy
                    </Link>
                    {" and "}
                    <Link
                      to="/terms"
                      className="underline underline-offset-2 hover:text-base-content"
                    >
                      Terms
                    </Link>
                    {". Unsubscribe anytime."}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
