import { Reservation, CreateReservationInput, ReservationStatus } from "@/types/reservation";
import { BusinessSettings, SeasonalExperience } from "@/types/settings";
import { AnalyticsEvent } from "@/types/analytics";
import { siteConfig } from "@/data/site";

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: "unread" | "read" | "replied";
}

// In-memory global store with default seed data
interface PlatformDatabase {
  reservations: Reservation[];
  inquiries: ContactInquiry[];
  settings: BusinessSettings;
  seasonal: SeasonalExperience[];
  analytics: AnalyticsEvent[];
  menuAvailability: Record<string, boolean>; // id -> isAvailable
}

// Global reference to persist across Fast Refresh in development
declare global {
  // eslint-disable-next-line no-var
  var __movi_db__: PlatformDatabase | undefined;
}

const initialDatabase: PlatformDatabase = {
  reservations: [
    {
      id: "res-001",
      referenceNumber: "MC-4819",
      guestName: "Nimal Perera",
      email: "nimal.p@example.com",
      phone: "+94 77 123 4567",
      guestsCount: 2,
      reservationDate: "2026-10-02",
      timeSlot: "10:30 AM",
      seatingArea: "quiet-nook",
      specialNotes: "Window view preferred with laptop plug",
      status: "confirmed",
      createdAt: "2026-09-29T08:30:00.000Z",
      updatedAt: "2026-09-29T08:30:00.000Z",
    },
    {
      id: "res-002",
      referenceNumber: "MC-5921",
      guestName: "Sanduni Jayawardena",
      email: "sanduni.j@example.com",
      phone: "+94 71 987 6543",
      guestsCount: 4,
      reservationDate: "2026-10-03",
      timeSlot: "04:00 PM",
      seatingArea: "courtyard",
      specialNotes: "Birthday afternoon coffee & pastries",
      status: "pending",
      createdAt: "2026-09-29T14:15:00.000Z",
      updatedAt: "2026-09-29T14:15:00.000Z",
    },
  ],
  inquiries: [
    {
      id: "inq-001",
      name: "Kasun Fernando",
      email: "kasun@creativelabs.lk",
      phone: "+94 76 555 1234",
      message: "Hello team, can we host a small photography and design workshop (8 guests) on a Sunday morning?",
      createdAt: "2026-09-28T11:00:00.000Z",
      status: "unread",
    },
  ],
  settings: {
    shopName: "MOVI COFFEE",
    tagline: "GOOD COFFEE. BETTER MOMENTS.",
    address: "Kaduwela Road, Kaduwela, Sri Lanka",
    city: "Kaduwela",
    phone: "+94 11 234 5678",
    whatsapp: "94770000000",
    email: "hello@movicoffee.lk",
    openingHoursWeekday: "7:00 AM – 10:00 PM",
    openingHoursWeekend: "7:30 AM – 11:00 PM",
    googleMapsUrl: siteConfig.mapUrl,
    isAcceptingReservations: true,
    maxPartySize: 12,
  },
  seasonal: [
    {
      id: "season-001",
      title: "Ceylon Cinnamon & Hazelnut Roast",
      tag: "HARVEST SPECIAL",
      highlightText: "LIMITED SINGLE-ORIGIN RELEASE",
      description: "Carefully roasted with artisan Sri Lankan highland beans, notes of toasted hazelnut, organic cinnamon bark, and panela.",
      ctaLabel: "EXPLORE COFFEE",
      ctaHref: "/menu",
      isActive: true,
      startDate: "2026-09-01",
      endDate: "2026-11-30",
    },
  ],
  analytics: [],
  menuAvailability: {},
};

if (!globalThis.__movi_db__) {
  globalThis.__movi_db__ = initialDatabase;
}

const db = globalThis.__movi_db__;

// Database helper functions
export const dbStorage = {
  // Reservations
  async getReservations(): Promise<Reservation[]> {
    return [...db.reservations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getReservationById(id: string): Promise<Reservation | null> {
    return db.reservations.find((r) => r.id === id) || null;
  },

  async getReservationByRef(ref: string): Promise<Reservation | null> {
    return db.reservations.find((r) => r.referenceNumber.toLowerCase() === ref.toLowerCase()) || null;
  },

  async createReservation(input: CreateReservationInput): Promise<Reservation> {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `MC-${randomDigits}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}-${randomDigits}`,
      referenceNumber,
      ...input,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.reservations.unshift(newReservation);
    return newReservation;
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const res = db.reservations.find((r) => r.id === id);
    if (!res) return null;
    res.status = status;
    res.updatedAt = new Date().toISOString();
    return res;
  },

  // Contact Inquiries
  async getInquiries(): Promise<ContactInquiry[]> {
    return [...db.inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createInquiry(input: Omit<ContactInquiry, "id" | "createdAt" | "status">): Promise<ContactInquiry> {
    const inquiry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      ...input,
      status: "unread",
      createdAt: new Date().toISOString(),
    };
    db.inquiries.unshift(inquiry);
    return inquiry;
  },

  // Business Settings
  async getBusinessSettings(): Promise<BusinessSettings> {
    return { ...db.settings };
  },

  async updateBusinessSettings(newSettings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    db.settings = { ...db.settings, ...newSettings };
    return { ...db.settings };
  },

  // Seasonal Experiences
  async getSeasonalExperiences(): Promise<SeasonalExperience[]> {
    return [...db.seasonal];
  },

  async getActiveSeasonalExperience(): Promise<SeasonalExperience | null> {
    const now = new Date().toISOString().split("T")[0];
    return (
      db.seasonal.find(
        (s) => s.isActive && s.startDate <= now && s.endDate >= now
      ) || null
    );
  },

  async updateSeasonalExperience(id: string, updates: Partial<SeasonalExperience>): Promise<SeasonalExperience | null> {
    const item = db.seasonal.find((s) => s.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    return item;
  },

  // Menu Availability (Stock)
  async getMenuAvailability(): Promise<Record<string, boolean>> {
    return { ...db.menuAvailability };
  },

  async setMenuItemAvailability(itemId: string, isAvailable: boolean): Promise<void> {
    db.menuAvailability[itemId] = isAvailable;
  },

  // Analytics
  async recordAnalytics(event: Omit<AnalyticsEvent, "id" | "timestamp">): Promise<void> {
    const newEvent: AnalyticsEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...event,
      timestamp: new Date().toISOString(),
    };
    db.analytics.unshift(newEvent);
    // Keep max 1000 events in memory
    if (db.analytics.length > 1000) {
      db.analytics.length = 1000;
    }
  },

  async getAnalyticsSummary() {
    const totalPageViews = db.analytics.filter((e) => e.type === "page_view").length;
    const totalBookings = db.reservations.length;
    
    const itemViews: Record<string, number> = {};
    db.analytics
      .filter((e) => e.type === "menu_item_view" && e.metadata?.itemName)
      .forEach((e) => {
        const name = String(e.metadata!.itemName);
        itemViews[name] = (itemViews[name] || 0) + 1;
      });

    const popularItems = Object.entries(itemViews)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    return {
      totalPageViews,
      totalBookings,
      popularItems,
      recentEvents: db.analytics.slice(0, 20),
    };
  },
};
