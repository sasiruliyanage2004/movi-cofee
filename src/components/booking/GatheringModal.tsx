"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { PremiumTableReservation } from "./PremiumTableReservation";

export interface GatheringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GatheringModal: React.FC<GatheringModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Table & Gathering Reservation"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-warm-cream border border-espresso/20 p-5 sm:p-9 shadow-2xl">
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-espresso/60 hover:text-espresso cursor-pointer z-10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Real Premium Reservation Engine */}
        <PremiumTableReservation isModal onSuccessClose={onClose} />
      </div>
    </div>
  );
};
