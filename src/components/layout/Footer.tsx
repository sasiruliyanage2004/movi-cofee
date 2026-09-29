import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-espresso text-warm-cream border-t border-espresso mt-auto">
      {/* Editorial Quote Banner */}
      <div className="border-b border-warm-cream/10 py-16 sm:py-20">
        <Container width="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-muted-gold block mb-3">
                Kaduwela • Sri Lanka
              </span>
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-warm-cream leading-tight">
                &ldquo;{siteConfig.tagline}&rdquo;
              </p>
              <p className="font-sans text-sm sm:text-base text-warm-cream/65 mt-3 max-w-xl font-light">
                {siteConfig.supportingTagline}
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Link
                href="/visit"
                className="inline-flex items-center justify-center font-sans font-medium text-xs uppercase tracking-[0.2em] px-8 py-4 border border-muted-gold text-muted-gold hover:bg-muted-gold hover:text-espresso transition-all duration-300"
              >
                PLAN YOUR VISIT
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links & Info */}
      <div className="py-16 sm:py-20">
        <Container width="wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block">
                <span className="font-serif text-3xl tracking-tight text-warm-cream">
                  {siteConfig.name}
                </span>
                <span className="block font-sans text-[10px] uppercase tracking-[0.25em] text-muted-gold mt-1">
                  Artisanal Coffee & Gathering
                </span>
              </Link>
              <p className="mt-6 text-sm text-warm-cream/70 font-light leading-relaxed max-w-sm">
                {siteConfig.positioning}
              </p>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-gold mb-6 font-semibold">
                Explore
              </h3>
              <ul className="space-y-3.5 text-xs font-sans tracking-wider uppercase">
                {siteConfig.navigation.footer.explore.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-warm-cream/70 hover:text-warm-cream transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Location & Hours Placeholder */}
            <div className="lg:col-span-3">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-gold mb-6 font-semibold">
                Destination
              </h3>
              <div className="space-y-3 text-sm text-warm-cream/70 font-light">
                <p className="font-serif text-base text-warm-cream">
                  {siteConfig.location.city}, {siteConfig.location.country}
                </p>
                <p className="text-xs text-warm-cream/50">
                  {siteConfig.location.addressPlaceholder}
                </p>
                <div className="pt-2 text-xs">
                  <span className="text-muted-gold uppercase tracking-wider block font-sans mb-1 text-[10px]">
                    Hours
                  </span>
                  {siteConfig.contact.hoursPlaceholder.map((hour, idx) => (
                    <p key={idx} className="text-warm-cream/60">
                      {hour}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Placeholders */}
            <div className="lg:col-span-3">
              <h3 className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-gold mb-6 font-semibold">
                Inquiries
              </h3>
              <div className="space-y-3 text-sm text-warm-cream/70 font-light">
                <p className="text-xs">
                  <span className="text-muted-gold uppercase tracking-wider block font-sans mb-1 text-[10px]">
                    Telephone
                  </span>
                  <span className="text-warm-cream/60">
                    {siteConfig.contact.phonePlaceholder}
                  </span>
                </p>
                <p className="text-xs">
                  <span className="text-muted-gold uppercase tracking-wider block font-sans mb-1 text-[10px]">
                    Email
                  </span>
                  <span className="text-warm-cream/60">
                    {siteConfig.contact.emailPlaceholder}
                  </span>
                </p>
                <p className="text-xs">
                  <span className="text-muted-gold uppercase tracking-wider block font-sans mb-1 text-[10px]">
                    Social
                  </span>
                  <span className="text-warm-cream/50">
                    {siteConfig.socialsPlaceholder.instagram}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 mt-12 border-t border-warm-cream/10 flex flex-col md:flex-row items-center justify-between text-xs text-warm-cream/40 font-light gap-4">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {siteConfig.name}. Kaduwela, Sri Lanka. All rights reserved.
            </p>

            {/* Developer Attribution & Owner Access */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] sm:text-xs font-sans tracking-wide">
              <div className="flex items-center gap-1.5">
                <span className="text-warm-cream/50">Designed & Engineered by</span>
                <a
                  href="https://github.com/sasiruliyanage2004"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-1.5 font-medium text-warm-cream hover:text-muted-gold transition-colors duration-200"
                  title="Sasiru Liyanage - Full-Stack Developer & UI Architect"
                >
                  <span className="underline decoration-muted-gold/40 underline-offset-4 group-hover:decoration-muted-gold transition-colors">
                    Sasiru Liyanage
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-gold/80 group-hover:bg-muted-gold group-hover:scale-125 transition-all" />
                </a>
              </div>

              <span className="text-warm-cream/20 hidden sm:inline">•</span>

              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-warm-cream/50 hover:text-muted-gold transition-colors"
                title="Management & Owner Portal"
              >
                <Lock className="w-3 h-3 text-muted-gold" />
                <span>Owner Portal</span>
              </Link>
            </div>

            <p className="font-serif italic text-warm-cream/50 text-center md:text-right">
              Crafted coffee, thoughtful food and a place to slow down.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};
