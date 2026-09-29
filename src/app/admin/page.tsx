import React from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { dbStorage } from "@/lib/db/storage";
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

  const [
    reservations,
    inquiries,
    settings,
    seasonal,
    menuAvailability,
    analyticsSummary,
  ] = await Promise.all([
    dbStorage.getReservations(),
    dbStorage.getInquiries(),
    dbStorage.getBusinessSettings(),
    dbStorage.getSeasonalExperiences(),
    dbStorage.getMenuAvailability(),
    dbStorage.getAnalyticsSummary(),
  ]);

  return (
    <AdminDashboardClient
      initialReservations={reservations}
      initialInquiries={inquiries}
      initialSettings={settings}
      initialSeasonal={seasonal}
      initialMenuAvailability={menuAvailability}
      analyticsSummary={analyticsSummary}
    />
  );
}
