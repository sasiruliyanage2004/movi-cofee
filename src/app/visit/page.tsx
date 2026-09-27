import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { MapPin, Clock, Phone, MessageCircle, Navigation, Wifi, Car, Users, CalendarCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Visit Us",
  description:
    "Plan your visit to our coffee shop in Kaduwela, Sri Lanka. Address, opening hours, parking, Wi-Fi, seating, and directions.",
};

export default function VisitPage() {
  return (
    <div className="pt-28 pb-24 bg-warm-cream min-h-screen text-espresso">
      {/* Hero Header */}
      <section className="py-12 sm:py-16 border-b border-espresso/15">
        <Container width="wide">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              GUEST HOSPITALITY • KADUWELA
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-espresso mb-4">
              Visit Us
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-espresso/70 font-light italic">
              &ldquo;Come as you are. Stay for a while.&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Main Visit Information */}
      <Container width="wide" className="py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Details: Address, Hours, Contact, CTAs */}
          <div className="lg:col-span-6 space-y-8">
            {/* Address */}
            <div id="directions" className="p-8 border border-espresso/15 bg-soft-beige/30">
              <div className="flex items-center gap-3 mb-3 text-muted-gold">
                <MapPin className="w-5 h-5" />
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-coffee font-medium">
                  Address
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-espresso mb-2">
                {siteConfig.address}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-espresso/70 font-light mb-6">
                Conveniently located in Kaduwela, Sri Lanka with direct roadway access and nearby landmark positioning.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="md"
                  href={siteConfig.mapUrl}
                  external
                >
                  <Navigation className="w-3.5 h-3.5 mr-2 inline" />
                  GET DIRECTIONS
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  href={`tel:${siteConfig.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 mr-2 inline" />
                  CALL US
                </Button>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="p-8 border border-espresso/15 bg-soft-beige/30">
              <div className="flex items-center gap-3 mb-4 text-muted-gold">
                <Clock className="w-5 h-5" />
                <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-muted-coffee font-medium">
                  Opening Hours
                </span>
              </div>
              <div className="space-y-3 font-sans text-sm text-espresso/80 font-light">
                {siteConfig.openingHoursDetails.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between py-2 border-b border-dashed border-espresso/10"
                  >
                    <span>{item.days}</span>
                    <span className="font-medium text-espresso">
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Connect: Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 border border-espresso/15 bg-soft-beige/30">
                <div className="flex items-center gap-2 mb-2 text-muted-gold">
                  <Phone className="w-4 h-4" />
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
                    Direct Telephone
                  </span>
                </div>
                <p className="font-serif text-lg text-espresso">
                  {siteConfig.phone}
                </p>
              </div>

              <div className="p-6 border border-espresso/15 bg-soft-beige/30">
                <div className="flex items-center gap-2 mb-2 text-muted-gold">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-[10px] font-sans uppercase tracking-widest text-muted-coffee">
                    WhatsApp Chat
                  </span>
                </div>
                <p className="font-serif text-lg text-espresso">
                  {siteConfig.whatsapp}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Amenities & Architectural Map Frame */}
          <div className="lg:col-span-6 space-y-8">
            {/* Visual Ambiance */}
            <ImageReveal
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop"
              alt="Courtyard and seating atmosphere at Kaduwela cafe"
              aspectRatio="landscape"
              caption="Generous outdoor terrace shaded by native canopy."
              eyebrow="Courtyard & Seating"
            />

            {/* Verified Amenities */}
            <div className="p-8 border border-espresso/15 bg-warm-cream">
              <h3 className="font-serif text-2xl text-espresso mb-6">
                Guest Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Car className="w-4 h-4 text-muted-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-espresso">
                      Parking
                    </h4>
                    <p className="font-sans text-xs text-espresso/70 mt-0.5">
                      {siteConfig.amenities.parking}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wifi className="w-4 h-4 text-muted-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-espresso">
                      Wi-Fi
                    </h4>
                    <p className="font-sans text-xs text-espresso/70 mt-0.5">
                      {siteConfig.amenities.wifi}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-muted-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-espresso">
                      Seating
                    </h4>
                    <p className="font-sans text-xs text-espresso/70 mt-0.5">
                      {siteConfig.amenities.seating}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarCheck className="w-4 h-4 text-muted-gold shrink-0 mt-1" />
                  <div>
                    <h4 className="font-sans text-xs uppercase tracking-wider font-semibold text-espresso">
                      Reservations
                    </h4>
                    <p className="font-sans text-xs text-espresso/70 mt-0.5">
                      {siteConfig.amenities.reservations}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
