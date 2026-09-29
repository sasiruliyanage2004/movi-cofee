"use server";

import { dbStorage } from "@/lib/db/storage";
import { AnalyticsEventType } from "@/types/analytics";

export async function trackEventAction(
  type: AnalyticsEventType,
  path: string,
  metadata?: Record<string, string | number | boolean>
) {
  try {
    await dbStorage.recordAnalytics({
      type,
      path,
      metadata,
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
