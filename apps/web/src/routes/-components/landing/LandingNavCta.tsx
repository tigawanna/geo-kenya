import { FlagMark } from "@/components/ui/flag-accents";
import { landingHero } from "@/content/landing";
import { Link } from "@tanstack/react-router";

const navLinkClass =
  "inline-flex items-center gap-2 rounded-md border border-flag-green/35 bg-flag-green-soft px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-base-content transition-colors hover:border-flag-green/60";

/** Nav CTA: Get started → dashboard (Play / waitlist CTAs live in the hero). */
export function LandingNavCta() {
  return (
    <Link to="/dashboard" className={navLinkClass}>
      <span>{landingHero.primaryCta}</span>
      <FlagMark className="h-4 w-4" />
    </Link>
  );
}
