import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { storyData } from "@/data/story";
import { Container } from "@/components/ui/Container";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Button } from "@/components/ui/Button";
import { BrewRatioCalculator } from "@/components/coffee/BrewRatioCalculator";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "The beginning, the coffee, the space, and the team behind our specialty coffee destination in Kaduwela, Sri Lanka.",
};

export default function StoryPage() {
  return (
    <div className="pt-28 pb-24 bg-warm-cream min-h-screen text-espresso">
      {/* Editorial Hero */}
      <section className="py-16 sm:py-24 border-b border-espresso/15">
        <Container width="wide">
          <div className="max-w-3xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              ORIGINS & PHILOSOPHY
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-espresso mb-6">
              {storyData.heroHeading}
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-espresso/75 font-light italic leading-snug">
              &ldquo;{storyData.heroSubtitle}&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Chapters: THE BEGINNING, THE COFFEE, THE SPACE, THE PEOPLE */}
      <div className="space-y-28 py-20 sm:py-28">
        {storyData.chapters.map((chapter, index) => {
          const isEven = index % 2 === 1;

          return (
            <section key={chapter.id}>
              <Container width="wide">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                  {/* Visual Frame */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <ImageReveal
                      src={chapter.image}
                      alt={chapter.alt}
                      aspectRatio="portrait"
                      caption={chapter.caption}
                      eyebrow={chapter.tag}
                    />
                  </div>

                  {/* Narrative Content */}
                  <div
                    className={`lg:col-span-6 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    } flex flex-col items-start`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium">
                        {chapter.tag}
                      </span>
                      <span className="w-8 h-px bg-muted-gold/40" />
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-espresso mb-6">
                      {chapter.title}
                    </h2>

                    <div className="space-y-4 font-sans text-sm sm:text-base text-espresso/75 leading-relaxed font-light mb-8">
                      {chapter.copy.map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="w-12 h-px bg-espresso/20" />
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>

      {/* Interactive Brew Calibration Ritual */}
      <section className="pb-28">
        <Container width="wide">
          <BrewRatioCalculator />
        </Container>
      </section>

      {/* OUR VALUES Section */}
      <section className="py-24 sm:py-32 bg-espresso text-warm-cream border-t border-espresso">
        <Container width="wide">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-gold font-medium block mb-4">
              FOUNDATIONAL PILLARS
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-warm-cream">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 divide-y sm:divide-y-0 sm:divide-x divide-warm-cream/10">
            {storyData.values.map((val, idx) => (
              <div
                key={val.name}
                className={`pt-6 sm:pt-0 ${idx > 0 ? "sm:pl-8 lg:pl-10" : ""}`}
              >
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold block mb-2">
                  {val.eyebrow}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-warm-cream mb-3 font-normal">
                  {val.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-warm-cream/70 font-light leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-warm-cream/15 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-serif text-xl sm:text-2xl text-warm-cream/80 italic font-light">
              &ldquo;{siteConfig.supportingTagline}&rdquo;
            </p>
            <Button variant="gold" size="md" href="/visit">
              COME VISIT US
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
