import { Reservation } from "@/types/reservation";
import { emailNotificationService } from "./email";
import { notificationService as whatsappService } from "./whatsapp";
import { supabaseService } from "@/lib/supabase/service";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";

export type ReservationLifecycleEvent = "created" | "confirmed" | "cancelled" | "updated";

export interface NotificationDispatchResult {
  success: boolean;
  emailSent: boolean;
  ownerAlerted: boolean;
  whatsappUrl: string;
}

/**
 * Multi-Channel Reservation Notification Dispatcher
 * Coordinates Email, WhatsApp Business integration, and Database Notification Auditing.
 */
export async function dispatchReservationNotification(
  event: ReservationLifecycleEvent,
  reservation: Reservation
): Promise<NotificationDispatchResult> {
  let emailSent = false;
  let ownerAlerted = false;

  // Generate appropriate WhatsApp URL based on status
  const whatsappUrl =
    reservation.status === "confirmed"
      ? whatsappService.generateOwnerConfirmationWhatsAppUrl(reservation)
      : whatsappService.generateCustomerBookingWhatsAppUrl(reservation);

  try {
    // 1. Notify Customer via Email (if email address provided)
    if (reservation.email && reservation.email.includes("@")) {
      const customerEmail = emailNotificationService.buildCustomerEmail(event, reservation);
      const emailResult = await emailNotificationService.sendEmail(customerEmail);
      emailSent = emailResult.success;
    }

    // 2. Notify Owner / Admin via Alert Email
    const ownerEmail = emailNotificationService.buildOwnerAlertEmail(event, reservation);
    const ownerResult = await emailNotificationService.sendEmail(ownerEmail);
    ownerAlerted = ownerResult.success;

    // 3. Store Database Audit in Supabase if configured
    if (isSupabaseServerConfigured()) {
      await supabaseService.recordNotification({
        reservationId: reservation.id,
        channel: "email",
        recipient: reservation.email || reservation.phone,
        title: `Reservation ${event.toUpperCase()}`,
        body: `Booking #${reservation.referenceNumber} for ${reservation.guestName} (${reservation.status}).`,
        status: "sent",
        sentAt: new Date().toISOString(),
      });
    }

    return {
      success: true,
      emailSent,
      ownerAlerted,
      whatsappUrl,
    };
  } catch (err) {
    console.error("[Notification Dispatcher] Error dispatching event:", err);
    return {
      success: false,
      emailSent: false,
      ownerAlerted: false,
      whatsappUrl,
    };
  }
}
