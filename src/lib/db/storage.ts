import { Reservation, CreateReservationInput, ReservationStatus, SeatingArea } from "@/types/reservation";
import { BusinessSettings, SeasonalExperience } from "@/types/settings";
import { AnalyticsEvent } from "@/types/analytics";
import { CafeTable } from "@/types/table";
import { Customer } from "@/types/customer";
import { siteConfig } from "@/data/site";
import { seasonalExperiencesCatalog, resolveActiveSeasonalExperience } from "@/data/seasonal";

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
  tables: CafeTable[];
  customers: Customer[];
  settings: BusinessSettings;
  seasonal: SeasonalExperience[];
  analytics: AnalyticsEvent[];
  menuAvailability: Record<string, boolean>; // id -> isAvailable
}

// Global reference to persist across Fast Refresh in development
declare global {
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
  tables: [
    { id: "tbl-01", tableNumber: "T-01", capacity: 2, seatingArea: "quiet-nook", isAvailable: true, isActive: true, notes: "Near window & power outlets", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-02", tableNumber: "T-02", capacity: 2, seatingArea: "quiet-nook", isAvailable: true, isActive: true, notes: "Cozy corner table", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-03", tableNumber: "T-03", capacity: 4, seatingArea: "salon", isAvailable: true, isActive: true, notes: "Main espresso bar view", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-04", tableNumber: "T-04", capacity: 4, seatingArea: "salon", isAvailable: true, isActive: true, notes: "Leather booth seating", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-05", tableNumber: "T-05", capacity: 6, seatingArea: "salon", isAvailable: true, isActive: true, notes: "Spacious salon center table", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-06", tableNumber: "T-06", capacity: 8, seatingArea: "communal", isAvailable: true, isActive: true, notes: "Solid teak communal tasting table", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-07", tableNumber: "C-01", capacity: 2, seatingArea: "courtyard", isAvailable: true, isActive: true, notes: "Garden breeze courtyard table", createdAt: "2026-09-01T00:00:00.000Z" },
    { id: "tbl-08", tableNumber: "C-02", capacity: 4, seatingArea: "courtyard", isAvailable: true, isActive: true, notes: "Canopied outdoor lounge table", createdAt: "2026-09-01T00:00:00.000Z" },
  ],
  customers: [
    {
      id: "cust-001",
      name: "Nimal Perera",
      phone: "+94 77 123 4567",
      email: "nimal.p@example.com",
      totalVisits: 3,
      lastVisitAt: "2026-09-29T08:30:00.000Z",
      preferredSeating: "quiet-nook",
      dietaryNotes: "Oat milk latte regular",
      createdAt: "2026-08-15T10:00:00.000Z",
      updatedAt: "2026-09-29T08:30:00.000Z",
    },
    {
      id: "cust-002",
      name: "Sanduni Jayawardena",
      phone: "+94 71 987 6543",
      email: "sanduni.j@example.com",
      totalVisits: 2,
      lastVisitAt: "2026-09-29T14:15:00.000Z",
      preferredSeating: "courtyard",
      dietaryNotes: "Cold Brew enthusiast",
      createdAt: "2026-09-01T12:00:00.000Z",
      updatedAt: "2026-09-29T14:15:00.000Z",
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
  seasonal: [...seasonalExperiencesCatalog],
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
      seatingArea: input.seatingArea || "any",
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

  async checkSlotCapacity(date: string, timeSlot: string): Promise<{ bookedGuests: number; maxCapacity: number }> {
    const maxCapacity = 24;
    const bookedGuests = db.reservations
      .filter(
        (r) =>
          r.reservationDate === date &&
          r.timeSlot === timeSlot &&
          (r.status === "pending" || r.status === "confirmed" || r.status === "seated")
      )
      .reduce((sum, r) => sum + (Number(r.guestsCount) || 0), 0);
    return { bookedGuests, maxCapacity };
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
    return resolveActiveSeasonalExperience(db.seasonal);
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

  // Tables
  async getAllTables(): Promise<CafeTable[]> {
    return [...(db.tables || [])].sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));
  },

  async getTables(): Promise<CafeTable[]> {
    return [...(db.tables || [])].filter((t) => t.isActive).sort((a, b) => a.tableNumber.localeCompare(b.tableNumber));
  },

  async toggleTableStatus(id: string, isActive: boolean): Promise<CafeTable | null> {
    const table = db.tables?.find((t) => t.id === id);
    if (!table) return null;
    table.isActive = isActive;
    return table;
  },

  async addTable(input: { tableNumber: string; capacity: number; seatingArea: SeatingArea; notes?: string }): Promise<CafeTable> {
    const newTable: CafeTable = {
      id: `tbl-${Date.now()}`,
      tableNumber: input.tableNumber,
      capacity: input.capacity,
      seatingArea: input.seatingArea,
      isAvailable: true,
      isActive: true,
      notes: input.notes,
      createdAt: new Date().toISOString(),
    };
    if (!db.tables) db.tables = [];
    db.tables.push(newTable);
    return newTable;
  },

  async assignTable(reservationId: string, tableId: string | null): Promise<Reservation | null> {
    const res = db.reservations.find((r) => r.id === reservationId);
    if (!res) return null;
    res.tableId = tableId || undefined;
    res.updatedAt = new Date().toISOString();
    return res;
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return [...(db.customers || [])].sort((a, b) => {
      const aTime = a.lastVisitAt ? new Date(a.lastVisitAt).getTime() : 0;
      const bTime = b.lastVisitAt ? new Date(b.lastVisitAt).getTime() : 0;
      return bTime - aTime;
    });
  },
};
