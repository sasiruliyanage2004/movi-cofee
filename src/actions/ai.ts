"use server";

import { processCustomerAssistantMessage } from "@/lib/ai/customerAssistantEngine";
import { processOwnerAssistantMessage } from "@/lib/ai/ownerOperations";
import { ChatMessage } from "@/types/ai";
import { getCurrentUser } from "@/lib/auth/session";

export async function askCustomerAssistantAction(
  query: string,
  history: ChatMessage[] = []
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  try {
    if (!query?.trim()) return { success: false, error: "Query is required." };
    const reply = await processCustomerAssistantMessage(query.trim(), history);
    return { success: true, message: reply };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to get assistant response.";
    return { success: false, error: errorMsg };
  }
}

export async function askSommelierAction(
  query: string,
  history: ChatMessage[] = []
): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  return askCustomerAssistantAction(query, history);
}

export async function askOwnerAiAction(query: string): Promise<{ success: boolean; message?: ChatMessage; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: "Unauthorized access." };
    }
    if (!query?.trim()) return { success: false, error: "Query is required." };
    const reply = await processOwnerAssistantMessage(query.trim());
    return { success: true, message: reply };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to get operations advice.";
    return { success: false, error: errorMsg };
  }
}
