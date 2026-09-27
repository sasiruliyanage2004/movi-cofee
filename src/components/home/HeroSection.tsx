"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LiveStatusBadge } from "@/components/ui/LiveStatusBadge";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-between pt-28 pb-8 bg-espresso text-warm-cream overflow-hidden">
      {/* Background Cinematic Image with Subtle Scale Animation */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <Image
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop"
          alt="Atmospheric specialty coffee shop interior in Kaduwela"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 brightness-75 contrast-105"
        />
        {/* Soft Vignette & Gradient Overlays for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/60 to-espresso/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/0 to-espresso/60" />
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 my-auto py-12 sm:py-20">
        <Container width="wide">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-px bg-muted-gold" />
              <span className="font-sans text-xs uppercase tracking-[0.28em] text-muted-gold font-medium">
                {siteConfig.heroEyebrow}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.02] tracking-tight text-warm-cream mb-8"
            >
              <span>{siteConfig.heroHeadline.line1}</span>
              <br />
              <span className="italic font-light text-warm-cream/90">
                {siteConfig.heroHeadline.line2}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-sans text-base sm:text-lg md:text-xl text-warm-cream/80 font-light leading-relaxed max-w-2xl mb-10"
            >
              &ldquo;{siteConfig.heroDescription}&rdquo;
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-4 sm:gap-5"
            >
              <Button
                variant="gold"
                size="lg"
                href="/menu"
                className="shadow-md"
              >
                EXPLORE MENU
              </Button>
              <Button
                variant="outline"
                size="lg"
                href="/visit"
                className="hover:border-warm-cream"
              >
                VISIT US
              </Button>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Hero Bottom Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-10 border-t border-warm-cream/15 pt-5 pb-2"
      >
        <Container width="wide">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-sans tracking-[0.2em] uppercase text-warm-cream/70 font-light">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-gold inline-block" />
              <span>{siteConfig.location.city}, {siteConfig.location.country}</span>
            </div>

            <div>
              <LiveStatusBadge theme="dark" />
            </div>

            <div className="text-warm-cream/50">
              {siteConfig.services.join(" · ")}
            </div>
          </div>
        </Container>
      </motion.div>
    </section>
  );
};
