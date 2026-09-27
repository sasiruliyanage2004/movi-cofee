import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { GalleryView } from "@/components/gallery/GalleryView";

export const metadata: Metadata = {
  title: "Visual Gallery",
  description:
    "A visual journal of our coffee craft, freshly prepared food, architectural space, and community in Kaduwela, Sri Lanka.",
};

export default function GalleryPage() {
  return (
    <div className="pt-28 pb-24 bg-warm-cream min-h-screen text-espresso">
      {/* Header */}
      <section className="py-12 sm:py-16 border-b border-espresso/15">
        <Container width="wide">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              {siteConfig.businessName} • VISUAL JOURNAL
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-espresso mb-4">
              A glimpse into our world.
            </h1>
            <p className="font-sans text-base sm:text-lg text-espresso/70 font-light leading-relaxed">
              Quiet daylight corners, balanced extractions, freshly baked pastries, and shared conversations in Kaduwela.
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Gallery with Filters and Lightbox */}
      <GalleryView />
    </div>
  );
}
