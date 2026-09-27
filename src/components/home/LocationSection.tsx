import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, Phone, MessageCircle, Navigation } from "lucide-react";

export const LocationSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-warm-cream text-espresso">
      <Container width="wide">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
            VISIT & CONNECT
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-espresso mb-4">
            Come find us.
          </h2>
          <p className="font-sans text-base sm:text-lg text-espresso/70 font-light leading-relaxed">
            Your next coffee is closer than you think.
          </p>
        </div>

        {/* Two-Column Grid: Details & Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Details Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Address Block */}
            <div className="p-8 border border-espresso/15 bg-soft-beige/30">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-muted-gold shrink-0" />
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-coffee font-medium">
                  Address
                </span>
              </div>
              <p className="font-serif text-2xl text-espresso mb-1">
                {siteConfig.location.addressPlaceholder}
              </p>
              <p className="font-sans text-sm text-espresso/70 font-light">
                {siteConfig.location.city}, {siteConfig.location.country}
              </p>
            </div>

            {/* Operating Schedule */}
            <div className="p-8 border border-espresso/15 bg-soft-beige/30">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-muted-gold shrink-0" />
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-coffee font-medium">
                  Hours of Service
                </span>
              </div>
              <div className="space-y-2.5 font-sans text-sm text-espresso/80 font-light">
                {siteConfig.contact.hoursPlaceholder.map((hour, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-1.5 border-b border-dashed border-espresso/10"
                  >
                    <span>{hour.split(":")[0]}</span>
                    <span className="font-medium text-espresso">
                      {hour.split(":").slice(1).join(":") || hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Telephone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 border border-espresso/15 bg-soft-beige/30">
                <div className="flex items-center gap-2 mb-2 text-muted-gold">
                  <Phone className="w-4 h-4" />
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
                    Phone
                  </span>
                </div>
                <p className="font-serif text-lg text-espresso font-normal">
                  {siteConfig.contact.phonePlaceholder}
                </p>
              </div>

              <div className="p-6 border border-espresso/15 bg-soft-beige/30">
                <div className="flex items-center gap-2 mb-2 text-muted-gold">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
                    WhatsApp
                  </span>
                </div>
                <p className="font-serif text-lg text-espresso font-normal">
                  {siteConfig.contact.whatsappPlaceholder}
                </p>
              </div>
            </div>

            {/* 3 Explicit Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                href={siteConfig.location.googleMapsUrlPlaceholder}
                external
              >
                GET DIRECTIONS
              </Button>
              <Button
                variant="secondary"
                size="md"
                href="tel:[PHONE]"
              >
                CALL US
              </Button>
              <Button
                variant="secondary"
                size="md"
                href="https://wa.me/[WHATSAPP]"
                external
              >
                WHATSAPP US
              </Button>
            </div>
          </div>

          {/* Stylized Map Viewport */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full border border-espresso/20 bg-espresso/5 overflow-hidden flex flex-col justify-between p-8">
              {/* Subtle architectural map backdrop styling */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1B1410_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-coffee bg-warm-cream/90 px-3 py-1.5 border border-espresso/15">
                  MAP DESTINATION
                </span>
                <span className="font-serif italic text-xs text-espresso/60">
                  {siteConfig.location.city} • Sri Lanka
                </span>
              </div>

              <div className="relative z-10 my-auto text-center py-8">
                <div className="w-14 h-14 mx-auto rounded-full bg-espresso text-warm-cream flex items-center justify-center mb-4 shadow-lg border border-warm-cream/20">
                  <Navigation className="w-6 h-6 text-muted-gold" />
                </div>
                <h4 className="font-serif text-2xl text-espresso mb-2">
                  {siteConfig.name}
                </h4>
                <p className="font-sans text-xs text-espresso/70 max-w-xs mx-auto font-light mb-6">
                  {siteConfig.location.addressPlaceholder}
                </p>
                <Button
                  variant="gold"
                  size="sm"
                  href={siteConfig.location.googleMapsUrlPlaceholder}
                  external
                >
                  OPEN LIVE NAVIGATION
                </Button>
              </div>

              <div className="relative z-10 text-[10px] font-sans uppercase tracking-widest text-espresso/50 text-center border-t border-espresso/10 pt-3">
                Dine In • Takeaway • Verified Parking Available
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
