export type AiRole = "customer-sommelier" | "owner-operations";

export interface ChatActionCard {
  type: "menu_items" | "availability" | "booking_created" | "reservation_status" | "contact_info";
  title?: string;
  data?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestions?: string[];
  card?: ChatActionCard;
}

export interface CoffeeRecommendation {
  coffeeName: string;
  category: string;
  pairingNotes: string;
  reason: string;
}

