"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signatureCoffees, SignatureDrink } from "@/data/menu";
import { Container } from "@/components/ui/Container";
import { Sparkles, Compass, ArrowRight } from "lucide-react";

export const CoffeeMatcher: React.FC = () => {
  const [temperature, setTemperature] = useState<"warm" | "chilled">("warm");
  const [flavor, setFlavor] = useState<"sweet" | "bold" | "bright">("sweet");

  // Recommendation engine
  const getRecommendation = (): SignatureDrink => {
    if (temperature === "chilled") {
      if (flavor === "bright") {
        return signatureCoffees[2]; // Cold Brew
      }
      return signatureCoffees[1]; // Spanish Latte (Iced)
    } else {
      if (flavor === "bold") {
        return signatureCoffees[3]; // Cappuccino / Espresso
      }
      return signatureCoffees[0]; // Signature Latte
    }
  };

  const recommendedDrink = getRecommendation();

  return (
    <section className="py-24 sm:py-32 bg-soft-beige/60 text-espresso border-b border-espresso/15">
      <Container width="wide">
        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3 text-muted-gold">
            <Compass className="w-4 h-4" />
            <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-muted-coffee font-medium">
              SENSORY GUIDE • COFFEE MATCH
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-espresso mb-4">
            Find your ideal cup today.
          </h2>
          <p className="font-sans text-sm sm:text-base text-espresso/70 font-light leading-relaxed">
            Select your preferred temperature and tasting character to discover the drink crafted for your exact mood.
          </p>
        </div>

        {/* Interactive Matcher Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Step 1: Temperature */}
            <div className="p-6 sm:p-8 bg-warm-cream border border-espresso/15">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-gold font-medium block mb-3">
                01 / TEMPERATURE PREFERENCE
              </span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTemperature("warm")}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    temperature === "warm"
                      ? "border-espresso bg-espresso text-warm-cream shadow-sm"
                      : "border-espresso/20 bg-warm-cream text-espresso hover:border-espresso/50"
                  }`}
                >
                  <span className="font-serif text-lg block mb-0.5">
                    Warm & Velvety
                  </span>
                  <span className={`text-[10px] font-sans uppercase tracking-wider ${
                    temperature === "warm" ? "text-warm-cream/70" : "text-espresso/60"
                  }`}>
                    Steamed microfoam
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTemperature("chilled")}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    temperature === "chilled"
                      ? "border-espresso bg-espresso text-warm-cream shadow-sm"
                      : "border-espresso/20 bg-warm-cream text-espresso hover:border-espresso/50"
                  }`}
                >
                  <span className="font-serif text-lg block mb-0.5">
                    Chilled & Refreshing
                  </span>
                  <span className={`text-[10px] font-sans uppercase tracking-wider ${
                    temperature === "chilled" ? "text-warm-cream/70" : "text-espresso/60"
                  }`}>
                    Poured over hand-cut ice
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Flavor Profile */}
            <div className="p-6 sm:p-8 bg-warm-cream border border-espresso/15">
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-gold font-medium block mb-3">
                02 / DESIRED FLAVOUR PROFILE
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFlavor("sweet")}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    flavor === "sweet"
                      ? "border-espresso bg-espresso text-warm-cream"
                      : "border-espresso/20 bg-warm-cream text-espresso hover:border-espresso/50"
                  }`}
                >
                  <span className="font-serif text-base block mb-0.5">
                    Sweet & Silky
                  </span>
                  <span className={`text-[9px] font-sans uppercase tracking-wider ${
                    flavor === "sweet" ? "text-warm-cream/70" : "text-espresso/60"
                  }`}>
                    Honey & Caramel
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlavor("bold")}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    flavor === "bold"
                      ? "border-espresso bg-espresso text-warm-cream"
                      : "border-espresso/20 bg-warm-cream text-espresso hover:border-espresso/50"
                  }`}
                >
                  <span className="font-serif text-base block mb-0.5">
                    Bold & Focused
                  </span>
                  <span className={`text-[9px] font-sans uppercase tracking-wider ${
                    flavor === "bold" ? "text-warm-cream/70" : "text-espresso/60"
                  }`}>
                    Pure Cocoa & Body
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFlavor("bright")}
                  className={`p-4 text-left border transition-all cursor-pointer ${
                    flavor === "bright"
                      ? "border-espresso bg-espresso text-warm-cream"
                      : "border-espresso/20 bg-warm-cream text-espresso hover:border-espresso/50"
                  }`}
                >
                  <span className="font-serif text-base block mb-0.5">
                    Crisp & Clean
                  </span>
                  <span className={`text-[9px] font-sans uppercase tracking-wider ${
                    flavor === "bright" ? "text-warm-cream/70" : "text-espresso/60"
                  }`}>
                    Stone Fruit & Stone
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Drink Card Stage */}
          <div className="lg:col-span-6">
            <div className="p-8 sm:p-10 bg-warm-cream border border-espresso/20 shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Gold Recommendation Tag */}
              <div className="flex items-center justify-between pb-4 border-b border-espresso/15 mb-6">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.2em] text-muted-gold font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your Curated Recommendation
                </span>
                <span className="text-[10px] font-sans uppercase tracking-wider text-muted-coffee">
                  {recommendedDrink.notes}
                </span>
              </div>

              {/* Photo & Details Side-by-Side */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                <div className="relative w-36 h-36 shrink-0 aspect-square border border-espresso/15 overflow-hidden">
                  <Image
                    src={recommendedDrink.image}
                    alt={recommendedDrink.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted-coffee">
                    {recommendedDrink.tagline}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal my-1">
                    {recommendedDrink.name}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light leading-relaxed mb-3">
                    {recommendedDrink.description}
                  </p>
                  <span className="font-sans text-xs text-muted-coffee font-medium">
                    {recommendedDrink.pricePlaceholder}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t border-dashed border-espresso/15 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs font-serif italic text-espresso/60">
                  Prepared fresh to order in Kaduwela
                </span>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-[0.18em] font-medium text-espresso hover:text-muted-coffee transition-colors"
                >
                  View Full Menu <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
