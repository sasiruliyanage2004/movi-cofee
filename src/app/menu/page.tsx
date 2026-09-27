import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { MenuExplorer } from "@/components/menu/MenuExplorer";

export const metadata: Metadata = {
  title: "Our Menu",
  description:
    "Explore our complete coffee menu in Kaduwela. Espresso, cold brew, artisanal Ceylon teas, fresh breakfast, and daily baked desserts.",
};

export default function MenuPage() {
  return (
    <div className="pt-28 pb-20 bg-warm-cream min-h-screen text-espresso">
      {/* Hero Header */}
      <section className="py-12 sm:py-16 border-b border-espresso/15">
        <Container width="wide">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              {siteConfig.businessName} • KADUWELA
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-espresso mb-4">
              Our Menu
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-espresso/70 font-light italic">
              &ldquo;Take your time. Choose what feels right.&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Category Explorer & Items */}
      <MenuExplorer />
    </div>
  );
}
