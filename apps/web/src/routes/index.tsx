import { createFileRoute } from "@tanstack/react-router";
import {
  LandingAccess,
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
    <div data-test="landing-page" className="min-h-dvh bg-base-100 text-base-content">
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingShowcase />
      <LandingAccess />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
