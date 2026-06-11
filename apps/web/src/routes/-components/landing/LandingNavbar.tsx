import { landingNav } from "@/content/landing";
import { useTheme } from "@/lib/tanstack/router/use-theme";
import { AppConfig } from "@/utils/system";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { lazy, Suspense, useState } from "react";

const DashboardLink = lazy(() => import("./LandingDashboardLink"));

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, updateTheme } = useTheme();
  const Icon = AppConfig.icon;

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      try {
        document.startViewTransition(() => updateTheme(newTheme));
        return;
      } catch {
        updateTheme(newTheme);
        return;
      }
    }
    updateTheme(newTheme);
  }

  return (
    <header
      data-test="landing-navbar"
      className="sticky top-0 z-50 border-b border-border/50 bg-base-100/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 max-w-360 items-center justify-between border-x border-border/50">
        <Link to="/" className="flex h-full items-center gap-2 border-r border-border/50 px-5">
          <Icon className="size-5 text-primary" />
          <span className="font-mono text-xs font-bold tracking-widest text-base-content uppercase">
            {AppConfig.wordmark}
            <span className="text-primary">.</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center gap-6 border-r border-border/50 px-6 font-mono text-xs text-muted-foreground md:flex">
          <div className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            <span>{landingNav.status}</span>
          </div>
        </div>

        <div className="flex h-full items-center">
          <button
            onClick={toggleTheme}
            className="hidden h-full border-l border-border/50 px-4 font-mono text-xs text-muted-foreground transition-colors hover:text-base-content sm:block"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "[ Dark ]" : "[ Light ]"}
          </button>

          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hidden h-full items-center border-l border-border/50 px-4 font-mono text-xs text-muted-foreground transition-colors hover:text-base-content md:flex"
            >
              [ {item.label} ]
            </a>
          ))}

          <Suspense
            fallback={
              <Link
                to="/auth"
                search={{ returnTo: "/dashboard" }}
                className="flex h-full items-center bg-primary px-6 font-mono text-xs tracking-widest text-primary-content uppercase transition-opacity hover:opacity-90"
              >
                Get Started →
              </Link>
            }
          >
            <DashboardLink />
          </Suspense>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-full items-center border-l border-border/50 px-4 text-base-content md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="space-y-3 border-t border-border/50 bg-base-100/95 p-6 font-mono text-xs backdrop-blur-xl md:hidden">
          <button
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            className="block text-muted-foreground transition-colors hover:text-base-content"
          >
            {theme === "light" ? "[ Dark mode ]" : "[ Light mode ]"}
          </button>
          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-muted-foreground transition-colors hover:text-base-content"
            >
              [ {item.label} ]
            </a>
          ))}
          <Link
            to="/auth"
            search={{ returnTo: pathname }}
            onClick={() => setMobileOpen(false)}
            className="mt-3 block bg-primary px-4 py-2 text-center tracking-widest text-primary-content uppercase"
          >
            Get Started →
          </Link>
        </div>
      ) : null}
    </header>
  );
}
