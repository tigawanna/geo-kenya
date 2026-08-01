import { FlagStripe, KenyaShieldBackdrop } from "@/components/ui/kenya-marks";
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

const LEGAL_LINKS = [
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
  { label: "Data deletion", to: "/data-deletion" as const },
];

export function LegalDocumentLayout({
  title,
  lastUpdated,
  intro,
  sections,
  currentPath,
}: LegalDocumentLayoutProps) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-base-100">
      <KenyaShieldBackdrop className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <header className="border-b border-border/50 bg-base-100/80 backdrop-blur-md">
          <FlagStripe className="h-0.5 w-full" />
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
            <Link
              to="/"
              className="font-display text-sm font-semibold tracking-tight text-base-content transition-colors hover:text-primary"
            >
              {AppConfig.wordmark}
              <span className="text-flag-red">.</span>
              <span className="ml-2 font-sans text-xs font-normal text-muted-foreground">
                {AppConfig.name}
              </span>
            </Link>
            <span className="font-mono text-[11px] text-muted-foreground">
              Updated {lastUpdated}
            </span>
          </div>
        </header>

        <nav
          aria-label="Legal documents"
          className="border-b border-border/40 bg-base-100/60 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-6 py-3">
            {LEGAL_LINKS.map((link) => {
              const active = link.to === currentPath;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    active
                      ? "rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-content"
                      : "rounded-full px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-neutral hover:text-base-content"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <p className="mb-3 font-mono text-[11px] tracking-[0.2em] text-flag-green uppercase">
            Compliance
          </p>
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tighter text-balance text-base-content md:text-5xl">
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
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-base-content"
            >
              ← Back to {AppConfig.name}
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

function LegalSectionBlock({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold tracking-tight text-base-content">
        {heading}
      </h2>
      <p className="max-w-[62ch] leading-relaxed text-pretty text-muted-foreground">{children}</p>
    </section>
  );
}
