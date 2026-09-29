export type AiRole = "customer-sommelier" | "owner-operations";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface CoffeeRecommendation {
  coffeeName: string;
  category: string;
  pairingNotes: string;
  reason: string;
}
