import { landingFooter, landingNav } from "@/content/landing";
import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-360 border-x border-t border-border/50">
      <div className="flex flex-col items-center justify-between gap-6 px-8 py-12 font-mono text-xs text-muted-foreground md:flex-row md:px-16">
        <Link to="/" className="transition-colors hover:text-base-content">
          {AppConfig.wordmark}
          <span className="text-primary">.</span>
          <span className="ml-2">— {landingFooter.tagline}</span>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-base-content"
            >
              {item.label}
            </a>
          ))}
          <Link to="/privacy" className="transition-colors hover:text-base-content">
            Privacy
          </Link>
          <Link to="/dashboard" className="transition-colors hover:text-base-content">
            Dashboard
          </Link>
        </div>
      </div>
      <div className="border-t border-border/50 px-8 py-4 text-center font-mono text-[11px] text-muted-foreground/60 md:px-16">
        © {currentYear} {AppConfig.name}
      </div>
    </footer>
  );
}
