import { dbStorage } from "@/lib/db/storage";
import { supabaseService } from "@/lib/supabase/service";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";
import { menuCategories } from "@/data/menu";
import { siteConfig } from "@/data/site";
import { checkTimeSlotAvailabilityAction, createReservationAction } from "@/actions/reservations";
import { BusinessSettings } from "@/types/settings";
import { SeatingArea } from "@/types/reservation";

/**
 * Controlled Backend Tools for AI Assistant
 * The AI assistant only has access to these explicit functions and cannot execute arbitrary database queries.
 */
export const assistantTools = {
  /**
   * 1. getBusinessInfo()
   * Retrieves verified store hours, address, contact channels, and amenity services.
   */
  async getBusinessInfo() {
    let settings: BusinessSettings | null = null;
    if (isSupabaseServerConfigured()) {
      settings = await supabaseService.getBusinessSettings();
    }
    if (!settings) {
      settings = await dbStorage.getBusinessSettings();
    }

    return {
      shopName: settings.shopName || siteConfig.businessName,
      tagline: settings.tagline || siteConfig.tagline,
      address: settings.address || siteConfig.address,
      city: settings.city || siteConfig.location.city,
      phone: settings.phone || siteConfig.phone,
      whatsapp: settings.whatsapp || siteConfig.whatsapp,
      email: settings.email || siteConfig.email,
      openingHoursWeekday: settings.openingHoursWeekday || "7:00 AM – 10:00 PM",
      openingHoursWeekend: settings.openingHoursWeekend || "7:30 AM – 11:00 PM",
      googleMapsUrl: settings.googleMapsUrl || siteConfig.mapUrl,
      isAcceptingReservations: settings.isAcceptingReservations,
      maxPartySize: settings.maxPartySize || 12,
      services: [
        "Specialty Single-Origin Espresso & Pour-Over Bar",
        "Cold Brew & Nitro Artisanal Coffee",
        "Freshly Baked Pastries, Cakes & Savory Snacks",
        "Alternative Milks: Organic Oat Milk & Almond Milk",
        "Quiet Work & Study Nooks with High-Speed Wi-Fi & Power Outlets",
        "Open-Air Garden Courtyard & Terrace Seating",
        "Online Table & Gathering Reservations",
        "Takeaway & Curbside Pickup via WhatsApp Ordering",
      ],
      dietaryInformation: {
        milks: ["Whole Dairy Milk", "Barista Oat Milk (+Rs. 250)", "Almond Milk (+Rs. 250)"],
        veganOptions: ["Artisan Sourdough Toast with Avocado & Tomato", "Cold Brew Coffee", "Americano", "Matcha Latte with Oat Milk"],
        glutenFreeNotes: "We offer several naturally gluten-free beverage items; pastry selections vary daily.",
      },
    };
  },

  /**
   * 2. getMenu(category?: string, query?: string)
   * Retrieves verified menu items, real prices in LKR, tasting notes, and stock availability.
   */
  async getMenu(category?: string, query?: string) {
    const stockAvailability = await dbStorage.getMenuAvailability();

    let categories = menuCategories;
    if (category) {
      const catLower = category.toLowerCase();
      categories = categories.filter(
        (c) => c.id.toLowerCase().includes(catLower) || c.name.toLowerCase().includes(catLower)
      );
      if (categories.length === 0) categories = menuCategories;
    }

    const items = categories.flatMap((cat) =>
      cat.items.map((item) => ({
        id: item.id,
        name: item.name,
        category: cat.name,
        price: item.price,
        description: item.description,
        notes: item.notes,
        isVegetarian: item.isVegetarian,
        inStock: stockAvailability[item.id] !== false,
      }))
    );

    if (query) {
      const qLower = query.toLowerCase();
      return items.filter(
        (item) =>
          item.name.toLowerCase().includes(qLower) ||
          item.description.toLowerCase().includes(qLower) ||
          item.category.toLowerCase().includes(qLower) ||
          (item.notes && item.notes.toLowerCase().includes(qLower))
      );
    }

    return items;
  },

  /**
   * 3. checkReservationAvailability(date, timeSlot, guestsCount)
   * Real-time anti-overbooking capacity check using existing backend rules.
   */
  async checkReservationAvailability(date: string, timeSlot: string, guestsCount: number) {
    // Validate inputs
    const validGuests = Math.max(1, Math.min(20, Number(guestsCount) || 2));
    const result = await checkTimeSlotAvailabilityAction(date, timeSlot, validGuests);

    return {
      date,
      timeSlot,
      requestedGuests: validGuests,
      available: result.available,
      remainingSeats: result.remainingCapacity,
      maxCapacity: result.maxCapacity,
      reason: result.reason,
    };
  },

  /**
   * 4. createReservation(input)
   * Controlled reservation creation with database persistence and WhatsApp notification audit.
   */
  async createReservation(input: {
    guestName: string;
    phone: string;
    email?: string;
    reservationDate: string;
    timeSlot: string;
    guestsCount: number;
    seatingArea?: string;
    specialRequest?: string;
  }) {
    const validArea: SeatingArea =
      input.seatingArea === "courtyard" ||
      input.seatingArea === "salon" ||
      input.seatingArea === "quiet-nook" ||
      input.seatingArea === "communal"
        ? (input.seatingArea as SeatingArea)
        : "any";

    const res = await createReservationAction({
      guestName: input.guestName.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || "",
      reservationDate: input.reservationDate,
      timeSlot: input.timeSlot,
      guestsCount: Number(input.guestsCount) || 2,
      seatingArea: validArea,
      specialRequest: input.specialRequest?.trim(),
      specialNotes: input.specialRequest?.trim(),
    });

    if (res.success && res.reservation) {
      return {
        success: true,
        referenceNumber: res.reservation.referenceNumber,
        guestName: res.reservation.guestName,
        date: res.reservation.reservationDate,
        timeSlot: res.reservation.timeSlot,
        guestsCount: res.reservation.guestsCount,
        seatingArea: res.reservation.seatingArea,
        status: res.reservation.status,
        whatsappUrl: res.whatsappUrl,
      };
    }

    return {
      success: false,
      error: res.error || "Unable to confirm table reservation.",
    };
  },

  /**
   * 5. getReservationStatus(referenceNumber)
   * Finds a booking by reference number and reports actual status.
   */
  async getReservationStatus(referenceNumber: string) {
    const cleanRef = referenceNumber.trim().replace("#", "").toUpperCase();
    if (!cleanRef) {
      return { found: false, error: "Please provide a valid reference number (e.g. MC-1234)." };
    }

    let reservation = null;
    if (isSupabaseServerConfigured()) {
      const all = await supabaseService.getReservations();
      reservation = all?.find((r) => r.referenceNumber.toUpperCase() === cleanRef) || null;
    }

    if (!reservation) {
      reservation = await dbStorage.getReservationByRef(cleanRef);
    }

    if (!reservation) {
      return {
        found: false,
        referenceNumber: cleanRef,
        message: `No reservation found with reference #${cleanRef}. Please verify the code or contact us on WhatsApp.`,
      };
    }

    return {
      found: true,
      referenceNumber: reservation.referenceNumber,
      guestName: reservation.guestName,
      status: reservation.status,
      reservationDate: reservation.reservationDate,
      timeSlot: reservation.timeSlot,
      guestsCount: reservation.guestsCount,
      seatingArea: reservation.seatingArea,
      specialNotes: reservation.specialNotes,
    };
  },
};
