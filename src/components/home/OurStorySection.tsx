import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageReveal } from "@/components/ui/ImageReveal";

export const OurStorySection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-soft-beige/40 text-espresso border-y border-espresso/10">
      <Container width="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Column: Large Asymmetrical Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <ImageReveal
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1400&auto=format&fit=crop"
                alt="Atmospheric light and serene timber seating at Kaduwela cafe"
                aspectRatio="portrait"
                caption="Natural materials, quiet light, and unhurried hospitality."
                eyebrow="Our Destination"
              />

              {/* Offset Decorative Accent Badge */}
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-espresso text-warm-cream p-6 border border-warm-cream/15 max-w-[220px] shadow-xl">
                <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-muted-gold block mb-1">
                  Philosophy
                </span>
                <p className="font-serif text-lg leading-snug">
                  A place to slow down in Kaduwela.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-6 flex flex-col items-start lg:pl-6">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              OUR STORY
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-espresso mb-8">
              More than a coffee shop.
            </h2>

            <div className="space-y-6 font-sans text-base sm:text-lg text-espresso/80 leading-relaxed font-light mb-10">
              <p>
                We created {siteConfig.name} as a place to enjoy good coffee without rushing. A place where mornings begin slowly, conversations last a little longer, and an ordinary coffee break can become a memorable moment.
              </p>
              <p>
                Located in Kaduwela, our café brings together thoughtfully prepared drinks, freshly made food and a warm space for friends, families, creatives, students and anyone looking for a moment to pause.
              </p>
            </div>

            <div className="w-16 h-px bg-muted-gold/60 mb-8" />

            <Button variant="primary" size="md" href="/story">
              DISCOVER OUR STORY
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
