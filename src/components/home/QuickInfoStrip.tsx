import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";

export const QuickInfoStrip: React.FC = () => {
  const items = [
    {
      title: "SPECIALTY COFFEE",
      subtitle: "Freshly prepared with care.",
      number: "01",
    },
    {
      title: "FRESH FOOD",
      subtitle: "Prepared for the moment.",
      number: "02",
    },
    {
      title: siteConfig.location.city.toUpperCase(),
      subtitle: "Your neighbourhood coffee destination.",
      number: "03",
    },
    {
      title: "OPEN DAILY",
      subtitle: siteConfig.contact.openingHoursSummary,
      number: "04",
    },
  ];

  return (
    <section className="bg-espresso text-warm-cream border-y border-warm-cream/15 py-10 sm:py-12">
      <Container width="wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 divide-y sm:divide-y-0 sm:divide-x divide-warm-cream/10">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between pt-6 sm:pt-0 ${
                idx > 0 ? "sm:pl-8 lg:pl-10" : ""
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-sans text-xs uppercase tracking-[0.24em] text-muted-gold font-medium">
                  {item.title}
                </h3>
                <span className="font-serif italic text-xs text-warm-cream/30">
                  {item.number}
                </span>
              </div>
              <p className="font-serif text-lg sm:text-xl text-warm-cream/90 font-light leading-snug">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
