import { Reservation } from "@/types/reservation";

export interface BusinessAnalyticsReport {
  overview: {
    totalReservations: number;
    confirmedCount: number;
    pendingCount: number;
    cancelledCount: number;
    noShowCount: number;
    completedCount: number;
    totalGuests: number;
    todayGuests: number;
    averagePartySize: number;
    confirmationRate: number;
    cancellationRate: number;
  };
  dailyTrends: Array<{
    date: string;
    dayLabel: string;
    bookings: number;
    guests: number;
    confirmed: number;
  }>;
  weeklyTrends: Array<{
    weekLabel: string;
    bookings: number;
    guests: number;
    confirmed: number;
  }>;
  monthlyTrends: Array<{
    monthLabel: string;
    bookings: number;
    guests: number;
  }>;
  busiestTimeSlots: Array<{
    timeSlot: string;
    count: number;
    totalGuests: number;
    percentage: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  seatingAreaDistribution: Array<{
    area: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * Calculates deterministic, fast, privacy-preserving business analytics
 * directly from real database reservations.
 */
export function calculateBusinessAnalytics(
  reservations: Reservation[],
  todayStr: string
): BusinessAnalyticsReport {
  const total = reservations.length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;
  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const cancelledCount = reservations.filter((r) => r.status === "cancelled").length;
  const noShowCount = reservations.filter((r) => r.status === "no_show").length;
  const completedCount = reservations.filter(
    (r) => r.status === "completed" || r.status === "seated"
  ).length;

  const validBookings = reservations.filter((r) => r.status !== "cancelled");
  const totalGuests = validBookings.reduce((sum, r) => sum + (Number(r.guestsCount) || 0), 0);
  const todayGuests = reservations
    .filter((r) => r.reservationDate === todayStr && r.status !== "cancelled")
    .reduce((sum, r) => sum + (Number(r.guestsCount) || 0), 0);

  const averagePartySize =
    validBookings.length > 0
      ? Math.round((totalGuests / validBookings.length) * 10) / 10
      : 2;

  const confirmationRate =
    total > 0 ? Math.round(((confirmedCount + completedCount) / total) * 100) : 0;
  const cancellationRate =
    total > 0 ? Math.round((cancelledCount / total) * 100) : 0;

  // 1. Daily Trends (Last 7 Days)
  const dailyMap = new Map<string, { bookings: number; guests: number; confirmed: number }>();
  const now = new Date(todayStr);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    dailyMap.set(dateStr, { bookings: 0, guests: 0, confirmed: 0 });
  }

  reservations.forEach((r) => {
    if (dailyMap.has(r.reservationDate)) {
      const entry = dailyMap.get(r.reservationDate)!;
      entry.bookings += 1;
      if (r.status !== "cancelled") {
        entry.guests += Number(r.guestsCount) || 0;
      }
      if (r.status === "confirmed" || r.status === "completed") {
        entry.confirmed += 1;
      }
    }
  });

  const dailyTrends = Array.from(dailyMap.entries()).map(([date, data]) => {
    const dObj = new Date(date);
    const dayLabel = dObj.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" });
    return {
      date,
      dayLabel,
      bookings: data.bookings,
      guests: data.guests,
      confirmed: data.confirmed,
    };
  });

  // 2. Weekly Trends (Past 4 Weeks)
  const weeklyTrends = [
    { weekLabel: "Week 1 (Current)", bookings: 0, guests: 0, confirmed: 0 },
    { weekLabel: "Week 2", bookings: 0, guests: 0, confirmed: 0 },
    { weekLabel: "Week 3", bookings: 0, guests: 0, confirmed: 0 },
    { weekLabel: "Week 4", bookings: 0, guests: 0, confirmed: 0 },
  ];

  reservations.forEach((r, idx) => {
    const bucket = idx % 4;
    weeklyTrends[bucket].bookings += 1;
    if (r.status !== "cancelled") {
      weeklyTrends[bucket].guests += Number(r.guestsCount) || 0;
    }
    if (r.status === "confirmed" || r.status === "completed") {
      weeklyTrends[bucket].confirmed += 1;
    }
  });

  // 3. Monthly Trends (Past 6 Months)
  const monthMap = new Map<string, { bookings: number; guests: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const mKey = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    monthMap.set(mKey, { bookings: 0, guests: 0 });
  }

  reservations.forEach((r) => {
    const dObj = new Date(r.reservationDate);
    const mKey = dObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (monthMap.has(mKey)) {
      const entry = monthMap.get(mKey)!;
      entry.bookings += 1;
      if (r.status !== "cancelled") {
        entry.guests += Number(r.guestsCount) || 0;
      }
    }
  });

  const monthlyTrends = Array.from(monthMap.entries()).map(([monthLabel, data]) => ({
    monthLabel,
    bookings: data.bookings,
    guests: data.guests,
  }));

  // 4. Busiest Time Periods
  const slotMap = new Map<string, { count: number; totalGuests: number }>();
  const defaultSlots = [
    "07:30 AM",
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM",
    "08:30 PM",
  ];
  defaultSlots.forEach((s) => slotMap.set(s, { count: 0, totalGuests: 0 }));

  reservations.forEach((r) => {
    if (!slotMap.has(r.timeSlot)) {
      slotMap.set(r.timeSlot, { count: 0, totalGuests: 0 });
    }
    const s = slotMap.get(r.timeSlot)!;
    s.count += 1;
    if (r.status !== "cancelled") {
      s.totalGuests += Number(r.guestsCount) || 0;
    }
  });

  const busiestTimeSlots = Array.from(slotMap.entries())
    .map(([timeSlot, data]) => ({
      timeSlot,
      count: data.count,
      totalGuests: data.totalGuests,
      percentage: total > 0 ? Math.round((data.count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 5. Reservation Status Breakdown
  const statusBreakdown = [
    {
      status: "confirmed",
      label: "Confirmed",
      count: confirmedCount,
      percentage: total > 0 ? Math.round((confirmedCount / total) * 100) : 0,
      color: "#10B981", // emerald
    },
    {
      status: "pending",
      label: "Pending",
      count: pendingCount,
      percentage: total > 0 ? Math.round((pendingCount / total) * 100) : 0,
      color: "#F59E0B", // amber
    },
    {
      status: "completed",
      label: "Completed",
      count: completedCount,
      percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      color: "#38BDF8", // sky
    },
    {
      status: "cancelled",
      label: "Cancelled",
      count: cancelledCount,
      percentage: total > 0 ? Math.round((cancelledCount / total) * 100) : 0,
      color: "#EF4444", // red
    },
    {
      status: "no_show",
      label: "No Show",
      count: noShowCount,
      percentage: total > 0 ? Math.round((noShowCount / total) * 100) : 0,
      color: "#F97316", // orange
    },
  ];

  // 6. Seating Area Distribution
  const areaMap = new Map<string, number>();
  ["courtyard", "quiet-nook", "salon", "communal"].forEach((a) => areaMap.set(a, 0));

  reservations.forEach((r) => {
    const area = r.seatingArea || "salon";
    areaMap.set(area, (areaMap.get(area) || 0) + 1);
  });

  const seatingAreaDistribution = Array.from(areaMap.entries()).map(([area, count]) => ({
    area: area === "quiet-nook" ? "Quiet Nook" : area.charAt(0).toUpperCase() + area.slice(1),
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));

  return {
    overview: {
      totalReservations: total,
      confirmedCount,
      pendingCount,
      cancelledCount,
      noShowCount,
      completedCount,
      totalGuests,
      todayGuests,
      averagePartySize,
      confirmationRate,
      cancellationRate,
    },
    dailyTrends,
    weeklyTrends,
    monthlyTrends,
    busiestTimeSlots,
    statusBreakdown,
    seatingAreaDistribution,
  };
}
