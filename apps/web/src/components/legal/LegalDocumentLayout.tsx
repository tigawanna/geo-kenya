import { FlagHairline } from "@/components/ui/flag-accents";
import { AppConfig } from "@/utils/system";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type LegalSection = {
  heading: string;
  body: string;
};

type LegalDocumentLayoutProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: readonly LegalSection[];
  currentPath: "/privacy" | "/terms" | "/data-deletion";
};

const LEGAL_LINKS: {
  label: string;
  to: "/privacy" | "/terms" | "/data-deletion";
  devOnly?: boolean;
}[] = [
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  // DEV-only standalone page; signed-in users use Account for self-serve deletion
  { label: "Data deletion", to: "/data-deletion", devOnly: true },
];

export function LegalDocumentLayout({
  title,
  lastUpdated,
  intro,
  sections,
  currentPath,
}: LegalDocumentLayoutProps) {
  const legalLinks = LEGAL_LINKS.filter((link) => !link.devOnly || import.meta.env.DEV);

  return (
    <div className="min-h-dvh bg-base-100">
      <header className="bg-base-100/85 backdrop-blur-md">
        <FlagHairline className="h-0.5" />
        <div className="mx-auto flex max-w-3xl items-center justify-between border-b border-border/40 px-6 py-5">
          <Link
            to="/"
            className="text-sm font-medium tracking-tight text-base-content transition-colors hover:text-flag-green"
          >
            Geo<span className="text-flag-red">Kenya</span>
          </Link>
          <span className="text-[11px] text-muted-foreground">Updated {lastUpdated}</span>
        </div>
      </header>

      <nav aria-label="Legal documents" className="border-b border-border/40">
        <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-6 py-3">
          {legalLinks.map((link) => {
            const active = link.to === currentPath;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  active
                    ? "rounded-md bg-flag-green-solid px-4 py-1.5 text-xs font-medium text-flag-green-content"
                    : "rounded-md px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-flag-green-soft hover:text-base-content"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="mb-3 text-[11px] tracking-[0.14em] text-flag-green uppercase">Compliance</p>
        <h1 className="mb-4 font-display text-4xl font-normal tracking-[-0.02em] text-balance text-base-content md:text-5xl">
          {title}
        </h1>
        <p className="mb-12 max-w-[62ch] text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">
          {intro}
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <LegalSectionBlock key={section.heading} heading={section.heading}>
              {section.body}
            </LegalSectionBlock>
          ))}
        </div>

        <div className="mt-16 border-t border-border/50 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-flag-green"
          >
            ← Back to {AppConfig.name}
          </Link>
        </div>
      </main>
    </div>
  );
}

function LegalSectionBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-normal tracking-tight text-base-content">
        {heading}
      </h2>
      <p className="max-w-[62ch] leading-relaxed text-pretty text-muted-foreground">{children}</p>
    </section>
  );
}
