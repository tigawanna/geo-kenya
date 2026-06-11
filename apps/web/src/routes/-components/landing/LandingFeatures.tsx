import { landingCapabilities } from "@/content/landing";

export function LandingFeatures() {
  return (
    <section
      id="capabilities"
      data-test="landing-capabilities"
      className="mx-auto max-w-360 scroll-mt-14 border-x border-border/50 pb-24"
    >
      <div className="px-8 pt-24 pb-12 md:px-16">
        <h2 className="text-3xl font-semibold tracking-tight text-base-content md:text-4xl">
          {landingCapabilities.heading}
        </h2>
        <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">
          {landingCapabilities.description}
        </p>
      </div>

      <div className="mx-8 overflow-hidden border border-border md:mx-16">
        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {landingCapabilities.steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="group relative p-8 transition-colors hover:bg-neutral/50 lg:p-12"
              >
                <div className="absolute top-4 right-4 font-mono text-xs text-base-content/20 transition-colors group-hover:text-base-content/40">
                  {step.label}
                </div>
                <Icon className="mb-10 size-7 text-base-content/30 transition-colors group-hover:text-primary" />
                <h3 className="mb-4 text-xl font-semibold tracking-tight text-balance text-base-content md:text-2xl">
                  {step.title}
                </h3>
                <p className="max-w-[35ch] text-sm leading-relaxed text-pretty text-muted-foreground md:text-base">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
