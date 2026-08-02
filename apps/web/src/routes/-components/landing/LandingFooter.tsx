import { FlagHairline } from "@/components/ui/flag-accents";
import { landingFooter, landingNav } from "@/content/landing";
import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <FlagHairline className="h-0.5" />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="text-[15px] font-medium text-base-content">
            Geo<span className="text-flag-red">Kenya</span>
          </p>
          <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
            {AppConfig.description}
          </p>
          <div className="mt-5 flex items-center gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-flag-black ring-1 ring-flag-white/40" />
            <span className="size-1 rounded-full bg-flag-white ring-1 ring-base-content/20" />
            <span className="size-2 rounded-full bg-flag-red-solid" />
            <span className="size-1 rounded-full bg-flag-white ring-1 ring-base-content/20" />
            <span className="size-2 rounded-full bg-flag-green-solid" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7 md:justify-items-end">
          <div>
            <p className="mb-3 text-[11px] tracking-[0.14em] text-flag-green uppercase">Explore</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {landingNav.links.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-flag-green"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11px] tracking-[0.14em] text-flag-red uppercase">Legal</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {landingFooter.legal
                .filter((item) => item.to !== "/data-deletion" || import.meta.env.DEV)
                .map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-muted-foreground transition-colors hover:text-flag-red"
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11px] tracking-[0.14em] text-base-content uppercase">
              Product
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a
                href="#waitlist"
                className="text-muted-foreground transition-colors hover:text-flag-green"
              >
                Waitlist
              </a>
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

      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-[12px] text-muted-foreground/70 md:flex-row md:items-center md:justify-between md:px-10">
          <span>
            © {currentYear} {AppConfig.name}
          </span>
          <span>
            <span className="text-base-content">ward</span>
            {" · "}
            <span className="text-flag-red">constituency</span>
            {" · "}
            <span className="text-flag-green">county</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
