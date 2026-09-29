"use server";

import { loginOwner, logoutOwner } from "@/lib/auth/session";
import { LoginResult } from "@/types/auth";
import { redirect } from "next/navigation";

export async function loginAction(password: string, email?: string): Promise<LoginResult> {
  const result = await loginOwner(password, email);
  return result;
}

export async function logoutAction(): Promise<void> {
  await logoutOwner();
  redirect("/admin/login");
}
