"use client";

import React, { useState } from "react";
import { reviewConfig } from "@/data/testimonials";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, MessageSquareHeart } from "lucide-react";

export const CustomerReviewsSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const items = reviewConfig.testimonials;

  const nextTestimonial = () => {
    setCurrentIdx((prev) => (prev + 1) % items.length);
  };

  const prevTestimonial = () => {
    setCurrentIdx((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className="py-24 sm:py-32 bg-espresso text-warm-cream">
      <Container width="default">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-gold font-medium block mb-4">
            GUEST REFLECTIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-warm-cream">
            What our guests say
          </h2>
        </div>

        {!reviewConfig.hasRealReviews ? (
          /* Honest Unfabricated State */
          <div className="max-w-2xl mx-auto text-center border border-warm-cream/15 p-8 sm:p-14 bg-warm-cream/5">
            <div className="w-12 h-12 rounded-full bg-muted-gold/15 flex items-center justify-center mx-auto mb-6 text-muted-gold">
              <MessageSquareHeart className="w-6 h-6 stroke-[1.5]" />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-warm-cream font-light mb-4">
              &ldquo;{reviewConfig.emptyStateHeading}&rdquo;
            </h3>

            <p className="font-sans text-sm sm:text-base text-warm-cream/75 font-light leading-relaxed mb-8 max-w-lg mx-auto">
              {reviewConfig.emptyStateCopy}
            </p>

            <Button
              variant="gold"
              size="md"
              href={reviewConfig.googleReviewUrlPlaceholder}
              external
            >
              LEAVE A REVIEW
            </Button>

            <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-warm-cream/40 mt-8">
              Verified Reviews & Testimonials will appear here once submitted.
            </p>
          </div>
        ) : (
          /* Testimonial Carousel Architecture for when real reviews are provided */
          <div className="relative max-w-3xl mx-auto">
            <div className="min-h-[220px] flex flex-col justify-center text-center px-6">
              <span className="text-xs font-sans uppercase tracking-widest text-muted-gold mb-4">
                {items[currentIdx].highlightTag}
              </span>
              <p className="font-serif text-2xl sm:text-3xl lg:text-4xl font-light italic leading-snug text-warm-cream mb-6">
                {items[currentIdx].quotePlaceholder}
              </p>
              <div>
                <p className="font-sans text-sm text-warm-cream font-medium tracking-wide">
                  {items[currentIdx].authorPlaceholder}
                </p>
                <p className="font-sans text-xs text-warm-cream/60">
                  {items[currentIdx].roleOrNotePlaceholder}
                </p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={prevTestimonial}
                aria-label="Previous review"
                className="p-3 border border-warm-cream/20 hover:border-warm-cream text-warm-cream transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-sans text-xs text-warm-cream/50 tracking-widest">
                0{currentIdx + 1} / 0{items.length}
              </span>
              <button
                onClick={nextTestimonial}
                aria-label="Next review"
                className="p-3 border border-warm-cream/20 hover:border-warm-cream text-warm-cream transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};
