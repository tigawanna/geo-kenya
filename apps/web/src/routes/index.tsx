import { createFileRoute } from "@tanstack/react-router";
import {
  LandingCTA,
  LandingFeatures,
  LandingFooter,
  LandingHero,
  LandingNavbar,
  LandingShowcase,
} from "./-components/landing";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  return (
    <div data-test="landing-page" className="min-h-dvh bg-base-100">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingShowcase />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
