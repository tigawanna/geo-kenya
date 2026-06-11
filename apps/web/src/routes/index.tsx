import { KenyaShieldBackdrop } from "@/components/ui/kenya-marks";
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
    <div data-test="landing-page" className="relative min-h-dvh overflow-hidden bg-base-100">
      <KenyaShieldBackdrop className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <LandingNavbar />
        <LandingHero />
        <LandingFeatures />
        <LandingShowcase />
        <LandingCTA />
        <LandingFooter />
      </div>
    </div>
  );
}
