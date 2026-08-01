import { FLAG_STEP_ACCENTS, FlagHairline } from "@/components/ui/flag-accents";
import { Reveal } from "@/components/ui/reveal";
import { landingCapabilities } from "@/content/landing";

export function LandingFeatures() {
  return (
    <section id="capabilities" data-test="landing-capabilities" className="scroll-mt-20">
      <FlagHairline className="h-px opacity-80" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-5 inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.14em] text-flag-red uppercase">
            <span className="size-1.5 rounded-full bg-flag-red" />
            How it works
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-balance text-base-content">
            {landingCapabilities.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-[36rem] text-pretty text-muted-foreground">
            {landingCapabilities.description}
          </p>
        </Reveal>

        <div className="mx-auto mt-20 max-w-3xl divide-y divide-border/40 border-y border-border/40">
          {landingCapabilities.steps.map((step, index) => {
            const Icon = step.icon;
            const accent = FLAG_STEP_ACCENTS[index % FLAG_STEP_ACCENTS.length];
            return (
              <Reveal
                key={step.id}
                delay={index * 80}
                className="relative grid gap-4 py-10 md:grid-cols-[4rem_1fr] md:gap-8"
              >
                <span className={`absolute top-0 left-0 h-full w-0.5 md:w-1 ${accent.bar}`} />
                <div className="flex items-start gap-3 pl-3 md:block md:pl-4">
                  <span className={`font-display text-2xl ${accent.text}`}>{step.id}</span>
                  <Icon className={`mt-1 size-4 md:mt-3 md:hidden ${accent.text}`} />
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className={`hidden size-8 items-center justify-center rounded-md md:inline-flex ${accent.soft}`}
                    >
                      <Icon className={`size-4 ${accent.text}`} />
                    </span>
                    <h3 className="text-lg font-medium tracking-tight text-base-content">
                      {step.title}
                    </h3>
                  </div>
                  <p className="max-w-[40rem] text-[15px] leading-relaxed text-muted-foreground">
                    {step.description}
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
