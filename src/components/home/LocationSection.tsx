import React from "react";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LiveStatusBadge } from "@/components/ui/LiveStatusBadge";
import { MapPin, Clock, Phone, MessageCircle, Navigation, Car, Compass } from "lucide-react";

export const travelTimes = [
  { from: "Kaduwela Expressway Interchange", time: "~3 mins", route: "Direct Exit" },
  { from: "Malabe Town Center", time: "~10 mins", route: "Via B240 / Kaduwela Rd" },
  { from: "Battaramulla & Pelawatte", time: "~15 mins", route: "Via Main Artery" },
  { from: "Biyagama & Kelani Bridge", time: "~8 mins", route: "Across River Cross" },
];

export const LocationSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-warm-cream text-espresso">
      <Container width="wide">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
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

          <div className="p-3 bg-soft-beige/50 border border-espresso/15 self-start lg:self-auto">
            <LiveStatusBadge theme="light" />
          </div>
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

            {/* Operating Schedule with Live Badge */}
            <div className="p-8 border border-espresso/15 bg-soft-beige/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-muted-gold">
                  <Clock className="w-5 h-5" />
                  <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-coffee font-medium">
                    Hours of Service
                  </span>
                </div>
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
                href={`tel:${siteConfig.phone}`}
              >
                CALL US
              </Button>
              <Button
                variant="secondary"
                size="md"
                href={`https://wa.me/${siteConfig.whatsapp}`}
                external
              >
                WHATSAPP US
              </Button>
            </div>
          </div>

          {/* Right Column: Travel Times & Stylized Map Viewport */}
          <div className="lg:col-span-6 space-y-6">
            {/* Travel Times Grid */}
            <div className="p-6 sm:p-8 bg-warm-cream border border-espresso/15">
              <div className="flex items-center gap-2 mb-4 text-muted-gold">
                <Compass className="w-4 h-4" />
                <span className="text-[10px] font-sans uppercase tracking-[0.22em] text-muted-coffee font-medium">
                  NEIGHBORHOOD DRIVE TIMES
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {travelTimes.map((item, i) => (
                  <div key={i} className="p-3 border border-espresso/10 bg-soft-beige/25">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif text-lg font-medium text-espresso">
                        {item.time}
                      </span>
                      <Car className="w-3.5 h-3.5 text-muted-gold" />
                    </div>
                    <p className="font-sans text-xs text-espresso/80 font-medium">
                      {item.from}
                    </p>
                    <span className="font-sans text-[10px] text-muted-coffee block mt-0.5">
                      {item.route}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stylized Map Viewport */}
            <div className="relative aspect-[16/10] w-full border border-espresso/20 bg-espresso/5 overflow-hidden flex flex-col justify-between p-8">
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

              <div className="relative z-10 my-auto text-center py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-espresso text-warm-cream flex items-center justify-center mb-3 shadow-lg border border-warm-cream/20">
                  <Navigation className="w-5 h-5 text-muted-gold" />
                </div>
                <h4 className="font-serif text-xl sm:text-2xl text-espresso mb-1">
                  {siteConfig.name}
                </h4>
                <p className="font-sans text-xs text-espresso/70 max-w-xs mx-auto font-light mb-4">
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

              <div className="relative z-10 text-[10px] font-sans uppercase tracking-widest text-espresso/50 text-center border-t border-espresso/10 pt-2">
                Dine In • Takeaway • Verified Parking Available
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
