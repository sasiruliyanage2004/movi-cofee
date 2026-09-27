"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export interface ImageRevealProps {
  src: string;
  alt: string;
  aspectRatio?: "portrait" | "landscape" | "square" | "panoramic" | "auto";
  priority?: boolean;
  caption?: string;
  eyebrow?: string;
  className?: string;
  delay?: number;
}

const ratioStyles: Record<string, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
  panoramic: "aspect-[21/9]",
  auto: "h-auto w-full",
};

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  aspectRatio = "portrait",
  priority = false,
  caption,
  eyebrow,
  className = "",
  delay = 0,
}) => {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={`group relative overflow-hidden bg-espresso/5 ${className}`}
    >
      <div className={`relative w-full overflow-hidden ${ratioStyles[aspectRatio]}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Subtle vignette border */}
        <div className="pointer-events-none absolute inset-0 border border-espresso/10" />
      </div>

      {(caption || eyebrow) && (
        <figcaption className="mt-3 flex items-baseline justify-between text-xs">
          {caption && (
            <span className="font-serif italic text-espresso/70 text-sm tracking-wide">
              {caption}
            </span>
          )}
          {eyebrow && (
            <span className="font-sans uppercase text-[10px] tracking-[0.2em] text-muted-coffee">
              {eyebrow}
            </span>
          )}
        </figcaption>
      )}
    </motion.figure>
  );
};
