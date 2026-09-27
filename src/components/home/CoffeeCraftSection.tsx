import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export interface CraftStep {
  number: string;
  title: string;
  description: string;
  detail: string;
}

export const craftSteps: CraftStep[] = [
  {
    number: "01",
    title: "SELECT",
    description:
      "Thoughtfully selected coffee beans chosen for their character and flavour.",
    detail: "Origin Terroir & Balance",
  },
  {
    number: "02",
    title: "PREPARE",
    description:
      "Each drink begins with attention to the details that matter.",
    detail: "Micron Grind & Calibration",
  },
  {
    number: "03",
    title: "BREW",
    description:
      "Coffee is brewed with care to bring out its natural character.",
    detail: "Pressure & Temperature Curves",
  },
  {
    number: "04",
    title: "SERVE",
    description:
      "Made fresh and served for the moment you're here to enjoy.",
    detail: "Hand-Crafted Ceramic Presentation",
  },
];

export const CoffeeCraftSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-espresso text-warm-cream">
      <Container width="wide">
        <SectionHeading
          theme="dark"
          align="asymmetrical"
          eyebrow="THE CRAFT"
          title="Every cup has a process."
          subtitle="Precision, consistency, and respect for every bean. From harvest selection to the temperature of our ceramic cups."
        />

        {/* 4 Editorial Steps Horizontal Timeline / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-16 pt-10 border-t border-warm-cream/15">
          {craftSteps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between group pt-4"
            >
              <div>
                {/* Step Number & Eyebrow */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-warm-cream/10">
                  <span className="font-serif text-3xl font-light text-muted-gold">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-warm-cream/40">
                    PHASE {step.number}
                  </span>
                </div>

                <h3 className="font-sans text-xl uppercase tracking-[0.16em] text-warm-cream font-medium mb-3">
                  {step.title}
                </h3>

                <p className="font-serif text-lg sm:text-xl text-warm-cream/80 font-light leading-relaxed mb-6">
                  &ldquo;{step.description}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-dashed border-warm-cream/10">
                <span className="font-sans text-[11px] uppercase tracking-wider text-muted-gold/80 block">
                  {step.detail}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
