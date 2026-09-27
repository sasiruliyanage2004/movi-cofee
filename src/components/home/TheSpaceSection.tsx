import React from "react";
import Image from "next/image";
import { spaceAreas } from "@/data/gallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const TheSpaceSection: React.FC = () => {
  const mainFeature = spaceAreas[1]; // The Coffee Bar
  const supportingAreas = [
    spaceAreas[0], // Entrance
    spaceAreas[2], // Seating
    spaceAreas[3], // Interior Details
    spaceAreas[4], // Courtyard Terrace
  ];

  return (
    <section className="py-24 sm:py-32 bg-soft-beige/50 text-espresso border-y border-espresso/10">
      <Container width="wide">
        <SectionHeading
          align="asymmetrical"
          eyebrow="THE SPACE"
          title={
            <>
              Come for the coffee.
              <br />
              <span className="italic font-light">Stay for the atmosphere.</span>
            </>
          }
          subtitle="A warm space in Kaduwela for conversations, quiet work, catch-ups, celebrations and slow afternoons."
        />

        {/* Cinematic Hero Feature for The Space */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-12 mb-12">
          <div className="lg:col-span-8 relative aspect-[16/10] overflow-hidden border border-espresso/15 bg-espresso/5">
            <Image
              src={mainFeature.image}
              alt={mainFeature.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-warm-cream">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold block mb-1">
                Focal Point
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal">
                {mainFeature.name}
              </h3>
              <p className="text-xs sm:text-sm font-sans text-warm-cream/80 font-light mt-1 max-w-md">
                {mainFeature.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-6">
            <div className="p-8 border border-espresso/15 bg-warm-cream">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-coffee block mb-2">
                Spatial Intention
              </span>
              <h4 className="font-serif text-2xl text-espresso mb-3">
                Crafted for Calm
              </h4>
              <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light leading-relaxed mb-6">
                Every corner of our Kaduwela destination offers balanced acoustic levels, natural breeze circulation, and daylight engineered for visual comfort.
              </p>
              <div className="w-12 h-px bg-muted-gold mb-6" />
              <span className="text-[11px] font-sans uppercase tracking-widest text-muted-coffee">
                5 Distinct Spatial Zones
              </span>
            </div>

            <div className="p-8 border border-espresso/15 bg-espresso text-warm-cream">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold block mb-2">
                Hospitality
              </span>
              <p className="font-serif text-xl font-light text-warm-cream leading-snug">
                Quiet study nooks, generous communal tables, and sheltered courtyard seating.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Supporting Areas Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportingAreas.map((area, idx) => (
            <div
              key={area.id}
              className="flex flex-col border border-espresso/15 bg-warm-cream overflow-hidden group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-espresso/5">
                <Image
                  src={area.image}
                  alt={area.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-espresso/80 text-warm-cream text-[9px] font-sans uppercase tracking-[0.2em] px-2 py-0.5">
                  0{idx + 1}
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-serif text-lg text-espresso mb-1">
                    {area.name}
                  </h4>
                  <p className="font-sans text-xs text-espresso/65 font-light leading-relaxed">
                    {area.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button variant="secondary" size="lg" href="/gallery">
            EXPLORE THE GALLERY
          </Button>
        </div>
      </Container>
    </section>
  );
};
