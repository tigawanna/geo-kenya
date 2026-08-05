import { createFileRoute } from "@tanstack/react-router";
import {
  LandingCTA,
  LandingFeatures,
  LandingFooter,
  LandingHero,
  LandingNavbar,
  LandingShowcase,
  LandingWaitlist,
} from "./-components/landing";
import { getApiOrigin } from "@/lib/client-env";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  getApiOrigin();
  return (
    <div data-test="landing-page" className="min-h-dvh bg-base-100 text-base-content">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingShowcase />
      <LandingWaitlist />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
