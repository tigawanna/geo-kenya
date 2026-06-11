import { landingReasons } from "@/content/landing";

export function LandingShowcase() {
  return (
    <section
      id="why"
      data-test="landing-showcase"
      className="mx-auto max-w-360 scroll-mt-14 border-x border-border/50 py-24"
    >
      <div className="px-8 md:px-16">
        <div className="mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-base-content md:text-4xl">
            {landingReasons.heading}
          </h2>
          <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">
            {landingReasons.description}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
          {landingReasons.items.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="group flex flex-col gap-4 bg-base-100 p-8 transition-colors hover:bg-neutral/50 lg:p-12"
              >
                <Icon className="size-6 text-primary transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-semibold tracking-tight text-base-content">
                  {reason.title}
                </h3>
                <p className="max-w-[35ch] text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
