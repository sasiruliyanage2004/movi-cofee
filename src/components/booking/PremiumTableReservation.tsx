"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Hash,
  Sparkles,
  MapPin,
  Check,
  CalendarPlus,
  Loader2
} from "lucide-react";
import { SeatingArea, Reservation } from "@/types/reservation";
import {
  checkTimeSlotAvailabilityAction,
  createReservationAction,
  SlotAvailabilityResult
} from "@/actions/reservations";

interface PremiumTableReservationProps {
  onSuccessClose?: () => void;
  isModal?: boolean;
}

const TIME_SLOTS = [
  { label: "08:00 AM", period: "Morning" },
  { label: "09:00 AM", period: "Morning" },
  { label: "10:30 AM", period: "Morning" },
  { label: "11:30 AM", period: "Morning" },
  { label: "12:30 PM", period: "Midday" },
  { label: "02:00 PM", period: "Afternoon" },
  { label: "03:30 PM", period: "Afternoon" },
  { label: "04:30 PM", period: "Afternoon" },
  { label: "05:30 PM", period: "Evening" },
  { label: "06:30 PM", period: "Evening" },
  { label: "07:30 PM", period: "Evening" },
  { label: "08:30 PM", period: "Evening" },
];

const SEATING_AREAS: { id: SeatingArea; name: string; desc: string }[] = [
  {
    id: "quiet-nook",
    name: "Quiet Study Nook",
    desc: "Indoor air-conditioned corner with laptop power outlets and filtered daylight.",
  },
  {
    id: "salon",
    name: "Main AC Salon",
    desc: "Generous banquette seating surrounded by warm lighting and espresso aromas.",
  },
  {
    id: "courtyard",
    name: "Sheltered Courtyard",
    desc: "Covered open-air terrace with tropical foliage and natural breeze.",
  },
  {
    id: "communal",
    name: "Artisan Communal Table",
    desc: "Handcrafted solid timber table ideal for lively conversations & group work.",
  },
  {
    id: "any",
    name: "First Available Seating",
    desc: "Flexible priority placement assigned by the lead barista upon arrival.",
  },
];

