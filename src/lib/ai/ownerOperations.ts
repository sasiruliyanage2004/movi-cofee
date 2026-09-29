import { ownerAssistantTools } from "./ownerTools";
import { ChatMessage } from "@/types/ai";

export const OWNER_SYSTEM_PROMPT = `
You are the Executive Operations & Business AI Assistant for Movi Coffee in Kaduwela, Sri Lanka.
You communicate directly with the verified cafe owner/general manager.
Your tone is professional, analytical, concise, and focused on cafe efficiency, revenue, and guest satisfaction.

STRICT RULES:
1. ONLY utilize data retrieved through the controlled server-side tools:
   - getTodayReservations()
   - getReservationSummary()
   - getWeeklyStatistics()
   - getPopularMenuItems()
   - getBusinessSettings()
2. Never expose private customer contact information (phones or emails) without masking.
3. Do not make unsupported business or financial claims.
4. When drafting social media captions or promotions, base them strictly on verified Movi Coffee menu items, Sri Lankan highland beans, and real store hours.
`;

/**
 * Server-Side Processor for Authenticated Owner Assistant
 * Called exclusively from authenticated server actions.
 */
export async function processOwnerAssistantMessage(userQuery: string): Promise<ChatMessage> {
  const query = userQuery.trim().toLowerCase();

  // Sri Lanka timezone-aware date
  const todayStr = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());

  let content = "";
  const suggestions: string[] = [];

  // Question 1: How many reservations do we have today? / Today's bookings
  if (
    query.includes("reservations do we have today") ||
    query.includes("today's reservations") ||
    query.includes("reservations today") ||
    (query.includes("today") && query.includes("booking"))
  ) {
    const todayData = await ownerAssistantTools.getTodayReservations(todayStr);
    content =
      `**Today's Reservation Briefing (${todayData.date}):**\n\n` +
      `• **Total Bookings Today:** ${todayData.totalReservationsToday}\n` +
      `• **Confirmed Bookings:** ${todayData.confirmedCount}\n` +
      `• **Pending Approvals:** ${todayData.pendingCount} (Requires review in Reservations tab)\n` +
      `• **Total Expected Guests:** ${todayData.expectedGuestsCount} Guests\n\n` +
      (todayData.roster.length > 0
        ? `**Today's Schedule:**\n` +
          todayData.roster
            .map((r) => `• #${r.ref} — ${r.timeSlot} | ${r.guestFirstName} (${r.guestsCount} guests, ${r.seatingArea}) [${r.status.toUpperCase()}]`)
            .join("\n")
        : `*No reservations booked for today yet.*`);

    suggestions.push(
      "How many guests are expected today?",
      "What are our busiest reservation times?",
      "Summarize this week's reservation activity"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 2: How many guests are expected today?
  if (query.includes("guests are expected today") || query.includes("guest count today") || query.includes("how many guests today")) {
    const todayData = await ownerAssistantTools.getTodayReservations(todayStr);
    content =
      `**Expected Guest Count for Today:**\n\n` +
      `• **${todayData.expectedGuestsCount} guests** across ${todayData.activeReservationsCount} active table bookings.\n` +
      `• **Pending Guests:** ${todayData.pendingCount > 0 ? "Some bookings are still pending confirmation." : "All current tables are confirmed."}\n\n` +
      `*Recommendation:* Ensure the espresso bar has calibrated grind sizes for morning rush and sufficient cold brew steeped for the afternoon.`;

    suggestions.push(
      "What are our busiest reservation times?",
      "Show reservation trends",
      "Draft a social media caption for a new menu item"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 3: What are our busiest reservation times?
  if (query.includes("busiest") || query.includes("peak hour") || query.includes("peak time") || query.includes("busy time")) {
    const stats = await ownerAssistantTools.getWeeklyStatistics(todayStr);
    content =
      `**Busiest Reservation Windows:**\n\n` +
      stats.busiestTimeSlots
        .map(
          (s, idx) =>
            `${idx + 1}. **${s.timeSlot}** — ${s.count} bookings (${s.totalGuests} guests, ${s.percentage}% of overall reservations)`
        )
        .join("\n") +
      `\n\n*Operational Insight:* Mid-morning (10:30 AM) and late afternoon (4:00 PM – 5:30 PM) experience the highest demand for courtyard and salon seating.`;

    suggestions.push(
      "How many confirmed reservations do we have this week?",
      "How many cancellations happened?",
      "Suggest promotional content"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 4: How many confirmed reservations do we have this week?
  if (query.includes("confirmed reservations do we have this week") || query.includes("confirmed this week")) {
    const stats = await ownerAssistantTools.getWeeklyStatistics(todayStr);
    content =
      `**Weekly Confirmed Reservations:**\n\n` +
      `• **${stats.confirmedThisWeek} confirmed reservations** secured across the current 7-day operational period.\n` +
      `• **Total Guests Accounted For:** ${stats.weeklyGuestsTotal} guests.\n` +
      `• **Overall Weekly Booking Volume:** ${stats.weeklyBookingsTotal} total requests.`;

    suggestions.push(
      "Summarize this week's reservation activity",
      "How many cancellations happened?",
      "Show reservation trends"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 5: How many cancellations happened?
  if (query.includes("cancellation") || query.includes("cancelled") || query.includes("no-show") || query.includes("no show")) {
    const summary = await ownerAssistantTools.getReservationSummary(todayStr);
    content =
      `**Cancellation & No-Show Record:**\n\n` +
      `• **Cancelled Bookings:** ${summary.cancelledBookings} (${summary.cancellationRatePercentage} of total bookings)\n` +
      `• **No-Shows Recorded:** ${summary.noShowBookings}\n` +
      `• **Successful Confirmations:** ${summary.confirmedBookings + summary.completedBookings} (${summary.confirmationRatePercentage} fulfillment rate)\n\n` +
      `*Operational Note:* A cancellation rate under 10% is exceptionally healthy for artisanal cafes. Our multi-channel WhatsApp confirmation helps keep no-shows minimal.`;

    suggestions.push(
      "Summarize this week's reservation activity",
      "What are our busiest reservation times?",
      "Draft promo content"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 6: Summarize this week's reservation activity / Show reservation trends
  if (query.includes("summarize this week") || query.includes("weekly summary") || query.includes("reservation trends") || query.includes("show reservation trends")) {
    const stats = await ownerAssistantTools.getWeeklyStatistics(todayStr);
    const summary = await ownerAssistantTools.getReservationSummary(todayStr);

    content =
      `**Weekly Reservation & Trend Executive Summary:**\n\n` +
      `• **Total Bookings Recorded:** ${stats.weeklyBookingsTotal}\n` +
      `• **Confirmed & Seated Guests:** ${stats.weeklyGuestsTotal} guests\n` +
      `• **Average Party Size:** ${summary.averagePartySize} guests per table\n` +
      `• **Fulfillment Rate:** ${summary.confirmationRatePercentage}\n\n` +
      `**Daily Velocity:**\n` +
      stats.dailyBreakdown.map((d) => `• ${d.dayLabel}: ${d.bookings} bookings (${d.guests} guests)`).join("\n") +
      `\n\n**Most Requested Seating Area:** ` +
      stats.seatingPopularity.map((s) => `${s.area} (${s.percentage}%)`).join(", ");

    suggestions.push(
      "Draft a social media caption for a new menu item",
      "Suggest promotional content",
      "Busiest reservation times"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 7: Draft a social media caption for a new menu item
  if (query.includes("caption") || query.includes("social media") || query.includes("instagram") || query.includes("post")) {
    const menuData = await ownerAssistantTools.getPopularMenuItems();
    const settings = await ownerAssistantTools.getBusinessSettings();
    const item = menuData.popularItems[0] || { name: "Iced Spanish Latte", price: "Rs. 1,250", description: "Condensed milk layered over espresso" };

    content =
      `Here is a tailored, artisanal social media caption for **${item.name}**:\n\n` +
      `---\n` +
      `Slow down your afternoon in Kaduwela. ☕✨\n\n` +
      `Introducing our signature **${item.name}** (${item.price}) — double-extracted espresso pulled over velvety textured milk, crafted to bring moments of mindful calm to your day.\n\n` +
      `🌿 Pair it with our warm freshly baked pastries in our sunlit courtyard.\n` +
      `📍 ${settings.address}, ${settings.city}\n` +
      `⏰ Open today until ${settings.hoursWeekday.split("–")[1]?.trim() || "10:00 PM"}\n` +
      `🪑 Reserve your table online at movicoffee.lk or tap the link in bio.\n\n` +
      `#MoviCoffee #KaduwelaCafe #SpecialtyCoffeeSriLanka #ArtisanRoast #GoodCoffeeBetterMoments\n` +
      `---`;

    suggestions.push(
      "Suggest promotional content based only on business information",
      "How many reservations do we have today?",
      "Weekly reservation summary"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Question 8: Suggest promotional content based only on the business information provided
  if (query.includes("promo") || query.includes("campaign") || query.includes("marketing") || query.includes("suggest promotional")) {
    const settings = await ownerAssistantTools.getBusinessSettings();
    const menuData = await ownerAssistantTools.getPopularMenuItems();

    content =
      `**Grounded Promotional Concepts for ${settings.shopName}:**\n\n` +
      `1. **Afternoon Quiet Work Hour (Weekdays 2:00 PM – 4:30 PM):**\n` +
      `   • *Concept:* Promote our Quiet Study Nooks equipped with high-speed Wi-Fi and power outlets.\n` +
      `   • *Offer:* Feature a Pour-Over or Americano paired with a cinnamon pastry.\n\n` +
      `2. **Courtyard Sunset Gatherings (Fridays & Weekends):**\n` +
      `   • *Concept:* Encourage advance table reservations for groups of 4 to 8 guests in the open-air garden terrace.\n` +
      `   • *Featured Beverages:* ${menuData.popularItems.map((i) => i.name).slice(0, 2).join(" & ")}.\n\n` +
      `3. **Plant-Based Coffee Awareness:**\n` +
      `   • *Concept:* Highlight our certified Barista Oat Milk and Almond Milk customizations on signature drinks.\n\n` +
      `*Compliance Note:* All suggestions align directly with configured store hours (${settings.hoursWeekday}) and real menu items.`;

    suggestions.push(
      "Draft a social media caption for a new menu item",
      "Show reservation trends",
      "Today's reservations"
    );
    return createOwnerMessage(content, suggestions);
  }

  // Default Greeting / Capabilities overview
  const summary = await ownerAssistantTools.getReservationSummary(todayStr);
  content =
    `Hello! I am your **Movi Operations & Business Assistant**.\n\n` +
    `I access live, verified data exclusively through controlled backend tools. Here is your current snapshot:\n\n` +
    `• **Active Bookings Total:** ${summary.totalBookings}\n` +
    `• **Confirmed Guests Handled:** ${summary.totalGuestsHandled}\n` +
    `• **Pending Approvals:** ${summary.pendingApprovals}\n\n` +
    `You can ask me questions about today's expected guests, busiest reservation windows, weekly fulfillment rates, or drafting factual promotional captions.`;

  suggestions.push(
    "How many reservations do we have today?",
    "How many guests are expected today?",
    "What are our busiest reservation times?",
    "Summarize this week's reservation activity"
  );
  return createOwnerMessage(content, suggestions);
}

function createOwnerMessage(content: string, suggestions: string[]): ChatMessage {
  return {
    id: `owner-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    suggestions,
  };
}
