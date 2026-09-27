import React from "react";
import Image from "next/image";
import { signatureCoffees } from "@/data/menu";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const SignatureCoffeeSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-warm-cream text-espresso">
      <Container width="wide">
        <SectionHeading
          align="asymmetrical"
          eyebrow="THE SIGNATURE"
          title="A cup worth slowing down for."
          subtitle="From the first aroma to the final sip, every drink is prepared with care. Discover the coffees and signature drinks that make our café worth coming back to."
        />

        {/* Editorial Composition: 4 Featured Signature Drinks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-16">
          {signatureCoffees.map((drink, index) => (
            <div
              key={drink.id}
              className={`flex flex-col group ${
                index % 2 === 1 ? "lg:translate-y-8" : ""
              } transition-transform duration-500`}
            >
              {/* Image Frame with Editorial Ratio & Fine Border */}
              <div className="relative aspect-[3/4] overflow-hidden bg-espresso/5 mb-6 border border-espresso/15">
                <Image
                  src={drink.image}
                  alt={drink.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 bg-espresso/80 backdrop-blur-xs text-warm-cream text-[9px] font-sans uppercase tracking-[0.2em] px-2.5 py-1">
                  0{index + 1} / {drink.tagline}
                </span>
              </div>

              {/* Editorial Typography & Content */}
              <div className="flex flex-col flex-1 justify-between pt-2">
                <div>
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-serif text-2xl text-espresso font-normal tracking-tight group-hover:text-muted-coffee transition-colors">
                      {drink.name}
                    </h3>
                    <span className="font-sans text-xs tracking-wider text-muted-coffee font-medium whitespace-nowrap">
                      {drink.pricePlaceholder}
                    </span>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-espresso/70 leading-relaxed font-light mb-4">
                    {drink.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-espresso/10 flex items-center justify-between text-[11px] font-sans text-muted-coffee">
                  <span className="italic font-serif">{drink.notes}</span>
                  <span className="text-[10px] tracking-widest uppercase text-muted-gold font-medium">
                    CALIBRATED
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Full Menu */}
        <div className="mt-20 lg:mt-28 text-center pt-8 border-t border-espresso/10">
          <Button variant="primary" size="lg" href="/menu">
            VIEW FULL MENU
          </Button>
        </div>
      </Container>
    </section>
  );
};
