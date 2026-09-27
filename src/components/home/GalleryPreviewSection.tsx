"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

type CategoryFilter = "all" | "coffee" | "food" | "space" | "people";

export const GalleryPreviewSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "coffee", label: "COFFEE" },
    { id: "food", label: "FOOD" },
    { id: "space", label: "SPACE" },
    { id: "people", label: "PEOPLE" },
  ];

  const filteredImages =
    selectedCategory === "all"
      ? galleryItems
      : galleryItems.filter((img) => img.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev !== null ? (prev + 1) % filteredImages.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev !== null
            ? (prev - 1 + filteredImages.length) % filteredImages.length
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, filteredImages.length]);

  return (
    <section className="py-24 sm:py-32 bg-warm-cream text-espresso">
      <Container width="wide">
        <SectionHeading
          align="asymmetrical"
          eyebrow="VISUAL JOURNAL"
          title="A glimpse into our space."
          subtitle="Explore the craft, the food, the geometry, and the people that define our daily coffee ritual."
        />

        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-4 mb-12 border-b border-espresso/15">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveImageIndex(null);
                }}
                className={`text-xs font-sans uppercase tracking-[0.2em] pb-2 transition-colors cursor-pointer ${
                  isActive
                    ? "text-espresso font-semibold border-b-2 border-muted-gold"
                    : "text-espresso/50 hover:text-espresso"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => setActiveImageIndex(index)}
              className="group relative cursor-pointer overflow-hidden border border-espresso/15 bg-espresso/5"
            >
              <div
                className={`relative w-full ${
                  image.aspectRatio === "portrait"
                    ? "aspect-[3/4]"
                    : image.aspectRatio === "landscape"
                    ? "aspect-[16/10]"
                    : "aspect-square"
                }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Hover overlay with detail & open indicator */}
                <div className="absolute inset-0 bg-espresso/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-warm-cream">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold">
                    {image.category}
                  </span>
                  <div>
                    <h4 className="font-serif text-xl mb-1">{image.title}</h4>
                    <p className="text-xs font-sans text-warm-cream/80 font-light">
                      {image.caption}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-gold uppercase tracking-widest font-sans mt-2">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Image</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button variant="secondary" size="lg" href="/gallery">
            VIEW FULL GALLERY
          </Button>
        </div>
      </Container>

      {/* Lightbox Modal */}
      {activeImageIndex !== null && filteredImages[activeImageIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 bg-espresso/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between border-b border-warm-cream/15 pb-4">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-gold">
              {filteredImages[activeImageIndex].category} • 0{activeImageIndex + 1} / 0{filteredImages.length}
            </span>
            <button
              onClick={() => setActiveImageIndex(null)}
              aria-label="Close Lightbox"
              className="p-2 text-warm-cream/70 hover:text-warm-cream transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Lightbox Image Stage */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={() =>
                setActiveImageIndex(
                  (prev) => (prev! - 1 + filteredImages.length) % filteredImages.length
                )
              }
              aria-label="Previous Image"
              className="absolute left-2 sm:left-4 z-10 p-3 bg-espresso/70 border border-warm-cream/20 text-warm-cream hover:border-warm-cream transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Current Image */}
            <div className="relative max-w-4xl max-h-[70vh] w-full h-full aspect-[4/3]">
              <Image
                src={filteredImages[activeImageIndex].src}
                alt={filteredImages[activeImageIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() =>
                setActiveImageIndex((prev) => (prev! + 1) % filteredImages.length)
              }
              aria-label="Next Image"
              className="absolute right-2 sm:right-4 z-10 p-3 bg-espresso/70 border border-warm-cream/20 text-warm-cream hover:border-warm-cream transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Footer Caption */}
          <div className="border-t border-warm-cream/15 pt-4 text-center max-w-xl mx-auto">
            <h4 className="font-serif text-xl sm:text-2xl text-warm-cream font-normal mb-1">
              {filteredImages[activeImageIndex].title}
            </h4>
            <p className="font-sans text-xs sm:text-sm text-warm-cream/70 font-light">
              {filteredImages[activeImageIndex].caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
