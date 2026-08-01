import { FlagStripe } from "@/components/ui/kenya-marks";
import { landingFooter, landingNav } from "@/content/landing";
import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mx-auto max-w-360 border-x border-t border-border/50">
      <FlagStripe className="absolute inset-x-0 top-0 h-0.5" />
      <div className="grid gap-10 px-8 py-14 md:grid-cols-12 md:px-16">
        <div className="md:col-span-5">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-base-content">
            {AppConfig.wordmark}
            <span className="text-flag-red">.</span>
          </Link>
          <p className="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
            {AppConfig.description}
          </p>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            {landingFooter.tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:justify-items-end">
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Explore
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {landingNav.links.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-base-content"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Legal
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {landingFooter.legal.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-muted-foreground transition-colors hover:text-base-content"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              Product
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/dashboard"
                className="text-muted-foreground transition-colors hover:text-base-content"
              >
                Dashboard
              </Link>
              <a
                href={AppConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-base-content"
              >
                GitHub
              </a>
              <a
                href={AppConfig.links.mail}
                className="text-muted-foreground transition-colors hover:text-base-content"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/50 px-8 py-4 text-center font-mono text-[11px] text-muted-foreground/60 md:px-16 md:text-left">
        © {currentYear} {AppConfig.name}
      </div>
    </footer>
  );
}
