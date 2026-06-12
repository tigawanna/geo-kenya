import { privacyPolicy } from "@/content/privacy";
import { AppConfig } from "@/utils/system";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: `Privacy Policy · ${AppConfig.name}` },
      {
        name: "description",
        content: `Privacy policy for ${AppConfig.name} — offline geographic reference for Kenya.`,
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-base-100">
      <header className="border-b border-border/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
          <Link
            to="/"
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-base-content"
          >
            ← {AppConfig.wordmark}
            <span className="text-primary">.</span>
          </Link>
          <span className="font-mono text-[11px] text-muted-foreground">
            Updated {privacyPolicy.lastUpdated}
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">{privacyPolicy.title}</h1>
        <p className="mb-10 font-mono text-sm text-muted-foreground">{AppConfig.name}</p>
        <div className="space-y-10">
          {privacyPolicy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-3 text-lg font-medium">{section.heading}</h2>
              <p className="leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
