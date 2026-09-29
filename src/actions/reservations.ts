"use server";

import { dbStorage } from "@/lib/db/storage";
import { CreateReservationInput, Reservation, ReservationStatus, SeatingArea } from "@/types/reservation";
import { notificationService } from "@/lib/notifications/whatsapp";
import { revalidatePath } from "next/cache";

export interface ReservationActionResult {
  success: boolean;
  reservation?: Reservation;
  whatsappUrl?: string;
  error?: string;
}

export async function createReservationAction(input: CreateReservationInput): Promise<ReservationActionResult> {
  try {
    if (!input.guestName?.trim()) {
      return { success: false, error: "Please provide your full name." };
    }
    if (!input.phone?.trim()) {
      return { success: false, error: "Please provide a valid contact phone number." };
    }
    if (!input.reservationDate) {
      return { success: false, error: "Please select a preferred date." };
    }
    if (!input.timeSlot) {
      return { success: false, error: "Please choose a preferred time slot." };
    }

    const reservation = await dbStorage.createReservation({
      guestName: input.guestName.trim(),
      email: input.email?.trim() || "",
      phone: input.phone.trim(),
      guestsCount: Number(input.guestsCount) || 2,
      reservationDate: input.reservationDate,
      timeSlot: input.timeSlot,
      seatingArea: (input.seatingArea as SeatingArea) || "any",
      specialNotes: input.specialNotes?.trim() || "",
    });

    const whatsappUrl = notificationService.generateCustomerBookingWhatsAppUrl(reservation);

    // Track analytics event
    await dbStorage.recordAnalytics({
      type: "booking_completed",
      path: "/visit",
      metadata: {
        ref: reservation.referenceNumber,
        guests: reservation.guestsCount,
        area: reservation.seatingArea,
      },
    });

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
    const updated = await dbStorage.updateReservationStatus(id, status);
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
