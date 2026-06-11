import { FLAG_ACCENTS, KenyaShield } from "@/components/ui/kenya-marks";
import { Squiggle } from "@/components/ui/playful-decor";
import { landingCapabilities } from "@/content/landing";

export function LandingFeatures() {
  return (
    <section
      id="capabilities"
      data-test="landing-capabilities"
      className="relative mx-auto max-w-360 scroll-mt-14 overflow-hidden border-x border-border/50 pb-24"
    >
      <KenyaShield className="pointer-events-none absolute -top-10 right-6 hidden w-56 opacity-[0.04] lg:block" />

      <div className="px-8 pt-24 pb-12 md:px-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-flag-red-soft px-4 py-1.5">
          <span className="size-1.5 rounded-full bg-flag-red" />
          <span className="text-xs font-medium tracking-wide text-flag-red uppercase">
            Capabilities
          </span>
        </div>
        <div className="relative max-w-2xl">
          <h2 className="font-display text-4xl font-semibold tracking-tight text-balance text-base-content md:text-5xl">
            {landingCapabilities.heading}
          </h2>
          <Squiggle className="mt-3 w-28 text-primary/70" />
        </div>
        <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">
          {landingCapabilities.description}
        </p>
      </div>

      <div className="mx-8 grid grid-cols-1 gap-6 md:mx-16 md:grid-cols-3">
        {landingCapabilities.steps.map((step, index) => {
          const Icon = step.icon;
          const accent = FLAG_ACCENTS[index % FLAG_ACCENTS.length];
          return (
            <div
              key={step.id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-base-100 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg lg:p-10"
            >
              <span className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />
              <span
                className={`pointer-events-none absolute top-6 right-6 font-display text-6xl font-bold opacity-10 transition-opacity group-hover:opacity-25 ${accent.text}`}
              >
                {step.id}
              </span>

              <div
                className={`mb-8 flex size-14 items-center justify-center rounded-2xl border ${accent.border} ${accent.soft}`}
              >
                <Icon
                  className={`size-7 transition-transform group-hover:scale-110 ${accent.text}`}
                />
              </div>

              <div
                className={`mb-3 font-mono text-[11px] tracking-[0.25em] uppercase ${accent.text}`}
              >
                {step.label}
              </div>
              <h3 className="mb-4 font-display text-xl font-semibold tracking-tight text-balance text-base-content md:text-2xl">
                {step.title}
              </h3>
              <p className="max-w-[35ch] text-sm leading-relaxed text-pretty text-muted-foreground md:text-base">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
