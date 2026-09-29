"use server";

import { dbStorage } from "@/lib/db/storage";
import { supabaseService } from "@/lib/supabase/service";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";
import { validateReservationInput, isValidReservationStatus } from "@/lib/supabase/validation";
import { CreateReservationInput, Reservation, ReservationStatus, SeatingArea } from "@/types/reservation";
import { notificationService } from "@/lib/notifications/whatsapp";
import { revalidatePath } from "next/cache";

export interface ReservationActionResult {
  success: boolean;
  reservation?: Reservation;
  whatsappUrl?: string;
  error?: string;
  errors?: Record<string, string>;
}

export interface SlotAvailabilityResult {
  available: boolean;
  remainingCapacity: number;
  bookedGuests: number;
  maxCapacity: number;
  reason?: string;
}

/**
 * Checks live capacity and anti-overbooking availability for a given date and time slot.
 */
export async function checkTimeSlotAvailabilityAction(
  date: string,
  timeSlot: string,
  requestedGuests: number
): Promise<SlotAvailabilityResult> {
  try {
    let capacity = isSupabaseServerConfigured()
      ? await supabaseService.checkSlotCapacity(date, timeSlot)
      : null;

    if (!capacity) {
      capacity = await dbStorage.checkSlotCapacity(date, timeSlot);
    }

    const { bookedGuests, maxCapacity } = capacity;
    const remainingCapacity = Math.max(0, maxCapacity - bookedGuests);
    const available = remainingCapacity >= requestedGuests;

    let reason: string | undefined;
    if (!available) {
      reason =
        remainingCapacity === 0
          ? `The ${timeSlot} window is fully committed. Please select another time.`
          : `Only ${remainingCapacity} seats remain for ${timeSlot}. Your party has ${requestedGuests} guests.`;
    }

    return {
      available,
      remainingCapacity,
      bookedGuests,
      maxCapacity,
      reason,
    };
  } catch {
    return {
      available: true,
      remainingCapacity: 24,
      bookedGuests: 0,
      maxCapacity: 24,
    };
  }
}

/**
 * Creates a validated reservation with real-time anti-overbooking enforcement.
 */
export async function createReservationAction(input: CreateReservationInput): Promise<ReservationActionResult> {
  try {
    // 1. Strict validation
    const validation = validateReservationInput(input);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError, errors: validation.errors };
    }

    const guests = Number(input.guestsCount) || 2;

    // 2. Real-time Anti-Overbooking Check
    let capacity = isSupabaseServerConfigured()
      ? await supabaseService.checkSlotCapacity(input.reservationDate, input.timeSlot)
      : null;

    if (!capacity) {
      capacity = await dbStorage.checkSlotCapacity(input.reservationDate, input.timeSlot);
    }

    if (capacity && capacity.bookedGuests + guests > capacity.maxCapacity) {
      const remaining = Math.max(0, capacity.maxCapacity - capacity.bookedGuests);
      const errorMsg =
        remaining === 0
          ? `Overbooking prevented: The ${input.timeSlot} time slot is fully booked for this date. Please select an alternate window.`
          : `Overbooking prevented: Only ${remaining} seats remain for ${input.timeSlot}.`;
      return {
        success: false,
        error: errorMsg,
      };
    }

    let reservation: Reservation | null = null;

    // 3. Persist to Supabase backend if configured
    if (isSupabaseServerConfigured()) {
      reservation = await supabaseService.createReservation(input);
    }

    // 4. Fallback to local persistent store if Supabase not yet connected
    if (!reservation) {
      reservation = await dbStorage.createReservation({
        guestName: input.guestName.trim(),
        email: input.email?.trim() || "",
        phone: input.phone.trim(),
        guestsCount: guests,
        reservationDate: input.reservationDate,
        timeSlot: input.timeSlot,
        seatingArea: (input.seatingArea as SeatingArea) || "any",
        specialNotes: input.specialNotes?.trim() || input.specialRequest?.trim() || "",
      });
    }

    const whatsappUrl = notificationService.generateCustomerBookingWhatsAppUrl(reservation);

    // 5. Record Notification Audit
    if (isSupabaseServerConfigured()) {
      await supabaseService.recordNotification({
        reservationId: reservation.id,
        channel: "whatsapp",
        recipient: reservation.phone,
        title: "Reservation Received",
        body: `Booking #${reservation.referenceNumber} for ${reservation.guestName} created.`,
        status: "sent",
      });
    }

    // 6. Track Analytics Event
    if (isSupabaseServerConfigured()) {
      await supabaseService.recordAnalyticsEvent({
        type: "booking_completed",
        path: "/visit",
        metadata: {
          ref: reservation.referenceNumber,
          guests: reservation.guestsCount,
          area: reservation.seatingArea,
        },
      });
    } else {
      await dbStorage.recordAnalytics({
        type: "booking_completed",
        path: "/visit",
        metadata: {
          ref: reservation.referenceNumber,
          guests: reservation.guestsCount,
          area: reservation.seatingArea,
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/visit");

    return {
      success: true,
      reservation,
      whatsappUrl,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to process reservation.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Updates a reservation status through the workflow:
 * pending -> confirmed | cancelled
 * confirmed -> completed | no_show
 */
export async function updateReservationStatusAction(id: string, status: ReservationStatus) {
  try {
    if (!isValidReservationStatus(status)) {
      return { success: false, error: "Invalid reservation status." };
    }

    let updated: Reservation | null = null;

    if (isSupabaseServerConfigured()) {
      const ok = await supabaseService.updateReservationStatus(id, status);
      if (ok) {
        const all = await supabaseService.getReservations();
        updated = all?.find((r) => r.id === id) || null;
      }
    }

    if (!updated) {
      updated = await dbStorage.updateReservationStatus(id, status);
    }

    if (!updated) {
      return { success: false, error: "Reservation not found." };
    }

    revalidatePath("/admin");
    return { success: true, reservation: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update reservation status.";
    return { success: false, error: errorMsg };
  }
}
