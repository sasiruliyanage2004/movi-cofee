"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { X, MessageCircle, CheckCircle2, Calendar, Clock, Users, Hash } from "lucide-react";
import { createReservationAction } from "@/actions/reservations";
import { SeatingArea } from "@/types/reservation";

export interface GatheringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatheringModal: React.FC<GatheringModalProps> = ({ isOpen, onClose }) => {
  const [gatheringType, setGatheringType] = useState("Quiet Study & Work Table (1–2 Guests)");
  const [seatingArea, setSeatingArea] = useState<SeatingArea>("quiet-nook");
  const [guestCount, setGuestCount] = useState("2");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (8:00 AM – 11:30 AM)");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    referenceNumber: string;
    whatsappUrl: string;
  } | null>(null);

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

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createReservationAction({
        guestName,
        phone,
        email,
        guestsCount: parseInt(guestCount, 10) || 2,
        reservationDate: preferredDate || new Date().toISOString().split("T")[0],
        timeSlot: preferredTime,
        seatingArea,
        specialNotes: specialNote ? `Type: ${gatheringType} | ${specialNote}` : `Type: ${gatheringType}`,
      });

      if (result.success && result.reservation && result.whatsappUrl) {
        setConfirmedBooking({
          referenceNumber: result.reservation.referenceNumber,
          whatsappUrl: result.whatsappUrl,
        });
        // Open WhatsApp directly
        window.open(result.whatsappUrl, "_blank");
      }
    } catch {
      // Fallback direct WhatsApp if server error occurs
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setConfirmedBooking(null);
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
            onClick={handleResetAndClose}
            aria-label="Close modal"
            className="p-2 -mr-2 text-espresso/70 hover:text-espresso cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedBooking ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-muted-gold/20 flex items-center justify-center mx-auto text-espresso">
              <CheckCircle2 className="w-7 h-7 text-muted-coffee" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-espresso/5 border border-espresso/15 text-xs font-mono font-medium text-espresso mb-2">
                <Hash className="w-3.5 h-3.5 text-muted-gold" />
                REF: {confirmedBooking.referenceNumber}
              </span>
              <h4 className="font-serif text-2xl sm:text-3xl text-espresso">
                Reservation Submitted!
              </h4>
              <p className="font-sans text-xs sm:text-sm text-espresso/70 max-w-md mx-auto mt-2 font-light">
                Thank you, {guestName}. Your table reservation has been recorded in our system. A WhatsApp window was opened to connect directly with our baristas.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="gold"
                size="md"
                onClick={() => window.open(confirmedBooking.whatsappUrl, "_blank")}
                className="flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                RE-OPEN WHATSAPP
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleResetAndClose}
              >
                DONE
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4 sm:space-y-5">
            {/* Gathering Type & Seating Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-2 font-medium">
                  Occasion / Gathering
                </label>
                <select
                  value={gatheringType}
                  onChange={(e) => setGatheringType(e.target.value)}
                  className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso cursor-pointer"
                >
                  <option>Quiet Study & Work (1–2 Guests)</option>
                  <option>Communal Catch-up (4–8 Guests)</option>
                  <option>Coffee Tasting & Cupping</option>
                  <option>Small Business Meeting</option>
                  <option>Courtyard Outdoor Gathering</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-2 font-medium">
                  Seating Area
                </label>
                <select
                  value={seatingArea}
                  onChange={(e) => setSeatingArea(e.target.value as SeatingArea)}
                  className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso cursor-pointer"
                >
                  <option value="quiet-nook">Quiet Study Nook (Indoor AC)</option>
                  <option value="salon">Main AC Salon Banquette</option>
                  <option value="courtyard">Sheltered Courtyard (Outdoor)</option>
                  <option value="communal">Artisan Communal Timber Table</option>
                  <option value="any">First Available / Flexible</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Guest Name */}
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                  Full Name <span className="text-red-700">*</span>
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

              {/* Contact Phone */}
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                  Phone / WhatsApp <span className="text-red-700">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+94 7X XXX XXXX"
                  className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Guest Count */}
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                  Party Size
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

              {/* Preferred Date */}
              <div>
                <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                  Date <span className="text-red-700">*</span>
                </label>
                <input
                  type="date"
                  required
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
                placeholder="e.g. Quiet corner with laptop plug, oat milk preference, high chair, etc."
                className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso resize-none"
              />
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-muted-gold" />
                {isSubmitting ? "RECORDING RESERVATION..." : "CONFIRM & SYNC VIA WHATSAPP"}
              </Button>
              <p className="text-[10px] font-sans text-center text-espresso/60 uppercase tracking-widest mt-2">
                Instant confirmation reference • Walk-ins always welcomed • No booking fee
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
