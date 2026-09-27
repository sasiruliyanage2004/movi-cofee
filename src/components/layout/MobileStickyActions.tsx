"use client";

import React from "react";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { UtensilsCrossed, Phone, MessageCircle, Navigation } from "lucide-react";

export const MobileStickyActions: React.FC = () => {
  return (
    <aside
      aria-label="Mobile Quick Actions"
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#F5F0E8]/96 backdrop-blur-md border-t border-espresso/15 shadow-[0_-4px_16px_rgba(27,20,16,0.07)]"
    >
      <div className="grid grid-cols-4 divide-x divide-espresso/10 text-center">
        {/* Menu */}
        <Link
          href="/menu"
          className="flex flex-col items-center justify-center py-2.5 px-1 text-espresso hover:text-muted-coffee active:bg-espresso/5 transition-colors"
        >
          <UtensilsCrossed className="w-4 h-4 mb-1 text-muted-gold" />
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] font-medium">
            MENU
          </span>
        </Link>

        {/* Call */}
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex flex-col items-center justify-center py-2.5 px-1 text-espresso hover:text-muted-coffee active:bg-espresso/5 transition-colors"
        >
          <Phone className="w-4 h-4 mb-1 text-muted-gold" />
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] font-medium">
            CALL
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2.5 px-1 text-espresso hover:text-muted-coffee active:bg-espresso/5 transition-colors"
        >
          <MessageCircle className="w-4 h-4 mb-1 text-muted-gold" />
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] font-medium">
            WHATSAPP
          </span>
        </a>

        {/* Directions */}
        <Link
          href="/visit#directions"
          className="flex flex-col items-center justify-center py-2.5 px-1 text-espresso hover:text-muted-coffee active:bg-espresso/5 transition-colors"
        >
          <Navigation className="w-4 h-4 mb-1 text-muted-gold" />
          <span className="font-sans text-[10px] uppercase tracking-[0.16em] font-medium">
            DIRECTIONS
          </span>
        </Link>
      </div>
    </aside>
  );
};
