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
          <span className="font-display text-lg font-bold tracking-tight text-base-content">
            {AppConfig.wordmark}
            <span className="text-flag-red">.</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center gap-6 px-6 text-xs text-muted-foreground md:flex">
          <div className="flex items-center gap-2 rounded-full bg-flag-green-soft px-3 py-1.5 text-flag-green">
            <span className="size-1.5 animate-pulse rounded-full bg-flag-red" />
            <span>{landingNav.status}</span>
          </div>
        </div>

        <div className="flex h-full items-center gap-1 pr-2">
          <button
            onClick={toggleTheme}
            className="hidden rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-neutral hover:text-base-content sm:block"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>

          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hidden items-center rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-neutral hover:text-base-content md:flex"
            >
              {item.label}
            </a>
          ))}

          <Suspense
            fallback={
              <Link
                to="/auth"
                search={{ returnTo: "/dashboard" }}
                className="m-2 inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-content shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Get Started →
              </Link>
            }
          >
            <DashboardLink />
          </Suspense>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center rounded-full px-3 py-2 text-base-content md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="space-y-2 border-t border-border/50 bg-base-100/95 p-6 text-sm backdrop-blur-xl md:hidden">
          <button
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            className="block w-full rounded-xl px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-neutral hover:text-base-content"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3 py-2 text-muted-foreground transition-colors hover:bg-neutral hover:text-base-content"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/auth"
            search={{ returnTo: pathname }}
            onClick={() => setMobileOpen(false)}
            className="mt-2 block rounded-full bg-primary px-4 py-2.5 text-center font-medium text-primary-content"
          >
            Get Started →
          </Link>
        </div>
      ) : null}
    </header>
  );
}
