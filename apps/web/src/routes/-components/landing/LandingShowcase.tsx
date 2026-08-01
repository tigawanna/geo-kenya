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

        <div className="flex flex-col gap-8">
          {landingReasons.items.map((reason, index) => {
            const Icon = reason.icon;
            const accent = FLAG_ACCENTS[index % FLAG_ACCENTS.length];
            const reverse = index % 2 === 1;
            return (
              <Reveal
                key={reason.title}
                delay={index * 90}
                className={`group grid items-center gap-6 border-y border-border/40 py-8 md:grid-cols-12 md:gap-10 ${
                  reverse ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="md:col-span-4">
                  <div
                    className={`inline-flex size-14 items-center justify-center rounded-2xl border ${accent.border} ${accent.soft}`}
                  >
                    <Icon
                      className={`size-7 transition-transform group-hover:scale-110 ${accent.text}`}
                    />
                  </div>
                  <div
                    className={`mt-4 font-display text-5xl font-bold tracking-tighter ${accent.text}`}
                  >
                    0{index + 1}
                  </div>
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-base-content md:text-3xl">
                    {reason.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-pretty text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
