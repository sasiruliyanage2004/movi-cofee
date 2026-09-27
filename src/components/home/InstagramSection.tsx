import React from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { instagramFeed } from "@/data/gallery";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";


export const InstagramSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-soft-beige/40 text-espresso border-b border-espresso/10">
      <Container width="wide">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              COMMUNITY & DISPATCHES
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-espresso mb-4">
              Follow along.
            </h2>
            <p className="font-sans text-base sm:text-lg text-espresso/70 font-light leading-relaxed">
              See what&apos;s brewing, what&apos;s fresh and what&apos;s happening at {siteConfig.name}.
            </p>
          </div>

          <div>
            <Button
              variant="outline"
              size="md"
              href="https://instagram.com"
              external
              className="border-espresso/40 text-espresso hover:bg-espresso hover:text-warm-cream"
            >
              FOLLOW US ON INSTAGRAM
            </Button>
          </div>
        </div>

        {/* 6 Curated Instagram Images Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramFeed.map((item) => (
            <a
              key={item.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden bg-espresso/5 border border-espresso/15 block"
            >
              <Image
                src={item.image}
                alt="Instagram coffee feed"
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-espresso/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <svg
                  className="w-5 h-5 text-warm-cream"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center sm:text-right">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-coffee">
            {siteConfig.socialsPlaceholder.instagram}
          </span>
        </div>
      </Container>
    </section>
  );
};
