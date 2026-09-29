"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { SeasonalExperience } from "@/types/settings";

interface SeasonalBannerProps {
  experience: SeasonalExperience | null;
}

export const SeasonalBanner: React.FC<SeasonalBannerProps> = ({ experience }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!experience || isDismissed) return null;

  return (
    <div className="relative z-50 bg-espresso text-warm-cream border-b border-muted-gold/30 px-4 py-2 sm:py-2.5 text-xs font-sans tracking-wide">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted-gold/20 text-muted-gold text-[10px] uppercase tracking-widest font-semibold border border-muted-gold/40">
            <Sparkles className="w-3 h-3" />
            {experience.tag}
          </span>
          <span className="text-warm-cream/90 font-medium">
            {experience.title}
          </span>
          <span className="hidden md:inline text-warm-cream/50">•</span>
          <span className="hidden md:inline text-warm-cream/70 font-light">
            {experience.highlightText}
          </span>

          {experience.ctaHref && (
            <Link
              href={experience.ctaHref}
              className="inline-flex items-center gap-1 text-muted-gold hover:text-warm-cream font-medium ml-1 transition-colors underline decoration-muted-gold/40 underline-offset-2"
            >
              <span>{experience.ctaLabel || "Learn More"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="text-warm-cream/50 hover:text-warm-cream p-1 transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
