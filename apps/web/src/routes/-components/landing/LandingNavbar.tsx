import { FlagHairline, FlagMark } from "@/components/ui/flag-accents";
import { landingNav } from "@/content/landing";
import { useTheme } from "@/lib/tanstack/router/use-theme";
import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, updateTheme } = useTheme();
  const Icon = AppConfig.icon;

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      try {
        document.startViewTransition(() => updateTheme(next));
        return;
      } catch {
        updateTheme(next);
        return;
      }
    }
    updateTheme(next);
  }

  return (
    <header className="sticky top-0 z-50 bg-base-100/85 backdrop-blur-md">
      <FlagHairline />
      <div className="mx-auto flex h-[4.75rem] max-w-6xl items-center justify-between border-b border-border/40 px-6 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <Icon className="size-4 text-flag-green" />
          <span className="text-[15px] font-medium tracking-tight text-base-content">
            Geo<span className="text-flag-red">Kenya</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-flag-green"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden rounded-md px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-base-content sm:block"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 rounded-md border border-flag-green/35 bg-flag-green-soft px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-base-content transition-colors hover:border-flag-green/60"
          >
            <span>Join waitlist</span>
            <FlagMark className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-md p-2 text-base-content md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="space-y-1 border-b border-border/40 px-6 py-4 md:hidden">
          {landingNav.links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-flag-green-soft hover:text-base-content"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-neutral hover:text-base-content"
          >
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      ) : null}
    </header>
  );
}
