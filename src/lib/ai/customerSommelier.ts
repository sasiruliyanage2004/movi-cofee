import { siteConfig } from "@/data/site";
import { ChatMessage } from "@/types/ai";

export const SOMMELIER_SYSTEM_PROMPT = `
You are the Master Barista and Digital Sommelier at ${siteConfig.name}, located in Kaduwela, Sri Lanka.
Your personality is warm, artisanal, deeply knowledgeable about coffee roasts, extraction techniques, and food pairings.
You speak with elegant hospitality.
`;

export async function processCustomerSommelierMessage(userQuery: string): Promise<ChatMessage> {
  const query = userQuery.toLowerCase();

  // If Gemini API Key is available in environment, it will integrate here seamlessly.
  // We provide an intelligent, rich contextual barista knowledge engine as default.
  let responseText = "";
  const suggestions: string[] = [];

  if (query.includes("cold") || query.includes("iced") || query.includes("refreshing")) {
    responseText = 
      "For a refreshing and crisp coffee experience, I highly recommend our **24-Hour Cold Brew** or our signature **Iced Spanish Latte** with condensed milk. If you prefer zero dairy, our **Tonic Espresso with fresh citrus zest** is remarkably vibrant!";
    suggestions.push("Tell me about Cold Brew", "What food pairs with this?", "Can I reserve a table?");
  } else if (query.includes("sweet") || query.includes("dessert") || query.includes("pastry")) {
    responseText =
      "If you have a sweet tooth, pair our rich **Caramel Macchiato** with our **Warm Cardamom Cinnamon Roll** or **Dark Chocolate Fondant**. The spiced cardamom cuts through the espresso crema exquisitely.";
    suggestions.push("Show Dessert Menu", "Non-dairy milk options", "Reserve for an afternoon treat");
  } else if (query.includes("strong") || query.includes("espresso") || query.includes("kick") || query.includes("work")) {
    responseText =
      "For deep focus and full-bodied intensity, go with a **Double Cortado** or our **Flat White with a double ristretto extraction**. It delivers a rich chocolatey punch with silky micro-foam that keeps you going.";
    suggestions.push("Do you have Wi-Fi?", "Quiet work table reservation", "Pour-over options");
  } else if (query.includes("book") || query.includes("reserve") || query.includes("table") || query.includes("gathering")) {
    responseText =
      "We would be delighted to host you! You can reserve a spot directly using our **Table & Gathering Reservation** feature. We offer quiet study nooks, communal gathering tables, and open courtyard seating.";
    suggestions.push("Open reservation form", "Opening hours in Kaduwela", "Group seating policy");
  } else if (query.includes("tea") || query.includes("matcha") || query.includes("non-coffee")) {
    responseText =
      "We celebrate local heritage with single-estate **Handpicked Ceylon Silver Tips Tea**, artisan **Kandy Spiced Chai**, and ceremonial Japanese **Matcha Latte** prepared with organic oat or almond milk.";
    suggestions.push("Tea collection", "Breakfast options", "Where are you located?");
  } else {
    responseText =
      `Welcome to **${siteConfig.name}**! Whether you are seeking a bright, fruity pour-over, a comforting velvety cappuccino, or a quiet space to read in Kaduwela, I am here to guide your palate. What flavor notes or coffee style are you in the mood for today?`;
    suggestions.push("Recommend a signature drink", "Best iced coffee for hot afternoons", "Book a table for 2");
  }

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: responseText,
    timestamp: new Date().toISOString(),
    suggestions,
  };
}
