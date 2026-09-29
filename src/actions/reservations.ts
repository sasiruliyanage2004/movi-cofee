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

export async function createReservationAction(input: CreateReservationInput): Promise<ReservationActionResult> {
  try {
    // 1. Strict validation
    const validation = validateReservationInput(input);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      return { success: false, error: firstError, errors: validation.errors };
    }

    let reservation: Reservation | null = null;

    // 2. Try Supabase backend if configured
    if (isSupabaseServerConfigured()) {
      reservation = await supabaseService.createReservation(input);
    }

    // 3. Fallback to local persistent store if Supabase not yet initialized
    if (!reservation) {
      reservation = await dbStorage.createReservation({
        guestName: input.guestName.trim(),
        email: input.email?.trim() || "",
        phone: input.phone.trim(),
        guestsCount: Number(input.guestsCount) || 2,
        reservationDate: input.reservationDate,
        timeSlot: input.timeSlot,
        seatingArea: (input.seatingArea as SeatingArea) || "any",
        specialNotes: input.specialNotes?.trim() || input.specialRequest?.trim() || "",
      });
    }

    const whatsappUrl = notificationService.generateCustomerBookingWhatsAppUrl(reservation);

    // 4. Record Notification
    if (isSupabaseServerConfigured()) {
      await supabaseService.recordNotification({
        reservationId: reservation.id,
        channel: "whatsapp",
        recipient: reservation.phone,
        title: "Reservation Request",
        body: `Booking request #${reservation.referenceNumber} received.`,
        status: "sent",
      });
    }

    // 5. Track Analytics Event
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

export async function updateReservationStatusAction(id: string, status: ReservationStatus) {
  try {
    if (!isValidReservationStatus(status)) {
      return { success: false, error: "Invalid reservation status." };
    }

    let updated: Reservation | null = null;

    if (isSupabaseServerConfigured()) {
      const ok = await supabaseService.updateReservationStatus(id, status);
      if (ok) {
        // Fetch updated reservation
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
