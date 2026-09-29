import { Reservation } from "@/types/reservation";
import { siteConfig } from "@/data/site";

export const notificationService = {
  /**
   * Generates a direct WhatsApp link for the customer to confirm their booking with the cafe.
   */
  generateCustomerBookingWhatsAppUrl(reservation: Reservation): string {
    const text = encodeURIComponent(
      `☕ *TABLE RESERVATION INQUIRY*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Ref: *#${reservation.referenceNumber}*\n` +
      `• Guest: ${reservation.guestName}\n` +
      `• Date: ${reservation.reservationDate}\n` +
      `• Time: ${reservation.timeSlot}\n` +
      `• Party Size: ${reservation.guestsCount} guests\n` +
      `• Area: ${reservation.seatingArea.toUpperCase()}\n` +
      (reservation.specialNotes ? `• Notes: ${reservation.specialNotes}\n` : "") +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Hello ${siteConfig.name} team! I submitted this table booking request. Please let me know your availability. Thank you!`
    );

    return `https://wa.me/${siteConfig.whatsapp}?text=${text}`;
  },

  /**
   * Generates an Owner-to-Customer confirmation WhatsApp link.
   */
  generateOwnerConfirmationWhatsAppUrl(reservation: Reservation): string {
    const cleanPhone = reservation.phone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `☕ *MOVI COFFEE — RESERVATION CONFIRMED*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Dear ${reservation.guestName},\n\n` +
      `Your table reservation *#${reservation.referenceNumber}* is CONFIRMED!\n\n` +
      `📅 *Date:* ${reservation.reservationDate}\n` +
      `⏰ *Time:* ${reservation.timeSlot}\n` +
      `👥 *Party:* ${reservation.guestsCount} Guests\n` +
      `📍 *Location:* ${siteConfig.address}\n\n` +
      `We look forward to welcoming you for exceptional coffee and a slow, relaxing time.\n` +
      `Need to modify? Reply to this message anytime.`
    );

    return `https://wa.me/${cleanPhone}?text=${text}`;
  },
};
