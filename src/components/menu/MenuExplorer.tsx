"use client";

import React, { useState } from "react";
import Image from "next/image";
import { menuCategories, menuCategoriesList, MenuItem, MenuCategoryType } from "@/data/menu";
import { Container } from "@/components/ui/Container";
import { Flame, Leaf, Sparkles } from "lucide-react";

export const MenuExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryType | "all">("all");
  const [filterTag, setFilterTag] = useState<"all" | "popular" | "vegetarian">("all");

  const displayedCategories =
    activeCategory === "all"
      ? menuCategories
      : menuCategories.filter((cat) => cat.id === activeCategory);

  const filterItem = (item: MenuItem) => {
    if (filterTag === "popular") return item.isPopular;
    if (filterTag === "vegetarian") return item.isVegetarian;
    return true;
  };

  return (
    <div>
      {/* Category Navigation Bar - Sticky on scroll */}
      <div className="sticky top-[72px] z-30 bg-[#F5F0E8]/96 backdrop-blur-md border-y border-espresso/15 py-3 shadow-[0_2px_8px_rgba(27,20,16,0.03)]">
        <Container width="wide">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category tabs */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`text-xs font-sans uppercase tracking-[0.18em] px-3.5 py-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
                  activeCategory === "all"
                    ? "bg-espresso text-warm-cream border-espresso font-medium"
                    : "bg-transparent text-espresso/70 border-espresso/20 hover:border-espresso hover:text-espresso"
                }`}
              >
                ALL OFFERINGS
              </button>
              {menuCategoriesList.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-xs font-sans uppercase tracking-[0.18em] px-3.5 py-1.5 whitespace-nowrap transition-colors cursor-pointer border ${
                      isActive
                        ? "bg-espresso text-warm-cream border-espresso font-medium"
                        : "bg-transparent text-espresso/70 border-espresso/20 hover:border-espresso hover:text-espresso"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Dietary / Preference Quick Toggles */}
            <div className="flex items-center gap-2 text-xs font-sans self-end sm:self-auto shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-muted-coffee hidden sm:inline">
                Filter:
              </span>
              <button
                type="button"
                onClick={() =>
                  setFilterTag((prev) => (prev === "popular" ? "all" : "popular"))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer border ${
                  filterTag === "popular"
                    ? "bg-muted-gold text-espresso border-muted-gold font-medium"
                    : "border-espresso/15 text-espresso/60 hover:text-espresso"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Popular
              </button>
              <button
                type="button"
                onClick={() =>
                  setFilterTag((prev) => (prev === "vegetarian" ? "all" : "vegetarian"))
                }
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer border ${
                  filterTag === "vegetarian"
                    ? "bg-muted-coffee text-warm-cream border-muted-coffee font-medium"
                    : "border-espresso/15 text-espresso/60 hover:text-espresso"
                }`}
              >
                <Leaf className="w-3 h-3" />
                Vegetarian
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Menu Categories & Items List */}
      <Container width="wide" className="py-16 sm:py-20">
        <div className="space-y-24">
          {displayedCategories.map((category, catIdx) => {
            const visibleItems = category.items.filter(filterItem);
            if (visibleItems.length === 0) return null;

            return (
              <section
                key={category.id}
                id={category.id}
                className="scroll-mt-36"
              >
                {/* Category Header */}
                <div className="border-b border-espresso/15 pb-4 mb-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold block mb-1">
                      0{catIdx + 1} / {category.subtitle}
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl text-espresso font-normal">
                      {category.name}
                    </h2>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-espresso/65 max-w-md font-light">
                    {category.description}
                  </p>
                </div>

                {/* Items Grid with Editorial Photography & Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                  {visibleItems.map((item) => (
                    <article
                      key={item.id}
                      className="group flex flex-col sm:flex-row gap-5 pb-8 border-b border-dashed border-espresso/15 items-start"
                    >
                      {/* Image Thumbnail Frame */}
                      {item.image && (
                        <div className="relative w-full sm:w-28 sm:h-28 aspect-square shrink-0 overflow-hidden bg-espresso/5 border border-espresso/15">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 100vw, 112px"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                          />
                        </div>
                      )}

                      {/* Content & Details */}
                      <div className="flex-1 flex flex-col justify-between w-full">
                        <div>
                          <div className="flex items-baseline justify-between gap-4 mb-1.5">
                            <h3 className="font-serif text-xl sm:text-2xl text-espresso font-normal group-hover:text-muted-coffee transition-colors">
                              {item.name}
                            </h3>
                            <span className="font-sans text-xs tracking-wider text-muted-coffee font-medium whitespace-nowrap">
                              {item.price}
                            </span>
                          </div>

                          <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light leading-relaxed mb-3">
                            {item.description}
                          </p>
                        </div>

                        {/* Badges / Dietary Tags */}
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans uppercase tracking-widest mt-auto">
                          {item.isPopular && (
                            <span className="inline-flex items-center gap-1 text-muted-gold font-medium">
                              <Sparkles className="w-3 h-3" />
                              Popular
                            </span>
                          )}
                          {item.isVegetarian && (
                            <span className="inline-flex items-center gap-1 text-muted-coffee">
                              <Leaf className="w-3 h-3" />
                              Vegetarian
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="inline-flex items-center gap-1 text-[#a6422d]">
                              <Flame className="w-3 h-3" />
                              Spicy Note
                            </span>
                          )}
                          {item.notes && (
                            <span className="text-espresso/50 italic font-serif lowercase ml-auto text-xs">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Dietary accommodations notice */}
        <div className="mt-24 p-8 border border-espresso/15 bg-soft-beige/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-espresso mb-1">
              Dietary Preferences & Allergens
            </h3>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light leading-relaxed max-w-xl">
              Oat, almond, and soy dairy alternatives are readily available. Please inform our baristas of any sensitivities when ordering.
            </p>
          </div>
          <span className="text-xs font-sans uppercase tracking-[0.18em] text-muted-coffee">
            Freshly Prepared Daily
          </span>
        </div>
      </Container>
    </div>
  );
};
