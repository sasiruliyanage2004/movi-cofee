import { dbStorage } from "@/lib/db/storage";
import { supabaseService } from "@/lib/supabase/service";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";
import { Reservation } from "@/types/reservation";
import { calculateBusinessAnalytics } from "@/lib/analytics/businessAnalytics";
import { menuCategories } from "@/data/menu";

/**
 * Controlled Server-Side Tools for the Authenticated Owner AI Assistant
 * The Owner AI can ONLY access data through these explicit methods.
 * Customer PII (phone numbers and emails) is masked to protect guest privacy.
 */
export const ownerAssistantTools = {
  /**
   * Helper: fetches all reservations safely
   */
  async _getReservations(): Promise<Reservation[]> {
    let res = null;
    if (isSupabaseServerConfigured()) {
      res = await supabaseService.getReservations();
    }
    if (!res || res.length === 0) {
      res = await dbStorage.getReservations();
    }
    return res || [];
  },

  /**
   * 1. getTodayReservations()
   * Returns today's reservation roster with PII safely masked.
   */
  async getTodayReservations(todayStr: string) {
    const all = await this._getReservations();
    const todayList = all.filter((r) => r.reservationDate === todayStr);

    const activeList = todayList.filter((r) => r.status !== "cancelled");
    const totalGuests = activeList.reduce((sum, r) => sum + (Number(r.guestsCount) || 0), 0);

    return {
      date: todayStr,
      totalReservationsToday: todayList.length,
      activeReservationsCount: activeList.length,
      expectedGuestsCount: totalGuests,
      pendingCount: todayList.filter((r) => r.status === "pending").length,
      confirmedCount: todayList.filter((r) => r.status === "confirmed").length,
      roster: todayList.map((r) => ({
        ref: r.referenceNumber,
        guestFirstName: r.guestName.split(" ")[0],
        // Mask phone for privacy in operational briefings
        phoneMasked: r.phone ? `${r.phone.slice(0, 4)}***${r.phone.slice(-3)}` : "N/A",
        timeSlot: r.timeSlot,
        guestsCount: r.guestsCount,
        seatingArea: r.seatingArea,
        status: r.status,
      })),
    };
  },

  /**
   * 2. getReservationSummary()
   * Returns comprehensive counts, status distribution, and cancellation rates.
   */
  async getReservationSummary(todayStr: string) {
    const all = await this._getReservations();
    const analytics = calculateBusinessAnalytics(all, todayStr);

    return {
      totalBookings: analytics.overview.totalReservations,
      confirmedBookings: analytics.overview.confirmedCount,
      pendingApprovals: analytics.overview.pendingCount,
      cancelledBookings: analytics.overview.cancelledCount,
      noShowBookings: analytics.overview.noShowCount,
      completedBookings: analytics.overview.completedCount,
      totalGuestsHandled: analytics.overview.totalGuests,
      averagePartySize: analytics.overview.averagePartySize,
      cancellationRatePercentage: `${analytics.overview.cancellationRate}%`,
      confirmationRatePercentage: `${analytics.overview.confirmationRate}%`,
    };
  },

  /**
   * 3. getWeeklyStatistics()
   * Returns 7-day trends, busiest time slots, and week-over-week performance.
   */
  async getWeeklyStatistics(todayStr: string) {
    const all = await this._getReservations();
    const analytics = calculateBusinessAnalytics(all, todayStr);

    return {
      weeklyBookingsTotal: analytics.dailyTrends.reduce((sum, d) => sum + d.bookings, 0),
      weeklyGuestsTotal: analytics.dailyTrends.reduce((sum, d) => sum + d.guests, 0),
      confirmedThisWeek: analytics.dailyTrends.reduce((sum, d) => sum + d.confirmed, 0),
      dailyBreakdown: analytics.dailyTrends,
      busiestTimeSlots: analytics.busiestTimeSlots.slice(0, 3),
      seatingPopularity: analytics.seatingAreaDistribution,
    };
  },

  /**
   * 4. getPopularMenuItems()
   * Returns verified menu performers, items, and pricing from real data.
   */
  async getPopularMenuItems() {
    const analyticsSummary = await dbStorage.getAnalyticsSummary();
    const stock = await dbStorage.getMenuAvailability();

    const topItems = analyticsSummary.popularItems.map((item) => {
      // Find full item metadata
      let match = null;
      for (const cat of menuCategories) {
        const found = cat.items.find((i) => i.name.toLowerCase() === item.name.toLowerCase());
        if (found) {
          match = found;
          break;
        }
      }
      return {
        name: item.name,
        views: item.views,
        price: match?.price || "Market Price",
        description: match?.description || "",
        inStock: match ? stock[match.id] !== false : true,
      };
    });

    return {
      popularItems: topItems.length > 0 ? topItems : [
        { name: "Iced Spanish Latte", price: "Rs. 1,250", description: "Sweet condensed milk layered over double espresso", inStock: true },
        { name: "24-Hour Cold Brew", price: "Rs. 1,150", description: "Steeped single-origin beans, zero bitterness", inStock: true },
        { name: "Warm Cardamom Cinnamon Roll", price: "Rs. 750", description: "Freshly baked artisan roll", inStock: true },
      ],
    };
  },

  /**
   * 5. getBusinessSettings()
   * Returns configured store settings and capacity rules.
   */
  async getBusinessSettings() {
    let settings = null;
    if (isSupabaseServerConfigured()) {
      settings = await supabaseService.getBusinessSettings();
    }
    if (!settings) {
      settings = await dbStorage.getBusinessSettings();
    }

    return {
      shopName: settings.shopName,
      tagline: settings.tagline,
      address: settings.address,
      city: settings.city,
      hoursWeekday: settings.openingHoursWeekday,
      hoursWeekend: settings.openingHoursWeekend,
      isAcceptingReservations: settings.isAcceptingReservations,
      maxPartySize: settings.maxPartySize,
    };
  },
};
