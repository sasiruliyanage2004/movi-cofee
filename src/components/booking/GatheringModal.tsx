"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { X, MessageCircle } from "lucide-react";

export interface GatheringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatheringModal: React.FC<GatheringModalProps> = ({ isOpen, onClose }) => {
  const [gatheringType, setGatheringType] = useState("Quiet Study & Work Table (1–2 Guests)");
  const [guestCount, setGuestCount] = useState("2");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (9:00 AM – 11:30 AM)");
  const [guestName, setGuestName] = useState("");
  const [specialNote, setSpecialNote] = useState("");

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const text = encodeURIComponent(
      `Hello ${siteConfig.name} team! I would like to reserve a space:\n\n` +
      `• Name: ${guestName || "Guest"}\n` +
      `• Type: ${gatheringType}\n` +
      `• Guests: ${guestCount}\n` +
      `• Date: ${preferredDate || "Upcoming"}\n` +
      `• Preferred Time: ${preferredTime}\n` +
      (specialNote ? `• Note: ${specialNote}\n` : "") +
      `\nPlease let me know your table availability. Thank you!`
    );

    window.open(`https://wa.me/${siteConfig.whatsapp}?text=${text}`, "_blank");
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Table & Gathering Reservation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-espresso/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-warm-cream border border-espresso/20 p-6 sm:p-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-espresso/15 mb-6">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
              GUEST RESERVATION & GATHERINGS
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
              Book a Table or Gathering
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 -mr-2 text-espresso/70 hover:text-espresso cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reservation Form */}
        <form onSubmit={handleWhatsAppBooking} className="space-y-5">
          {/* Gathering Type */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-2 font-medium">
              Occasion / Gathering Type
            </label>
            <select
              value={gatheringType}
              onChange={(e) => setGatheringType(e.target.value)}
              className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso cursor-pointer"
            >
              <option>Quiet Study & Work Table (1–2 Guests)</option>
              <option>Communal Table Catch-up (4–8 Guests)</option>
              <option>Private Specialty Coffee Cupping Session</option>
              <option>Creative Workspace / Small Business Meeting</option>
              <option>Courtyard Outdoor Gathering</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Guest Name */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                Your Name
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Ruwan Silva"
                className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso"
              />
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Date */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso cursor-pointer"
              />
            </div>

            {/* Preferred Time Window */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                Time Window
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso cursor-pointer"
              >
                <option>Morning (8:00 AM – 11:30 AM)</option>
                <option>Midday / Lunch (12:00 PM – 2:30 PM)</option>
                <option>Afternoon Tea (3:00 PM – 6:00 PM)</option>
                <option>Evening Pause (6:30 PM – 9:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
              Special Requests or Dietary Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="e.g. Quiet power outlet spot, oat milk preference, etc."
              className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso resize-none"
            />
          </div>

          {/* Action Trigger */}
          <div className="pt-3">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-muted-gold" />
              CONFIRM RESERVATION VIA WHATSAPP
            </Button>
            <p className="text-[10px] font-sans text-center text-espresso/60 uppercase tracking-widest mt-2.5">
              Walk-ins are always welcomed • No booking fee required
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
