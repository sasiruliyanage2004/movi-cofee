import { dbStorage } from "@/lib/db/storage";
import { ChatMessage } from "@/types/ai";

export async function processOwnerAssistantMessage(userQuery: string): Promise<ChatMessage> {
  const query = userQuery.toLowerCase();
  const reservations = await dbStorage.getReservations();
  const pendingCount = reservations.filter((r) => r.status === "pending").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmed").length;

  let content = "";
  const suggestions: string[] = [];

  if (query.includes("reserv") || query.includes("booking") || query.includes("summary")) {
    content = 
      `**Current Operations Briefing:**\n\n` +
      `• **Total Active Bookings:** ${reservations.length}\n` +
      `• **Pending Approvals:** ${pendingCount} require confirmation.\n` +
      `• **Confirmed Bookings:** ${confirmedCount} tables secured.\n\n` +
      `*Recommendation:* Review pending bookings promptly to send WhatsApp confirmation links so guests can plan their visit.`;
    suggestions.push("View pending reservations", "Draft WhatsApp confirmation template", "Expected busy hours");
  } else if (query.includes("stock") || query.includes("beans") || query.includes("pastry") || query.includes("inventory")) {
    content =
      `**Inventory & Preparation Advisory:**\n\n` +
      `1. **Cold Brew Steeping:** Weekend demand typically peaks between 2:00 PM – 5:00 PM. Recommend starting a 20-liter cold brew batch 24 hours prior.\n` +
      `2. **Oat & Almond Milk Stock:** Plant-based orders have increased by 28% across signature lattes. Ensure minimum 15 cartons are stocked.\n` +
      `3. **Artisan Pastries:** Sourdough croissants and cardamom rolls sell out fastest before 11:30 AM.`;
    suggestions.push("How to mark items sold out?", "Update business hours", "Check analytics");
  } else if (query.includes("marketing") || query.includes("promo") || query.includes("seasonal")) {
    content =
      `**Seasonal Campaign Strategy:**\n\n` +
      `• **Active Campaign:** The *Ceylon Cinnamon & Hazelnut Harvest Roast* is currently live.\n` +
      `• **Promotion Tip:** Highlight the harvest roast with a 15-second reel showing pour-over bloom on Instagram. Offer a complimentary mini biscotti during afternoon weekday hours (3 PM – 5 PM) to drive off-peak footfall.`;
    suggestions.push("Check active seasonal promo", "Draft WhatsApp promo broadcast", "Review customer feedback");
  } else {
    content =
      `Hello! I am your **Movi Coffee Operations & Business AI**.\n\n` +
      `I can help you monitor live reservations, prepare inventory for peak times, draft personalized customer responses, and optimize your weekly revenue. What would you like to review right now?`;
    suggestions.push("Reservation overview for today", "Weekend prep checklist", "Customer inquiry inbox status");
  }

  return {
    id: `ops-${Date.now()}`,
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    suggestions,
  };
}
