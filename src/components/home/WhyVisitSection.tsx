import React from "react";
import { Container } from "@/components/ui/Container";

export const pillars = [
  {
    tag: "QUALITY",
    headline: "Thoughtfully prepared drinks and food.",
    description:
      "From calibrated grind sizes and mineralized brewing water to scratch-baked morning pastries, every offering is approached with intentional craft.",
    numeral: "01",
  },
  {
    tag: "ATMOSPHERE",
    headline: "A space designed to feel comfortable and inviting.",
    description:
      "Acoustically softened corners, warm natural timber, filtered natural sunlight, and a tranquil courtyard tailored for slow contemplation.",
    numeral: "02",
  },
  {
    tag: "PEOPLE",
    headline: "Good coffee is better when shared.",
    description:
      "Baristas who love their trade and guests who appreciate good conversation. Hospitality centered around human warmth, never rushed transactions.",
    numeral: "03",
  },
  {
    tag: "COMMUNITY",
    headline: "A place for Kaduwela to meet, connect and spend time.",
    description:
      "An enduring neighborhood anchor where creative work happens, friends reconnect, and locals can experience world-class coffee standards close to home.",
    numeral: "04",
  },
];

export const WhyVisitSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-warm-cream text-espresso border-b border-espresso/10">
      <Container width="wide">
        {/* Editorial Section Header */}
        <div className="max-w-2xl mb-16 sm:mb-24">
          <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
            BRAND VALUES & INTENTION
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-espresso">
            Made for more than coffee.
          </h2>
        </div>

        {/* 4 Pillars in Editorial Asymmetrical Rows with Hairline Dividers */}
        <div className="divide-y divide-espresso/15 border-t border-b border-espresso/15">
          {pillars.map((pillar) => (
            <div
              key={pillar.tag}
              className="py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline group"
            >
              {/* Left Column: Numeral & Tag */}
              <div className="lg:col-span-3 flex items-center justify-between lg:block">
                <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
                  {pillar.tag}
                </span>
                <span className="font-serif italic text-2xl lg:text-3xl text-espresso/30 group-hover:text-muted-coffee transition-colors">
                  {pillar.numeral}
                </span>
              </div>

              {/* Middle Column: Headline */}
              <div className="lg:col-span-5">
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-espresso leading-snug">
                  {pillar.headline}
                </h3>
              </div>

              {/* Right Column: Narrative */}
              <div className="lg:col-span-4">
                <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
