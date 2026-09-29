"use server";

import { dbStorage } from "@/lib/db/storage";
import { revalidatePath } from "next/cache";

export interface ContactActionResult {
  success: boolean;
  error?: string;
}

export async function submitContactInquiryAction(formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<ContactActionResult> {
  try {
    if (!formData.name?.trim()) return { success: false, error: "Name is required." };
    if (!formData.email?.trim()) return { success: false, error: "Email is required." };
    if (!formData.phone?.trim()) return { success: false, error: "Phone number is required." };
    if (!formData.message?.trim() || formData.message.trim().length < 10) {
      return { success: false, error: "Message must be at least 10 characters." };
    }

    await dbStorage.createInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    });

    await dbStorage.recordAnalytics({
      type: "page_view",
      path: "/contact",
      metadata: { action: "inquiry_submitted" },
    });

    revalidatePath("/admin");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to submit inquiry.";
    return { success: false, error: errorMsg };
  }
}
