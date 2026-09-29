"use server";

import { dbStorage } from "@/lib/db/storage";
import { BusinessSettings, SeasonalExperience } from "@/types/settings";
import { revalidatePath } from "next/cache";

export async function updateBusinessSettingsAction(newSettings: Partial<BusinessSettings>) {
  try {
    const updated = await dbStorage.updateBusinessSettings(newSettings);
    revalidatePath("/");
    revalidatePath("/visit");
    revalidatePath("/admin");
    return { success: true, settings: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update business settings.";
    return { success: false, error: errorMsg };
  }
}

export async function toggleMenuItemStockAction(itemId: string, isAvailable: boolean) {
  try {
    await dbStorage.setMenuItemAvailability(itemId, isAvailable);
    revalidatePath("/menu");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to toggle menu item stock.";
    return { success: false, error: errorMsg };
  }
}

export async function updateSeasonalExperienceAction(id: string, updates: Partial<SeasonalExperience>) {
  try {
    const updated = await dbStorage.updateSeasonalExperience(id, updates);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, seasonal: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update seasonal experience.";
    return { success: false, error: errorMsg };
  }
}
