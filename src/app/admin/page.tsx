import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { dbStorage } from "@/lib/db/storage";
import { supabaseService } from "@/lib/supabase/service";
import { isSupabaseServerConfigured } from "@/lib/supabase/server";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Movi Coffee Management",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Load from Supabase if configured, otherwise fallback to local platform store
  let [reservations, tables, customers, supabaseSettings] = isSupabaseServerConfigured()
    ? await Promise.all([
        supabaseService.getReservations(),
        supabaseService.getAllTables(),
        supabaseService.getCustomers(),
        supabaseService.getBusinessSettings(),
      ])
    : [null, null, null, null];

  if (!reservations || reservations.length === 0) {
    reservations = await dbStorage.getReservations();
  }

  if (!tables || tables.length === 0) {
    tables = await dbStorage.getAllTables();
  }

  if (!customers || customers.length === 0) {
    customers = await dbStorage.getCustomers();
  }

  const [
    inquiries,
    fallbackSettings,
    seasonal,
    menuAvailability,
    analyticsSummary,
  ] = await Promise.all([
    dbStorage.getInquiries(),
    dbStorage.getBusinessSettings(),
    dbStorage.getSeasonalExperiences(),
    dbStorage.getMenuAvailability(),
    dbStorage.getAnalyticsSummary(),
  ]);

  const settings = supabaseSettings || fallbackSettings;

  return (
    <AdminDashboardClient
      initialReservations={reservations}
      initialTables={tables}
      initialCustomers={customers}
      initialInquiries={inquiries}
      initialSettings={settings}
      initialSeasonal={seasonal}
      initialMenuAvailability={menuAvailability}
      analyticsSummary={analyticsSummary}
    />
  );
}
