import { CreateReservationInput, ReservationStatus } from "@/types/reservation";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateReservationInput(input: CreateReservationInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Name
  if (!input.guestName || input.guestName.trim().length < 2) {
    errors.guestName = "Guest name must be at least 2 characters.";
  }

  // Phone
  const cleanPhone = input.phone ? input.phone.replace(/[\s\-()]/g, "") : "";
  if (!cleanPhone || cleanPhone.length < 8) {
    errors.phone = "Please provide a valid contact phone number (at least 8 digits).";
  }

  // Email (Optional)
  if (input.email && input.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // Date
  if (!input.reservationDate) {
    errors.reservationDate = "Reservation date is required.";
  } else {
    const dateObj = new Date(input.reservationDate);
    if (isNaN(dateObj.getTime())) {
      errors.reservationDate = "Invalid date format.";
    }
  }

  // Time Slot
  if (!input.timeSlot || !input.timeSlot.trim()) {
    errors.timeSlot = "Time window is required.";
  }

  // Guests Count
  const count = Number(input.guestsCount);
  if (isNaN(count) || count < 1 || count > 50) {
    errors.guestsCount = "Party size must be between 1 and 50 guests.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isValidReservationStatus(status: string): status is ReservationStatus {
  return ["pending", "confirmed", "cancelled", "completed", "no_show", "seated"].includes(status);
}
