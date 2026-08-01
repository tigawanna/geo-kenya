import { FLAG_ACCENTS, KenyaShield } from "@/components/ui/kenya-marks";
import { Squiggle } from "@/components/ui/playful-decor";
import { Reveal } from "@/components/ui/reveal";
import { landingCapabilities } from "@/content/landing";

export function LandingFeatures() {
  const [primary, ...rest] = landingCapabilities.steps;
  const PrimaryIcon = primary?.icon;

  return (
    <section
      id="capabilities"
      data-test="landing-capabilities"
      className="relative mx-auto max-w-360 scroll-mt-14 overflow-hidden border-x border-border/50 pb-24"
    >
      <KenyaShield className="pointer-events-none absolute -top-10 right-6 hidden w-56 opacity-[0.04] lg:block" />

      <Reveal className="px-8 pt-24 pb-12 md:px-16">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-flag-red-soft px-4 py-1.5">
          <span className="size-1.5 rounded-full bg-flag-red" />
          <span className="text-xs font-medium tracking-wide text-flag-red uppercase">
            How it works
          </span>
        </div>
        <div className="relative max-w-3xl">
          <h2 className="font-display text-4xl font-bold tracking-tighter text-balance text-base-content md:text-6xl">
            {landingCapabilities.heading}
          </h2>
          <Squiggle className="mt-3 w-28 text-flag-green/70" />
        </div>
        <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">
          {landingCapabilities.description}
        </p>
      </Reveal>

      <div className="mx-8 grid grid-cols-1 gap-6 md:mx-16 lg:grid-cols-12">
        {primary && PrimaryIcon ? (
          <Reveal className="group relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border bg-base-100 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg lg:col-span-7 lg:min-h-[22rem] lg:p-10">
            <span className={`absolute inset-x-0 top-0 h-1.5 ${FLAG_ACCENTS[0].bar}`} />
            <span
              className={`pointer-events-none absolute top-6 right-6 font-display text-7xl font-bold opacity-10 transition-opacity group-hover:opacity-25 ${FLAG_ACCENTS[0].text}`}
            >
              {primary.id}
            </span>
            <div>
              <div
                className={`mb-8 flex size-14 items-center justify-center rounded-2xl border ${FLAG_ACCENTS[0].border} ${FLAG_ACCENTS[0].soft}`}
              >
                <PrimaryIcon
                  className={`size-7 transition-transform group-hover:scale-110 ${FLAG_ACCENTS[0].text}`}
                />
              </div>
              <div
                className={`mb-3 font-mono text-[11px] tracking-[0.25em] uppercase ${FLAG_ACCENTS[0].text}`}
              >
                {primary.label}
              </div>
              <h3 className="mb-4 max-w-[18ch] font-display text-3xl font-bold tracking-tight text-balance text-base-content md:text-4xl">
                {primary.title}
              </h3>
              <p className="max-w-[42ch] text-base leading-relaxed text-pretty text-muted-foreground">
                {primary.description}
              </p>
            </div>
          </Reveal>
        ) : null}

        <div className="flex flex-col gap-6 lg:col-span-5">
          {rest.map((step, index) => {
            const Icon = step.icon;
            const accent = FLAG_ACCENTS[(index + 1) % FLAG_ACCENTS.length];
            return (
              <Reveal
                key={step.id}
                delay={(index + 1) * 100}
                className="group relative flex flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-border bg-base-100 p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl border ${accent.border} ${accent.soft}`}
                  >
                    <Icon
                      className={`size-5 transition-transform group-hover:scale-110 ${accent.text}`}
                    />
                  </div>
                  <span
                    className={`font-mono text-[11px] tracking-[0.25em] uppercase ${accent.text}`}
                  >
                    {step.label}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-xl font-bold tracking-tight text-base-content">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-pretty text-muted-foreground">
                  {step.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
