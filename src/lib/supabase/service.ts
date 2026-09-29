import { getSupabaseServerClient } from "./server";
import { Reservation, CreateReservationInput, ReservationStatus } from "@/types/reservation";
import { Customer } from "@/types/customer";
import { CafeTable } from "@/types/table";
import { PlatformNotification } from "@/types/notification";
import { BusinessSettings, SeasonalExperience } from "@/types/settings";
import { AnalyticsEvent } from "@/types/analytics";

/**
 * Server-side Supabase Database Service
 * Provides full CRUD operations for public and admin operations.
 */
export const supabaseService = {
  // ==========================================
  // 1. RESERVATIONS
  // ==========================================
  async getReservations(): Promise<Reservation[] | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase] getReservations error:", error.message);
      return null;
    }

    return (data || []).map((row) => ({
      id: row.id,
      referenceNumber: row.reference_number,
      customerId: row.customer_id,
      guestName: row.guest_name,
      phone: row.phone,
      email: row.email || "",
      reservationDate: row.reservation_date,
      timeSlot: row.time_slot,
      guestsCount: row.guests_count,
      tableId: row.table_id,
      seatingArea: row.seating_area,
      specialRequest: row.special_request,
      specialNotes: row.special_request,
      status: row.status as ReservationStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async createReservation(input: CreateReservationInput): Promise<Reservation | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `MC-${randomDigits}`;

    // Upsert customer record
    let customerId: string | null = null;
    const cleanPhone = input.phone.replace(/[\s\-()]/g, "");

    const { data: customerData } = await supabase
      .from("customers")
      .select("id, total_visits")
      .eq("phone", cleanPhone)
      .maybeSingle();

    if (customerData) {
      customerId = customerData.id;
      await supabase
        .from("customers")
        .update({
          total_visits: (customerData.total_visits || 1) + 1,
          last_visit_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", customerId);
    } else {
      const { data: newCustomer } = await supabase
        .from("customers")
        .insert({
          name: input.guestName,
          phone: cleanPhone,
          email: input.email || null,
        })
        .select("id")
        .single();
      if (newCustomer) {
        customerId = newCustomer.id;
      }
    }

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        reference_number: referenceNumber,
        customer_id: customerId,
        guest_name: input.guestName,
        phone: cleanPhone,
        email: input.email || null,
        reservation_date: input.reservationDate,
        time_slot: input.timeSlot,
        guests_count: input.guestsCount,
        table_id: input.tableId || null,
        seating_area: input.seatingArea || "any",
        special_request: input.specialRequest || input.specialNotes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("[Supabase] createReservation error:", error.message);
      return null;
    }

    return {
      id: data.id,
      referenceNumber: data.reference_number,
      customerId: data.customer_id,
      guestName: data.guest_name,
      phone: data.phone,
      email: data.email || "",
      reservationDate: data.reservation_date,
      timeSlot: data.time_slot,
      guestsCount: data.guests_count,
      tableId: data.table_id,
      seatingArea: data.seating_area,
      specialRequest: data.special_request,
      specialNotes: data.special_request,
      status: data.status as ReservationStatus,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;

    const { error } = await supabase
      .from("reservations")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("[Supabase] updateReservationStatus error:", error.message);
      return false;
    }

    return true;
  },

  async checkSlotCapacity(date: string, timeSlot: string): Promise<{ bookedGuests: number; maxCapacity: number } | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const maxCapacity = 24;

    const { data, error } = await supabase
      .from("reservations")
      .select("guests_count")
      .eq("reservation_date", date)
      .eq("time_slot", timeSlot)
      .in("status", ["pending", "confirmed", "seated"]);

    if (error) {
      console.error("[Supabase] checkSlotCapacity error:", error.message);
      return null;
    }

    const bookedGuests = (data || []).reduce((sum, r) => sum + (Number(r.guests_count) || 0), 0);
    return { bookedGuests, maxCapacity };
  },

  // ==========================================
  // 2. CUSTOMERS
  // ==========================================
  async getCustomers(): Promise<Customer[] | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("last_visit_at", { ascending: false });

    if (error) {
      console.error("[Supabase] getCustomers error:", error.message);
      return null;
    }

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      totalVisits: row.total_visits,
      lastVisitAt: row.last_visit_at,
      preferredSeating: row.preferred_seating,
      dietaryNotes: row.dietary_notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  // ==========================================
  // 3. TABLES
  // ==========================================
  async getTables(): Promise<CafeTable[] | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .eq("is_active", true)
      .order("table_number", { ascending: true });

    if (error) {
      console.error("[Supabase] getTables error:", error.message);
      return null;
    }

    return (data || []).map((row) => ({
      id: row.id,
      tableNumber: row.table_number,
      capacity: row.capacity,
      seatingArea: row.seating_area,
      isAvailable: row.is_available,
      isActive: row.is_active,
      notes: row.notes,
      createdAt: row.created_at,
    }));
  },

  // ==========================================
  // 4. BUSINESS SETTINGS
  // ==========================================
  async getBusinessSettings(): Promise<BusinessSettings | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      shopName: data.shop_name,
      tagline: data.tagline,
      address: data.address,
      city: data.city,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      openingHoursWeekday: data.opening_hours_weekday,
      openingHoursWeekend: data.opening_hours_weekend,
      googleMapsUrl: data.google_maps_url,
      isAcceptingReservations: data.is_accepting_reservations,
      maxPartySize: data.max_party_size,
    };
  },

  // ==========================================
  // 5. SEASONAL CAMPAIGNS
  // ==========================================
  async getActiveSeasonalCampaign(): Promise<SeasonalExperience | null> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return null;

    const now = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("seasonal_campaigns")
      .select("*")
      .eq("is_active", true)
      .lte("start_date", now)
      .gte("end_date", now)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      tag: data.tag,
      highlightText: data.highlight_text,
      description: data.description,
      ctaLabel: data.cta_label,
      ctaHref: data.cta_href,
      isActive: data.is_active,
      startDate: data.start_date,
      endDate: data.end_date,
    };
  },

  // ==========================================
  // 6. NOTIFICATIONS
  // ==========================================
  async recordNotification(notification: Omit<PlatformNotification, "id" | "createdAt">): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;

    const { error } = await supabase.from("notifications").insert({
      reservation_id: notification.reservationId || null,
      channel: notification.channel,
      recipient: notification.recipient,
      title: notification.title,
      body: notification.body,
      status: notification.status,
      sent_at: notification.sentAt || null,
    });

    return !error;
  },

  // ==========================================
  // 7. ANALYTICS
  // ==========================================
  async recordAnalyticsEvent(event: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<boolean> {
    const supabase = getSupabaseServerClient();
    if (!supabase) return false;

    const { error } = await supabase.from("analytics_events").insert({
      event_type: event.type,
      path: event.path,
      metadata: event.metadata || {},
    });

    return !error;
  },
};
