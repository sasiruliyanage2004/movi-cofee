"use client";

import React, { useState } from "react";
import { menuCategories, previewCategories, PreviewCategoryType } from "@/data/menu";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const MenuPreviewSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<PreviewCategoryType>("coffee");

  const currentCategoryData =
    menuCategories.find((cat) => cat.id === activeCategory) || menuCategories[0];

  return (
    <section className="py-24 sm:py-32 bg-warm-cream text-espresso">
      <Container width="wide">
        <SectionHeading
          align="asymmetrical"
          eyebrow="OUR MENU"
          title="Something for every kind of coffee moment."
          subtitle="Whether you crave a sharp, focused espresso, a chilled slow brew, fragrant Ceylon tea, or a freshly baked flaky pastry."
        />

        {/* 6 Category Navigation Tabs */}
        <div className="flex items-center overflow-x-auto pb-4 mb-12 border-b border-espresso/15 gap-4 sm:gap-8 scrollbar-none">
          {previewCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
                className={`relative pb-3 text-xs sm:text-sm font-sans tracking-[0.2em] uppercase font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "text-espresso font-semibold"
                    : "text-espresso/50 hover:text-espresso"
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-muted-gold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Category Description Banner */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-espresso/10">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block">
              {currentCategoryData.subtitle}
            </span>
            <p className="text-xs sm:text-sm font-sans text-espresso/70 font-light mt-1">
              {currentCategoryData.description}
            </p>
          </div>
          <span className="text-[11px] font-sans text-muted-coffee uppercase tracking-widest whitespace-nowrap">
            {currentCategoryData.items.length} Curated Items
          </span>
        </div>

        {/* Items List in Editorial Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {currentCategoryData.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between py-3 border-b border-dashed border-espresso/15 group"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <h4 className="font-serif text-xl sm:text-2xl text-espresso font-normal group-hover:text-muted-coffee transition-colors">
                    {item.name}
                  </h4>
                  <span className="font-sans text-xs tracking-wider text-muted-coffee font-medium whitespace-nowrap">
                    {item.pricePlaceholder}
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.notes && (
                <div className="mt-3 flex items-center justify-between text-[10px] font-sans text-muted-gold tracking-widest uppercase">
                  <span>{item.notes}</span>
                  {item.originPlaceholder && (
                    <span className="italic font-serif text-espresso/50 lowercase">
                      {item.originPlaceholder}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Menu Action */}
        <div className="mt-16 sm:mt-20 text-center">
          <Button variant="primary" size="lg" href="/menu">
            VIEW FULL MENU
          </Button>
        </div>
      </Container>
    </section>
  );
};
