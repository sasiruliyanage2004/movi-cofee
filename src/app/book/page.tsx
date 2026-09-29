import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { PremiumTableReservation } from "@/components/booking/PremiumTableReservation";
import { MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Reserve a Table | Movi Coffee — Kaduwela",
  description:
    "Book your table at Movi Coffee in Kaduwela, Sri Lanka. Check real-time seat availability for quiet work nooks, salon banquettes, and open courtyard tables.",
};

export default function BookTablePage() {
  return (
    <div className="pt-28 pb-24 bg-warm-cream min-h-screen text-espresso">
      {/* Editorial Header */}
      <section className="py-12 sm:py-16 border-b border-espresso/15">
        <Container width="wide">
          <div className="max-w-3xl">
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-muted-coffee font-medium block mb-4">
              TABLE & GATHERING RESERVATIONS • KADUWELA
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.05] tracking-tight text-espresso mb-4">
              Reserve Your Table
            </h1>
            <p className="font-serif text-2xl sm:text-3xl text-espresso/70 font-light italic">
              &ldquo;Take your time. A table is waiting for you.&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Main Reservation Section */}
      <Container width="wide" className="py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Form Column */}
          <div className="lg:col-span-8 bg-soft-beige/30 p-6 sm:p-10 border border-espresso/15 shadow-sm">
            <PremiumTableReservation />
          </div>

          {/* Hospitality Perks & Store Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-espresso text-warm-cream border border-espresso">
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold block mb-2 font-medium">
                GUEST HOSPITALITY PROMISE
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-warm-cream mb-4 font-normal">
                Thoughtful Spaces, Unhurried Coffee
              </h3>
              <ul className="space-y-3.5 text-xs text-warm-cream/80 font-light font-sans">
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-muted-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Anti-Overbooking Guarantee:</strong> We preserve table spacing so your gathering never feels rushed or crowded.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-muted-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Booking Fees:</strong> Walk-ins are always welcomed; reservations guarantee priority seating.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-muted-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>15-Minute Grace Window:</strong> Tables are held for 15 minutes past your reserved time slot.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-soft-beige/40 border border-espresso/15 space-y-3 text-xs font-sans">
              <div className="flex items-center gap-2 text-muted-coffee font-medium uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-muted-gold" />
                <span>Café Location</span>
              </div>
              <p className="text-espresso font-medium text-sm">
                {siteConfig.address}
              </p>
              <p className="text-espresso/70 text-xs">
                Free on-premises parking, high-speed fiber Wi-Fi, and air-conditioned salon seating.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
