"use server";

import { dbStorage } from "@/lib/db/storage";
import { supabaseService } from "@/lib/supabase/service";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";
import { CafeTable } from "@/types/table";
import { SeatingArea } from "@/types/reservation";
import { revalidatePath } from "next/cache";

export async function toggleTableStatusAction(id: string, isActive: boolean) {
  try {
    let success = false;
    if (isSupabaseServerConfigured()) {
      success = await supabaseService.toggleTableStatus(id, isActive);
    }
    await dbStorage.toggleTableStatus(id, isActive);
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to toggle table status.";
    return { success: false, error: errorMsg };
  }
}

export async function addTableAction(input: {
  tableNumber: string;
  capacity: number;
  seatingArea: SeatingArea;
  notes?: string;
}) {
  try {
    let table: CafeTable | null = null;
    if (isSupabaseServerConfigured()) {
      table = await supabaseService.addTable({
        tableNumber: input.tableNumber.trim().toUpperCase(),
        capacity: Number(input.capacity) || 2,
        seatingArea: input.seatingArea,
        notes: input.notes?.trim(),
      });
    }

    if (!table) {
      table = await dbStorage.addTable({
        tableNumber: input.tableNumber.trim().toUpperCase(),
        capacity: Number(input.capacity) || 2,
        seatingArea: input.seatingArea,
        notes: input.notes?.trim(),
      });
    }

    revalidatePath("/admin");
    return { success: true, table };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to add table.";
    return { success: false, error: errorMsg };
  }
}

export async function assignTableAction(reservationId: string, tableId: string | null) {
  try {
    if (isSupabaseServerConfigured()) {
      await supabaseService.assignTableToReservation(reservationId, tableId);
    }
    await dbStorage.assignTable(reservationId, tableId);
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to assign table.";
    return { success: false, error: errorMsg };
  }
}
