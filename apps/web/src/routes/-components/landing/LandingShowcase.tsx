import { FLAG_ACCENTS, KenyaOutline } from "@/components/ui/kenya-marks";
import { Reveal } from "@/components/ui/reveal";
import { landingReasons } from "@/content/landing";

export function LandingShowcase() {
  return (
    <section
      id="why"
      data-test="landing-showcase"
      className="relative mx-auto max-w-360 scroll-mt-14 overflow-hidden border-x border-border/50 py-24"
    >
      <KenyaOutline className="pointer-events-none absolute -right-20 bottom-0 w-136 text-base-content opacity-[0.04]" />

      <div className="relative px-8 md:px-16">
        <Reveal className="mb-16 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-xs font-medium tracking-wide text-primary uppercase">
              Why GeoKenya
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold tracking-tighter text-balance text-base-content md:text-6xl">
            {landingReasons.heading}
          </h2>
          <p className="mt-4 max-w-[52ch] text-pretty text-muted-foreground">
            {landingReasons.description}
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {landingReasons.items.map((reason, index) => {
            const Icon = reason.icon;
            const accent = FLAG_ACCENTS[index % FLAG_ACCENTS.length];
            return (
              <Reveal
                key={reason.title}
                delay={index * 120}
                className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-base-100/80 p-8 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg lg:p-10"
              >
                <span className={`absolute inset-x-0 top-0 h-1.5 ${accent.bar}`} />

                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-12 items-center justify-center rounded-2xl border ${accent.border} ${accent.soft}`}
                  >
                    <Icon
                      className={`size-6 transition-transform group-hover:scale-110 ${accent.text}`}
                    />
                  </div>
                  <span className={`font-display text-lg font-bold ${accent.text}`}>
                    0{index + 1}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-tight text-base-content">
                  {reason.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
