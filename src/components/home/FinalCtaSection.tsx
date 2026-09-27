import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="relative py-32 sm:py-44 bg-espresso text-warm-cream overflow-hidden">
      {/* Full-Width Background Cinematic Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2000&auto=format&fit=crop"
          alt="Atmospheric specialty coffee preparation in Kaduwela"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30 brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/80" />
      </div>

      <Container width="default" className="relative z-10 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-gold font-medium mb-6">
            KADUWELA • SRI LANKA
          </span>

          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.04] tracking-tight text-warm-cream mb-6">
            Your next coffee
            <br />
            <span className="italic font-light text-warm-cream/90">
              is waiting.
            </span>
          </h2>

          <p className="font-serif text-xl sm:text-2xl text-warm-cream/80 font-light italic mb-10">
            &ldquo;Come by. Stay awhile.&rdquo;
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button variant="gold" size="lg" href="/menu">
              VIEW MENU
            </Button>
            <Button variant="outline" size="lg" href="/visit#directions">
              GET DIRECTIONS
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
