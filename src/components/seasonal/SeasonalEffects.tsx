"use client";

import React, { useSyncExternalStore } from "react";
import { SeasonalExperience } from "@/types/settings";

interface SeasonalEffectsProps {
  experience: SeasonalExperience | null;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot() {
  return false;
}

export const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({ experience }) => {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerSnapshot
  );

  if (!experience || !experience.visualEffect || experience.visualEffect === "none" || prefersReducedMotion) {
    return null;
  }

  // 1. Subtle Snowfall for Christmas / Winter Holiday
  if (experience.visualEffect === "snowfall") {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
        aria-hidden="true"
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const leftPercent = (i * 6.25 + 2).toFixed(1);
          const animationDuration = (7 + (i % 5) * 1.5).toFixed(1);
          const animationDelay = ((i % 6) * 1.2).toFixed(1);
          const sizePx = 3 + (i % 3);
          const opacity = 0.35 + (i % 4) * 0.1;

          return (
            <span
              key={i}
              className="absolute top-[-10px] rounded-full bg-warm-cream animate-snowfall"
              style={{
                left: `${leftPercent}%`,
                width: `${sizePx}px`,
                height: `${sizePx}px`,
                opacity,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${animationDelay}s`,
                animationIterationCount: "infinite",
                animationTimingFunction: "linear",
              }}
            />
          );
        })}
      </div>
    );
  }

  // 2. Warm Ambient Lights for Valentine's Day / Evening Festive
  if (experience.visualEffect === "warm-lights") {
    return (
      <div
        className="fixed top-0 inset-x-0 h-1 pointer-events-none z-30 flex justify-around overflow-hidden select-none opacity-60"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-gold shadow-[0_0_8px_#B79A67] animate-pulse"
            style={{ animationDelay: `${(i * 0.25).toFixed(2)}s` }}
          />
        ))}
      </div>
    );
  }

  // 3. Golden Shimmer for New Year / Harvest
  if (experience.visualEffect === "golden-shimmer") {
    return (
      <div
        className="fixed inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-muted-gold/60 to-transparent pointer-events-none z-30 animate-pulse"
        aria-hidden="true"
      />
    );
  }

  return null;
};
