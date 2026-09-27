"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";
import { Container } from "@/components/ui/Container";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";

type GalleryCategory = "all" | "coffee" | "food" | "space" | "people";

export const GalleryView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Touch swipe tracking refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const filterOptions: { id: GalleryCategory; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "coffee", label: "COFFEE" },
    { id: "food", label: "FOOD" },
    { id: "space", label: "SPACE" },
    { id: "people", label: "PEOPLE" },
  ];

  const visibleImages =
    selectedFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedFilter);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % visibleImages.length : null
        );
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + visibleImages.length) % visibleImages.length
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, visibleImages.length]);

  // Touch swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || lightboxIndex === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next Image
      setLightboxIndex((prev) =>
        prev !== null ? (prev + 1) % visibleImages.length : null
      );
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Previous Image
      setLightboxIndex((prev) =>
        prev !== null
          ? (prev - 1 + visibleImages.length) % visibleImages.length
          : null
      );
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div>
      {/* Category Filter Controls */}
      <div className="sticky top-[72px] z-30 bg-[#F5F0E8]/96 backdrop-blur-md border-y border-espresso/15 py-4">
        <Container width="wide">
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto pb-1 scrollbar-none">
            {filterOptions.map((opt) => {
              const isActive = selectedFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(opt.id);
                    setLightboxIndex(null);
                  }}
                  className={`text-xs font-sans uppercase tracking-[0.2em] pb-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-espresso font-semibold border-b-2 border-muted-gold"
                      : "text-espresso/50 hover:text-espresso"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Masonry / Asymmetric Photography Layout */}
      <Container width="wide" className="py-16 sm:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visibleImages.map((image, idx) => (
            <article
              key={image.id}
              onClick={() => setLightboxIndex(idx)}
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

                {/* Subtle vignette border */}
                <div className="pointer-events-none absolute inset-0 border border-espresso/10" />

                {/* Hover overlay with details */}
                <div className="absolute inset-0 bg-espresso/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-warm-cream">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold">
                    {image.category}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl font-normal mb-1">
                      {image.title}
                    </h3>
                    <p className="text-xs font-sans text-warm-cream/80 font-light">
                      {image.caption}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-gold uppercase tracking-widest font-sans mt-2">
                    <Eye className="w-4 h-4" />
                    <span>View Lightbox</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>

      {/* Fullscreen Accessible Lightbox with Swipe Support */}
      {lightboxIndex !== null && visibleImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Fullscreen View"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-espresso/96 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-warm-cream/15 pb-4">
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-gold">
              {visibleImages[lightboxIndex].category} • 0{lightboxIndex + 1} / 0{visibleImages.length}
            </span>
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
              className="p-2 text-warm-cream/70 hover:text-warm-cream transition-colors cursor-pointer"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Image Stage */}
          <div className="relative flex-1 my-4 flex items-center justify-center">
            {/* Prev Control */}
            <button
              onClick={() =>
                setLightboxIndex(
                  (prev) => (prev! - 1 + visibleImages.length) % visibleImages.length
                )
              }
              aria-label="Previous Image"
              className="absolute left-2 sm:left-4 z-10 p-3 bg-espresso/80 border border-warm-cream/20 text-warm-cream hover:border-warm-cream transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Displayed Image */}
            <div className="relative max-w-4xl max-h-[72vh] w-full h-full aspect-[4/3]">
              <Image
                src={visibleImages[lightboxIndex].src}
                alt={visibleImages[lightboxIndex].alt}
                fill
                sizes="95vw"
                className="object-contain"
              />
            </div>

            {/* Next Control */}
            <button
              onClick={() =>
                setLightboxIndex((prev) => (prev! + 1) % visibleImages.length)
              }
              aria-label="Next Image"
              className="absolute right-2 sm:right-4 z-10 p-3 bg-espresso/80 border border-warm-cream/20 text-warm-cream hover:border-warm-cream transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Caption & Mobile Swipe Prompt */}
          <div className="border-t border-warm-cream/15 pt-4 text-center max-w-xl mx-auto">
            <h3 className="font-serif text-xl sm:text-2xl text-warm-cream font-normal mb-1">
              {visibleImages[lightboxIndex].title}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-warm-cream/70 font-light">
              {visibleImages[lightboxIndex].caption}
            </p>
            <span className="block sm:hidden text-[9px] font-sans uppercase tracking-[0.2em] text-muted-gold/60 mt-2">
              Swipe left or right to browse
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