export const PremiumTableReservation: React.FC<PremiumTableReservationProps> = ({
  onSuccessClose,
  isModal = false,
}) => {
  // Step state: 1 = Date & Time & Guests, 2 = Contact & Seating, 3 = Review, 4 = Confirmed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form fields
  const todayStr = new Date().toISOString().split("T")[0];
  const [reservationDate, setReservationDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState("10:30 AM");
  const [guestsCount, setGuestsCount] = useState(2);
  const [seatingArea, setSeatingArea] = useState<SeatingArea>("salon");
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  // Live availability state
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);
  const [slotStatus, setSlotStatus] = useState<SlotAvailabilityResult | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success result
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reservation: Reservation;
    whatsappUrl: string;
  } | null>(null);

  // Check live capacity whenever date, time slot, or guest count changes
  useEffect(() => {
    let isCancelled = false;
    async function verifyCapacity() {
      if (!reservationDate || !timeSlot) return;
      setIsCheckingSlot(true);
      try {
        const res = await checkTimeSlotAvailabilityAction(reservationDate, timeSlot, guestsCount);
        if (!isCancelled) {
          setSlotStatus(res);
        }
      } catch {
        if (!isCancelled) {
          setSlotStatus(null);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingSlot(false);
        }
      }
    }
    verifyCapacity();
    return () => {
      isCancelled = true;
    };
  }, [reservationDate, timeSlot, guestsCount]);

  // Validate Step 1
  const handleProceedToStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!reservationDate) {
      newErrors.reservationDate = "Please choose a reservation date.";
    }
    if (!timeSlot) {
      newErrors.timeSlot = "Please choose a preferred time slot.";
    }
    if (guestsCount < 1 || guestsCount > 25) {
      newErrors.guestsCount = "Party size must be between 1 and 25 guests.";
    }
    if (slotStatus && !slotStatus.available) {
      newErrors.timeSlot = slotStatus.reason || "This time slot is overbooked. Please select another time window.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(2);
  };

  // Validate Step 2
  const handleProceedToReview = () => {
    const newErrors: Record<string, string> = {};
    if (!guestName.trim() || guestName.trim().length < 2) {
      newErrors.guestName = "Please enter your full name (at least 2 characters).";
    }

    const cleanPhone = phone.replace(/[\s\-()]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      newErrors.phone = "Please enter a valid phone number with digits.";
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setCurrentStep(3);
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await createReservationAction({
        guestName,
        phone,
        email,
        reservationDate,
        timeSlot,
        guestsCount,
        seatingArea,
        specialRequest,
      });

      if (result.success && result.reservation && result.whatsappUrl) {
        setConfirmedBooking({
          reservation: result.reservation,
          whatsappUrl: result.whatsappUrl,
        });
        setCurrentStep(4);
      } else {
        setSubmissionError(result.error || "Unable to confirm reservation. Please choose another time or call us.");
      }
    } catch {
      setSubmissionError("Network communication error. Please try again or reach us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setErrors({});
    setSubmissionError(null);
    if (onSuccessClose) {
      onSuccessClose();
    }
  };

  return (
    <div className={`w-full ${isModal ? "" : "max-w-3xl mx-auto"} font-sans`}>
      {/* Progress Stepper Bar (Only in active steps 1-3) */}
      {currentStep !== 4 && (
        <div className="mb-6 sm:mb-8 border-b border-espresso/15 pb-4">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-sans uppercase tracking-[0.2em]">
            <span
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                currentStep >= 1 ? "text-espresso font-semibold" : "text-espresso/40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep >= 1 ? "bg-espresso text-warm-cream" : "bg-espresso/10 text-espresso/50"
                }`}
              >
                1
              </span>
              <span>Date & Time</span>
            </span>

            <span className="w-8 sm:w-16 h-px bg-espresso/15" />

            <span
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                currentStep >= 2 ? "text-espresso font-semibold" : "text-espresso/40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep >= 2 ? "bg-espresso text-warm-cream" : "bg-espresso/10 text-espresso/50"
                }`}
              >
                2
              </span>
              <span>Details & Seating</span>
            </span>

            <span className="w-8 sm:w-16 h-px bg-espresso/15" />

            <span
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                currentStep >= 3 ? "text-espresso font-semibold" : "text-espresso/40"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === 3 ? "bg-espresso text-warm-cream" : "bg-espresso/10 text-espresso/50"
                }`}
              >
                3
              </span>
              <span>Review</span>
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: DATE, GUEST COUNT & TIME SLOT SELECTION */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
              STEP 1 OF 3 • RESERVATION TIME & PARTY
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
              When would you like to visit?
            </h3>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-1 font-light">
              Select your date and time. Our system checks real-time seat availability to prevent overbooking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Date Picker */}
            <div>
              <label
                htmlFor="res-date"
                className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium"
              >
                Select Date <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="res-date"
                  type="date"
                  min={todayStr}
                  value={reservationDate}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className={`w-full bg-soft-beige/40 border px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso cursor-pointer ${
                    errors.reservationDate ? "border-red-500" : "border-espresso/20"
                  }`}
                />
              </div>
              {errors.reservationDate && (
                <p className="text-xs text-red-600 mt-1">{errors.reservationDate}</p>
              )}
            </div>

            {/* 2. Number of Guests */}
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium">
                Party Size (Guests) <span className="text-red-700">*</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[1, 2, 3, 4, 5, 6, 8, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestsCount(num)}
                    className={`w-10 h-10 shrink-0 border text-xs font-sans transition-colors cursor-pointer flex items-center justify-center font-medium ${
                      guestsCount === num
                        ? "bg-espresso text-warm-cream border-espresso font-semibold shadow-sm"
                        : "bg-soft-beige/30 text-espresso border-espresso/20 hover:border-espresso"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Available Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee font-medium">
                Select Time Window <span className="text-red-700">*</span>
              </label>
              {isCheckingSlot && (
                <span className="text-[10px] text-muted-coffee flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-muted-gold" />
                  Checking capacity...
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isSelected = timeSlot === slot.label;
                return (
                  <button
                    key={slot.label}
                    type="button"
                    onClick={() => setTimeSlot(slot.label)}
                    className={`p-2.5 border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-espresso text-warm-cream border-espresso shadow-sm"
                        : "bg-soft-beige/25 hover:bg-soft-beige/50 text-espresso border-espresso/15"
                    }`}
                  >
                    <span className="font-mono text-xs font-semibold">{slot.label}</span>
                    <span
                      className={`text-[9px] uppercase tracking-wider mt-1 ${
                        isSelected ? "text-muted-gold" : "text-muted-coffee"
                      }`}
                    >
                      {slot.period}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Capacity status pill */}
            {slotStatus && (
              <div
                className={`mt-3 p-3 text-xs border flex items-center gap-2 ${
                  slotStatus.available
                    ? "bg-emerald-50/60 border-emerald-300 text-emerald-900"
                    : "bg-red-50 border-red-300 text-red-800"
                }`}
              >
                {slotStatus.available ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Available!</strong> {slotStatus.remainingCapacity} seats open for{" "}
                      {timeSlot} on {reservationDate}.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{slotStatus.reason}</span>
                  </>
                )}
              </div>
            )}
            {errors.timeSlot && <p className="text-xs text-red-600 mt-1">{errors.timeSlot}</p>}
          </div>

          {/* Action */}
          <div className="pt-2 flex justify-end">
            <Button
              variant="gold"
              size="md"
              type="button"
              onClick={handleProceedToStep2}
              disabled={isCheckingSlot || (slotStatus !== null && !slotStatus.available)}
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <span>CONTINUE TO DETAILS</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: GUEST DETAILS & SEATING AREA */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
              STEP 2 OF 3 • SEATING PREFERENCE & GUEST CONTACT
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
              Seating & Contact Details
            </h3>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-1 font-light">
              Choose your preferred café zone and enter your contact details for instant confirmation.
            </p>
          </div>

          {/* Seating Area Selection */}
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-2 font-medium">
              Choose Seating Area
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SEATING_AREAS.map((area) => {
                const isSelected = seatingArea === area.id;
                return (
                  <div
                    key={area.id}
                    onClick={() => setSeatingArea(area.id)}
                    className={`p-3.5 border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-espresso text-warm-cream border-espresso shadow-md ring-1 ring-muted-gold"
                        : "bg-soft-beige/25 hover:bg-soft-beige/50 text-espresso border-espresso/15"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm sm:text-base font-medium">
                        {area.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-muted-gold" />}
                    </div>
                    <p
                      className={`text-xs mt-1 font-light ${
                        isSelected ? "text-warm-cream/80" : "text-espresso/70"
                      }`}
                    >
                      {area.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="res-name"
                className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium"
              >
                Full Name <span className="text-red-700">*</span>
              </label>
              <input
                id="res-name"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Kasun Liyanage"
                className={`w-full bg-soft-beige/40 border px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso ${
                  errors.guestName ? "border-red-500" : "border-espresso/20"
                }`}
              />
              {errors.guestName && (
                <p className="text-xs text-red-600 mt-1">{errors.guestName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="res-phone"
                className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium"
              >
                Phone Number / WhatsApp <span className="text-red-700">*</span>
              </label>
              <input
                id="res-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+94 7X XXX XXXX"
                className={`w-full bg-soft-beige/40 border px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso ${
                  errors.phone ? "border-red-500" : "border-espresso/20"
                }`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label
              htmlFor="res-email"
              className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium"
            >
              Email Address <span className="text-espresso/40">(Optional)</span>
            </label>
            <input
              id="res-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={`w-full bg-soft-beige/40 border px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso ${
                errors.email ? "border-red-500" : "border-espresso/20"
              }`}
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label
              htmlFor="res-notes"
              className="block text-[11px] font-sans uppercase tracking-[0.16em] text-muted-coffee mb-1.5 font-medium"
            >
              Special Requests or Dietary Notes <span className="text-espresso/40">(Optional)</span>
            </label>
            <textarea
              id="res-notes"
              rows={2}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="e.g. Need high chair, quiet laptop nook, celebration/anniversary pause..."
              className="w-full bg-soft-beige/40 border border-espresso/20 px-3.5 py-2.5 text-sm text-espresso font-sans focus:outline-none focus:border-espresso resize-none"
            />
          </div>

          {/* Stepper Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-espresso/70 hover:text-espresso cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <Button
              variant="gold"
              size="md"
              type="button"
              onClick={handleProceedToReview}
              className="flex items-center gap-2"
            >
              <span>REVIEW RESERVATION</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: REVIEW RESERVATION */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-muted-gold font-medium block mb-1">
              STEP 3 OF 3 • VERIFY & CONFIRM
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-espresso font-normal">
              Review Your Reservation
            </h3>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 mt-1 font-light">
              Please double check your date, time window, and party size before saving.
            </p>
          </div>

          {/* Review Card */}
          <div className="bg-soft-beige/40 border border-espresso/20 p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-espresso/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                  Date
                </span>
                <span className="font-medium text-espresso text-sm sm:text-base flex items-center gap-1 mt-0.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-muted-gold" />
                  {reservationDate}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                  Time Window
                </span>
                <span className="font-medium text-espresso text-sm sm:text-base flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-muted-gold" />
                  {timeSlot}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                  Party Size
                </span>
                <span className="font-medium text-espresso text-sm sm:text-base flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-muted-gold" />
                  {guestsCount} Guests
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                  Seating Area
                </span>
                <span className="font-medium text-espresso text-sm sm:text-base capitalize mt-0.5 block">
                  {seatingArea.replace("-", " ")}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                  Guest Name
                </span>
                <span className="font-medium text-espresso text-sm">{guestName}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                  Contact Phone
                </span>
                <span className="font-medium text-espresso text-sm font-mono">{phone}</span>
              </div>

              {email && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                    Email
                  </span>
                  <span className="text-espresso text-sm">{email}</span>
                </div>
              )}

              {specialRequest && (
                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-coffee block">
                    Special Notes
                  </span>
                  <span className="text-espresso/80 text-xs italic">&ldquo;{specialRequest}&rdquo;</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-espresso/10 flex items-center gap-2 text-[11px] text-muted-coffee">
              <Sparkles className="w-3.5 h-3.5 text-muted-gold shrink-0" />
              <span>
                Zero reservation fees • Instant reference code generated upon confirmation
              </span>
            </div>
          </div>

          {submissionError && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{submissionError}</span>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-espresso/70 hover:text-espresso cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </button>

            <Button
              variant="primary"
              size="lg"
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-muted-gold" />
                  <span>SECURING RESERVATION...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-muted-gold" />
                  <span>CONFIRM RESERVATION</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: SUCCESS CONFIRMATION & WHATSAPP SYNC */}
      {/* ========================================================================= */}
      {currentStep === 4 && confirmedBooking && (
        <div className="py-6 sm:py-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-muted-gold/20 border border-muted-gold/40 flex items-center justify-center mx-auto text-espresso shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-muted-coffee" />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-espresso/5 border border-espresso/15 text-xs font-mono font-semibold text-espresso mb-2">
              <Hash className="w-3.5 h-3.5 text-muted-gold" />
              BOOKING REF: #{confirmedBooking.reservation.referenceNumber}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-espresso font-normal mt-1">
              Table Reserved!
            </h3>
            <p className="font-sans text-xs sm:text-sm text-espresso/70 max-w-md mx-auto mt-2 font-light">
              Thank you, <strong>{confirmedBooking.reservation.guestName}</strong>. Your table for{" "}
              <strong>{confirmedBooking.reservation.guestsCount} guests</strong> has been secured for{" "}
              <strong>
                {confirmedBooking.reservation.reservationDate} at{" "}
                {confirmedBooking.reservation.timeSlot}
              </strong>.
            </p>
          </div>

          {/* Quick Info Chip */}
          <div className="bg-soft-beige/40 border border-espresso/15 p-4 max-w-md mx-auto text-xs text-left space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-coffee uppercase text-[10px] tracking-wider">Status:</span>
              <span className="font-semibold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                {confirmedBooking.reservation.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-coffee uppercase text-[10px] tracking-wider">Location:</span>
              <span className="font-medium text-espresso">{siteConfig.location.city}, Sri Lanka</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-coffee uppercase text-[10px] tracking-wider">Seating Area:</span>
              <span className="font-medium text-espresso capitalize">
                {confirmedBooking.reservation.seatingArea.replace("-", " ")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <Button
              variant="gold"
              size="md"
              type="button"
              onClick={() => window.open(confirmedBooking.whatsappUrl, "_blank")}
              className="flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>SYNC VIA WHATSAPP</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={handleReset}
            >
              <span>DONE</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
