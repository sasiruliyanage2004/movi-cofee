"use client";

import React, { useState, useMemo } from "react";
import { Reservation, ReservationStatus, SeatingArea } from "@/types/reservation";
import { BusinessSettings, SeasonalExperience, SeasonalVisualEffect } from "@/types/settings";
import { CafeTable } from "@/types/table";
import { Customer } from "@/types/customer";
import { ContactInquiry } from "@/lib/db/storage";
import { updateReservationStatusAction } from "@/actions/reservations";
import { toggleTableStatusAction, addTableAction, assignTableAction } from "@/actions/tables";
import {
  updateBusinessSettingsAction,
  toggleMenuItemStockAction,
  updateSeasonalExperienceAction,
} from "@/actions/settings";
import { askOwnerAiAction } from "@/actions/ai";
import { logoutAction } from "@/actions/auth";
import { menuCategories } from "@/data/menu";
import { notificationService } from "@/lib/notifications/whatsapp";
import { calculateBusinessAnalytics } from "@/lib/analytics/businessAnalytics";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  MessageCircle,
  LogOut,
  Sparkles,
  Layers,
  Settings as SettingsIcon,
  BarChart3,
  Mail,
  Send,
  Coffee,
  Check,
  PhoneCall,
  Search,
  Bot,
  Armchair,
  Plus,
  Eye,
  AlertTriangle,
  ChevronRight,
  CalendarDays,
  Store,
  X,
} from "lucide-react";

interface AdminDashboardProps {
  initialReservations: Reservation[];
  initialTables: CafeTable[];
  initialCustomers: Customer[];
  initialInquiries: ContactInquiry[];
  initialSettings: BusinessSettings;
  initialSeasonal: SeasonalExperience[];
  initialMenuAvailability: Record<string, boolean>;
  analyticsSummary: {
    totalPageViews: number;
    totalBookings: number;
    popularItems: { name: string; views: number }[];
    recentEvents: Array<{ id: string; type: string; path: string; timestamp: string }>;
  };
}

export const AdminDashboardClient: React.FC<AdminDashboardProps> = ({
  initialReservations,
  initialTables,
  initialCustomers,
  initialInquiries,
  initialSettings,
  initialSeasonal,
  initialMenuAvailability,
  analyticsSummary,
}) => {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "reservations"
    | "customers"
    | "tables"
    | "settings"
    | "inquiries"
    | "menu"
    | "seasonal"
    | "ai"
    | "analytics"
  >("overview");

  // Core Data States
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [tables, setTables] = useState<CafeTable[]>(initialTables);
  const [customers] = useState<Customer[]>(initialCustomers);
  const [inquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [seasonal, setSeasonal] = useState<SeasonalExperience[]>(initialSeasonal);
  const [menuAvailability, setMenuAvailability] = useState<Record<string, boolean>>(initialMenuAvailability);

  // Reservation Filtering States
  const [reservationFilter, setReservationFilter] = useState<ReservationStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "next7" | "custom">("all");
  const [customDate, setCustomDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Reservation Details Modal
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Customer Tab State
  const [customerSearch, setCustomerSearch] = useState("");
  const [expandedCustomerHistory, setExpandedCustomerHistory] = useState<string | null>(null);

  // Table Management State
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [newTableForm, setNewTableForm] = useState({
    tableNumber: "",
    capacity: 2,
    seatingArea: "salon" as SeatingArea,
    notes: "",
  });
  const [tableSearch, setTableSearch] = useState("");

  // Business Settings State
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Toast / Status Feedback
  const [statusToast, setStatusToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // AI Chat State
  const [aiQuery, setAiQuery] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ role: "user" | "assistant"; content: string; suggestions?: string[] }>>([
    {
      role: "assistant",
      content:
        "Hello! I am your **Movi Operations Assistant**. Ask me about reservation trends, table turn-over, inventory prep, or customer inquiries.",
      suggestions: ["Today's reservation briefing", "Weekend coffee stock checklist", "Table turn-around tips"],
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Toast helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setStatusToast({ message, type });
    setTimeout(() => setStatusToast(null), 3500);
  };

  // Timezone-aware date calculations (Sri Lanka Asia/Colombo UTC+5:30)
  const todayStr = useMemo(() => {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  }, []);

  const tomorrowStr = useMemo(() => {
    try {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(d);
    } catch {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    }
  }, []);

  const next7DaysStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(d);
    } catch {
      return d.toISOString().split("T")[0];
    }
  }, []);

  // Dashboard Overview Metrics
  const todayReservations = useMemo(
    () => reservations.filter((r) => r.reservationDate === todayStr),
    [reservations, todayStr]
  );

  const pendingReservations = useMemo(
    () => reservations.filter((r) => r.status === "pending"),
    [reservations]
  );

  const confirmedReservations = useMemo(
    () => reservations.filter((r) => r.status === "confirmed"),
    [reservations]
  );

  const todayGuestCount = useMemo(
    () =>
      todayReservations
        .filter((r) => r.status !== "cancelled")
        .reduce((sum, r) => sum + (Number(r.guestsCount) || 0), 0),
    [todayReservations]
  );

  const upcomingReservations = useMemo(
    () =>
      reservations
        .filter((r) => r.reservationDate > todayStr && r.status !== "cancelled")
        .sort((a, b) => a.reservationDate.localeCompare(b.reservationDate)),
    [reservations, todayStr]
  );

  const businessAnalytics = useMemo(() => {
    return calculateBusinessAnalytics(reservations, todayStr);
  }, [reservations, todayStr]);

  // Reservation Status Workflow Handler
  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    setIsUpdatingStatus(id);
    try {
      const result = await updateReservationStatusAction(id, newStatus);
      if (result.success && result.reservation) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? result.reservation! : r))
        );
        if (selectedReservation?.id === id) {
          setSelectedReservation(result.reservation);
        }
        showToast(`Reservation #${result.reservation.referenceNumber} marked as ${newStatus.replace("_", " ")}`);
      } else {
        showToast(result.error || "Failed to update reservation status", "error");
      }
    } catch {
      showToast("Network error updating reservation status", "error");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Table Assignment Handler
  const handleAssignTable = async (reservationId: string, tableId: string | null) => {
    try {
      const result = await assignTableAction(reservationId, tableId);
      if (result.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === reservationId ? { ...r, tableId: tableId || undefined } : r))
        );
        if (selectedReservation?.id === reservationId) {
          setSelectedReservation((prev) => (prev ? { ...prev, tableId: tableId || undefined } : null));
        }
        const assignedTable = tables.find((t) => t.id === tableId);
        showToast(
          tableId && assignedTable
            ? `Assigned Table ${assignedTable.tableNumber} to reservation`
            : "Table assignment cleared"
        );
      } else {
        showToast(result.error || "Failed to assign table", "error");
      }
    } catch {
      showToast("Network error assigning table", "error");
    }
  };

  // Table Active/Inactive Toggle Handler
  const handleToggleTableStatus = async (tableId: string, currentActive: boolean) => {
    const nextState = !currentActive;
    // Optimistic update
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, isActive: nextState } : t)));
    try {
      const result = await toggleTableStatusAction(tableId, nextState);
      if (!result.success) {
        // Revert
        setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, isActive: currentActive } : t)));
        showToast(result.error || "Failed to toggle table status", "error");
      } else {
        showToast(`Table status updated to ${nextState ? "Active" : "Inactive"}`);
      }
    } catch {
      setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, isActive: currentActive } : t)));
      showToast("Network error updating table status", "error");
    }
  };

  // Add New Table Handler
  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableForm.tableNumber.trim()) {
      showToast("Table number/identifier is required", "error");
      return;
    }

    try {
      const result = await addTableAction(newTableForm);
      if (result.success && result.table) {
        setTables((prev) => [...prev, result.table!]);
        setIsAddTableOpen(false);
        setNewTableForm({ tableNumber: "", capacity: 2, seatingArea: "salon", notes: "" });
        showToast(`Table ${result.table.tableNumber} created successfully!`);
      } else {
        showToast(result.error || "Failed to create table", "error");
      }
    } catch {
      showToast("Network error creating table", "error");
    }
  };

  // Toggle Reservation Availability
  const handleToggleOnlineReservations = async (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, isAcceptingReservations: enabled }));
    try {
      const res = await updateBusinessSettingsAction({ isAcceptingReservations: enabled });
      if (res.success) {
        showToast(`Online reservations are now ${enabled ? "ACCEPTING BOOKINGS" : "PAUSED"}`);
      } else {
        setSettings((prev) => ({ ...prev, isAcceptingReservations: !enabled }));
        showToast("Failed to update reservation availability", "error");
      }
    } catch {
      setSettings((prev) => ({ ...prev, isAcceptingReservations: !enabled }));
      showToast("Network error updating reservation availability", "error");
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await updateBusinessSettingsAction(settings);
      if (res.success) {
        setSettingsSuccess(true);
        showToast("Business settings successfully saved!");
        setTimeout(() => setSettingsSuccess(false), 4000);
      } else {
        showToast(res.error || "Failed to save settings", "error");
      }
    } catch {
      showToast("Network error saving settings", "error");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Toggle Menu Item Stock
  const handleToggleStock = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setMenuAvailability((prev) => ({ ...prev, [itemId]: newStatus }));
    await toggleMenuItemStockAction(itemId, newStatus);
    showToast(`Item ${newStatus ? "in stock" : "marked sold out"}`);
  };

  // AI Message Handler
  const handleSendAi = async (queryToSend?: string) => {
    const text = queryToSend || aiQuery;
    if (!text.trim() || isAiLoading) return;

    setAiChat((prev) => [...prev, { role: "user", content: text.trim() }]);
    setAiQuery("");
    setIsAiLoading(true);

    try {
      const res = await askOwnerAiAction(text.trim());
      if (res.success && res.message) {
        setAiChat((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.message!.content,
            suggestions: res.message!.suggestions,
          },
        ]);
      }
    } catch {
      setAiChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an issue accessing operational logs. Please try again.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered Reservations calculation
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      // Status filter
      if (reservationFilter !== "all" && r.status !== reservationFilter) {
        return false;
      }

      // Date filter
      if (dateFilter === "today" && r.reservationDate !== todayStr) {
        return false;
      }
      if (dateFilter === "tomorrow" && r.reservationDate !== tomorrowStr) {
        return false;
      }
      if (dateFilter === "next7") {
        if (r.reservationDate < todayStr || r.reservationDate > next7DaysStr) {
          return false;
        }
      }
      if (dateFilter === "custom" && customDate) {
        if (r.reservationDate !== customDate) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = r.guestName.toLowerCase().includes(q);
        const refMatch = r.referenceNumber.toLowerCase().includes(q);
        const phoneMatch = r.phone.includes(q);
        const emailMatch = (r.email || "").toLowerCase().includes(q);
        if (!nameMatch && !refMatch && !phoneMatch && !emailMatch) {
          return false;
        }
      }

      return true;
    });
  }, [reservations, reservationFilter, dateFilter, customDate, searchQuery, todayStr, tomorrowStr, next7DaysStr]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, customerSearch]);

  // Filtered Tables
  const filteredTables = useMemo(() => {
    if (!tableSearch.trim()) return tables;
    const q = tableSearch.toLowerCase();
    return tables.filter(
      (t) =>
        t.tableNumber.toLowerCase().includes(q) ||
        t.seatingArea.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
    );
  }, [tables, tableSearch]);

  // Helper for status badge styling
  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60";
      case "pending":
        return "bg-amber-950/80 text-amber-300 border border-amber-700/60 animate-pulse";
      case "completed":
        return "bg-stone-800 text-stone-300 border border-stone-600/40";
      case "cancelled":
        return "bg-red-950/80 text-red-300 border border-red-800/60";
      case "no_show":
        return "bg-orange-950/80 text-orange-300 border border-orange-700/60";
      case "seated":
        return "bg-sky-950/80 text-sky-300 border border-sky-700/60";
      default:
        return "bg-warm-cream/10 text-warm-cream border border-warm-cream/20";
    }
  };

  return (
    <div className="min-h-screen bg-espresso text-warm-cream font-sans selection:bg-muted-gold/30">
      {/* Toast Feedback Notification */}
      {statusToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded border shadow-2xl transition-all duration-300 ${
            statusToast.type === "success"
              ? "bg-[#162A1E] text-emerald-200 border-emerald-700/80"
              : "bg-[#2D1515] text-red-200 border-red-700/80"
          }`}
        >
          {statusToast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span className="text-xs font-medium tracking-wide">{statusToast.message}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="border-b border-warm-cream/10 bg-[#150E0B] px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-muted-gold/15 flex items-center justify-center border border-muted-gold/40 text-muted-gold shadow-inner">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl text-warm-cream tracking-tight leading-none">
                {settings.shopName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-muted-gold/20 text-muted-gold border border-muted-gold/30">
                Owner Portal
              </span>
            </div>
            <p className="text-[11px] text-warm-cream/50 mt-1 font-light">
              {settings.city}, Sri Lanka • Real-time Operations & Table Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Online Bookings Status Pill */}
          <button
            type="button"
            onClick={() => handleToggleOnlineReservations(!settings.isAcceptingReservations)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-colors cursor-pointer border ${
              settings.isAcceptingReservations
                ? "bg-emerald-950/70 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60"
                : "bg-red-950/70 text-red-300 border-red-700 hover:bg-red-900/60"
            }`}
            title="Click to toggle online reservations on/off"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                settings.isAcceptingReservations ? "bg-emerald-400 animate-ping" : "bg-red-400"
              }`}
            />
            <span>{settings.isAcceptingReservations ? "Bookings Active" : "Bookings Paused"}</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-warm-cream/70 hover:text-muted-gold transition-colors underline decoration-warm-cream/20 underline-offset-4 hidden md:inline-block"
          >
            Public Site ↗
          </a>

          <button
            type="button"
            onClick={() => logoutAction()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-cream/10 hover:bg-warm-cream/15 border border-warm-cream/20 text-xs text-warm-cream transition-colors rounded cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-warm-cream/10 bg-[#1D1410] px-4 sm:px-8 overflow-x-auto scrollbar-none sticky top-[69px] z-30">
        <div className="flex items-center space-x-1 sm:space-x-1.5 py-2">
          {[
            { id: "overview", label: "Overview", icon: Store },
            {
              id: "reservations",
              label: "Reservations",
              icon: Calendar,
              badge: pendingReservations.length,
            },
            { id: "customers", label: "Customers", icon: Users },
            { id: "tables", label: "Tables", icon: Armchair },
            { id: "settings", label: "Business Settings", icon: SettingsIcon },
            {
              id: "inquiries",
              label: "Inquiries",
              icon: Mail,
              badge: inquiries.filter((i) => i.status === "unread").length,
            },
            { id: "menu", label: "Menu & Stock", icon: Layers },
            { id: "seasonal", label: "Seasonal", icon: Sparkles },
            { id: "ai", label: "AI Assistant", icon: Bot },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap rounded font-medium ${
                  isActive
                    ? "bg-muted-gold text-espresso font-semibold shadow"
                    : "text-warm-cream/70 hover:text-warm-cream hover:bg-warm-cream/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {!!tab.badge && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-espresso text-warm-cream" : "bg-red-500 text-white"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* ========================================================================================= */}
        {/* 1. DASHBOARD OVERVIEW */}
        {/* ========================================================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Header Title & Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-cream/10 pb-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-warm-cream">
                  Operations Overview
                </h2>
                <p className="text-xs text-warm-cream/60 mt-1">
                  Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter("today");
                    setActiveTab("reservations");
                  }}
                  className="px-3 py-1.5 bg-muted-gold text-espresso font-semibold text-xs uppercase tracking-wider rounded hover:bg-muted-gold/90 cursor-pointer"
                >
                  View Today&apos;s Bookings ({todayReservations.length})
                </button>
              </div>
            </div>

            {/* Core KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              {/* 1. Today's Reservations */}
              <div className="bg-[#241914] p-4 sm:p-5 border border-warm-cream/10 hover:border-muted-gold/40 transition-colors">
                <div className="flex items-center justify-between text-muted-gold mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono">Today&apos;s Bookings</span>
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-warm-cream font-medium">
                  {todayReservations.length}
                </div>
                <div className="text-[11px] text-warm-cream/50 mt-1">
                  Scheduled for today
                </div>
              </div>

              {/* 2. Pending Reservations */}
              <div className="bg-[#241914] p-4 sm:p-5 border border-warm-cream/10 hover:border-yellow-400/40 transition-colors">
                <div className="flex items-center justify-between text-yellow-400 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono">Pending Review</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-warm-cream font-medium">
                  {pendingReservations.length}
                </div>
                <div className="text-[11px] text-yellow-400/70 mt-1">
                  {pendingReservations.length > 0 ? "Requires confirmation" : "Inbox clear"}
                </div>
              </div>

              {/* 3. Confirmed Reservations */}
              <div className="bg-[#241914] p-4 sm:p-5 border border-warm-cream/10 hover:border-emerald-400/40 transition-colors">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono">Confirmed</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-warm-cream font-medium">
                  {confirmedReservations.length}
                </div>
                <div className="text-[11px] text-emerald-400/70 mt-1">
                  Locked guest tables
                </div>
              </div>

              {/* 4. Today's Guest Count */}
              <div className="bg-[#241914] p-4 sm:p-5 border border-warm-cream/10 hover:border-sky-400/40 transition-colors">
                <div className="flex items-center justify-between text-sky-400 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono">Today&apos;s Guests</span>
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-warm-cream font-medium">
                  {todayGuestCount}
                </div>
                <div className="text-[11px] text-warm-cream/50 mt-1">
                  Total guests arriving
                </div>
              </div>

              {/* 5. Upcoming Reservations */}
              <div className="bg-[#241914] p-4 sm:p-5 border border-warm-cream/10 hover:border-muted-coffee/40 transition-colors col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-muted-coffee mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono">Upcoming</span>
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="font-serif text-3xl sm:text-4xl text-warm-cream font-medium">
                  {upcomingReservations.length}
                </div>
                <div className="text-[11px] text-warm-cream/50 mt-1">
                  Tomorrow & beyond
                </div>
              </div>
            </div>

            {/* Split Schedule & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Service Schedule (2 cols) */}
              <div className="lg:col-span-2 bg-[#211713] border border-warm-cream/10 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-warm-cream/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-gold" />
                    <h3 className="font-serif text-lg text-warm-cream">Today&apos;s Service Schedule</h3>
                  </div>
                  <span className="text-xs font-mono text-muted-gold">
                    {todayReservations.length} Bookings
                  </span>
                </div>

                {todayReservations.length === 0 ? (
                  <div className="py-12 text-center text-warm-cream/50 space-y-2">
                    <Coffee className="w-8 h-8 text-warm-cream/20 mx-auto" />
                    <p className="text-sm font-light">No reservations booked for today yet.</p>
                    <p className="text-xs text-warm-cream/40">
                      Walk-ins and spontaneous guests can be accommodated directly.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-warm-cream/5 space-y-3">
                    {todayReservations.map((res) => {
                      const assignedTable = tables.find((t) => t.id === res.tableId);
                      const confirmWhatsAppUrl = notificationService.generateOwnerConfirmationWhatsAppUrl(res);
                      return (
                        <div
                          key={res.id}
                          className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[#19110E] border border-warm-cream/5 rounded"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-muted-gold/20 text-muted-gold font-mono text-xs font-semibold rounded">
                                {res.timeSlot}
                              </span>
                              <span className="font-medium text-warm-cream text-sm">{res.guestName}</span>
                              <span className="text-xs text-warm-cream/60">
                                ({res.guestsCount} guests • {res.seatingArea})
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-warm-cream/50">
                              <span className="font-mono text-muted-gold">#{res.referenceNumber}</span>
                              <span>•</span>
                              <span>{res.phone}</span>
                              {assignedTable && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-mono">
                                    Table {assignedTable.tableNumber}
                                  </span>
                                </>
                              )}
                            </div>
                            {res.specialNotes && (
                              <p className="text-[11px] text-warm-cream/60 italic">
                                &ldquo;{res.specialNotes}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded ${getStatusBadge(res.status)}`}>
                              {res.status.replace("_", " ")}
                            </span>

                            {res.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(res.id, "confirmed")}
                                className="px-2 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[10px] uppercase tracking-wider rounded cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}

                            {res.status === "confirmed" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(res.id, "completed")}
                                className="px-2 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] uppercase tracking-wider rounded cursor-pointer"
                              >
                                Complete
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedReservation(res)}
                              className="px-2 py-1 bg-warm-cream/10 hover:bg-warm-cream/20 text-warm-cream text-[10px] uppercase tracking-wider rounded cursor-pointer"
                            >
                              Details
                            </button>

                            <a
                              href={confirmWhatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded"
                              title="WhatsApp Guest"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Panel: Upcoming Bookings & Fast Navigation */}
              <div className="space-y-6">
                {/* Upcoming Highlights */}
                <div className="bg-[#211713] border border-warm-cream/10 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2">
                    <h3 className="font-serif text-base text-warm-cream">Upcoming Bookings</h3>
                    <span className="text-[11px] text-muted-gold font-mono">{upcomingReservations.length} Future</span>
                  </div>

                  {upcomingReservations.length === 0 ? (
                    <p className="text-xs text-warm-cream/40 italic py-4">No future bookings beyond today.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {upcomingReservations.slice(0, 4).map((up) => (
                        <div
                          key={up.id}
                          onClick={() => setSelectedReservation(up)}
                          className="p-2.5 bg-[#19110E] border border-warm-cream/5 rounded hover:border-warm-cream/20 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-warm-cream">{up.guestName}</span>
                            <span className="font-mono text-muted-gold text-[11px]">{up.reservationDate}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-warm-cream/50 mt-1">
                            <span>{up.timeSlot} • {up.guestsCount} guests</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase ${getStatusBadge(up.status)}`}>
                              {up.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setDateFilter("all");
                      setActiveTab("reservations");
                    }}
                    className="w-full text-center text-xs text-muted-gold hover:underline pt-1 block cursor-pointer"
                  >
                    View Complete Roster →
                  </button>
                </div>

                {/* Floor Capacity Summary */}
                <div className="bg-[#211713] border border-warm-cream/10 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2">
                    <h3 className="font-serif text-base text-warm-cream">Floor Status</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("tables")}
                      className="text-[11px] text-muted-gold hover:underline cursor-pointer"
                    >
                      Manage Tables →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-[#19110E] border border-warm-cream/5">
                      <span className="text-[10px] uppercase text-warm-cream/50 block">Active Tables</span>
                      <span className="font-serif text-xl text-emerald-400 mt-1 block">
                        {tables.filter((t) => t.isActive).length} / {tables.length}
                      </span>
                    </div>
                    <div className="p-3 bg-[#19110E] border border-warm-cream/5">
                      <span className="text-[10px] uppercase text-warm-cream/50 block">Total Capacity</span>
                      <span className="font-serif text-xl text-warm-cream mt-1 block">
                        {tables.filter((t) => t.isActive).reduce((acc, t) => acc + t.capacity, 0)} Seats
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 2. RESERVATION MANAGEMENT */}
        {/* ========================================================================================= */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-warm-cream">
                  Reservation Management
                </h2>
                <p className="text-xs text-warm-cream/60 mt-1">
                  Search, filter, allocate tables, and transition customer booking states.
                </p>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-[#211713] p-4 border border-warm-cream/10 space-y-3.5">
              {/* Top Row: Date Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-muted-gold font-mono mr-1">
                  Date:
                </span>
                {[
                  { id: "all", label: "All Dates" },
                  { id: "today", label: `Today (${todayStr})` },
                  { id: "tomorrow", label: "Tomorrow" },
                  { id: "next7", label: "Next 7 Days" },
                ].map((df) => (
                  <button
                    key={df.id}
                    type="button"
                    onClick={() => {
                      setDateFilter(df.id as typeof dateFilter);
                      setCustomDate("");
                    }}
                    className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                      dateFilter === df.id && !customDate
                        ? "bg-muted-gold text-espresso font-semibold"
                        : "bg-warm-cream/5 text-warm-cream/70 hover:text-warm-cream"
                    }`}
                  >
                    {df.label}
                  </button>
                ))}

                {/* Custom Date Input */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-[11px] text-warm-cream/50">Pick Date:</span>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      setCustomDate(e.target.value);
                      setDateFilter("custom");
                    }}
                    className="bg-[#18110E] border border-warm-cream/20 px-2 py-1 text-xs text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                  />
                  {customDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomDate("");
                        setDateFilter("all");
                      }}
                      className="text-xs text-warm-cream/50 hover:text-warm-cream p-1 cursor-pointer"
                      title="Clear custom date"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Status Filter & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-warm-cream/5">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                  <span className="text-[11px] uppercase tracking-wider text-muted-gold font-mono mr-1">
                    Status:
                  </span>
                  {(["all", "pending", "confirmed", "completed", "cancelled", "no_show"] as const).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setReservationFilter(st)}
                        className={`px-3 py-1 text-xs uppercase tracking-wider rounded transition-colors cursor-pointer whitespace-nowrap ${
                          reservationFilter === st
                            ? "bg-muted-gold text-espresso font-semibold"
                            : "bg-warm-cream/5 text-warm-cream/70 hover:text-warm-cream"
                        }`}
                      >
                        {st === "no_show" ? "No Show" : st}
                      </button>
                    )
                  )}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-warm-cream/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, phone, ref..."
                    className="w-full bg-[#18110E] border border-warm-cream/20 pl-8 pr-3 py-1.5 text-xs text-warm-cream placeholder:text-warm-cream/30 focus:outline-none focus:border-muted-gold rounded"
                  />
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-warm-cream/60 px-1">
              <span>
                Showing <strong className="text-warm-cream">{filteredReservations.length}</strong> of {reservations.length} reservations
              </span>
              {(reservationFilter !== "all" || dateFilter !== "all" || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setReservationFilter("all");
                    setDateFilter("all");
                    setCustomDate("");
                    setSearchQuery("");
                  }}
                  className="text-muted-gold hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Reservations Table */}
            <div className="bg-[#241914] border border-warm-cream/10 overflow-x-auto rounded shadow">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1410] border-b border-warm-cream/10 text-muted-gold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Party & Area</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Assigned Table</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-cream/5 font-sans">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-warm-cream/40 font-light">
                        No reservations found matching the specified filters.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => {
                      const confirmWhatsAppUrl = notificationService.generateOwnerConfirmationWhatsAppUrl(res);
                      const isUpdating = isUpdatingStatus === res.id;

                      return (
                        <tr
                          key={res.id}
                          className="hover:bg-warm-cream/5 transition-colors cursor-pointer group"
                          onClick={() => setSelectedReservation(res)}
                        >
                          <td className="py-3.5 px-4 font-mono font-medium text-muted-gold whitespace-nowrap">
                            #{res.referenceNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-warm-cream group-hover:text-muted-gold transition-colors">
                              {res.guestName}
                            </div>
                            <div className="text-[11px] text-warm-cream/50 flex items-center gap-1 mt-0.5">
                              <PhoneCall className="w-3 h-3 text-muted-gold" />
                              <span>{res.phone}</span>
                            </div>
                            {res.specialNotes && (
                              <div className="text-[10px] text-warm-cream/60 italic mt-0.5 truncate max-w-xs">
                                &ldquo;{res.specialNotes}&rdquo;
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-semibold text-warm-cream">{res.guestsCount} Guests</span>
                            <div className="text-[10px] text-muted-coffee uppercase tracking-wider mt-0.5">
                              {res.seatingArea}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="text-warm-cream">{res.reservationDate}</div>
                            <div className="text-[11px] text-warm-cream/60 flex items-center gap-1 mt-0.5 font-mono">
                              <Clock className="w-3 h-3 text-muted-gold" />
                              <span>{res.timeSlot}</span>
                            </div>
                          </td>
                          <td
                            className="py-3.5 px-4 whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <select
                              value={res.tableId || ""}
                              onChange={(e) => handleAssignTable(res.id, e.target.value || null)}
                              className="bg-[#18110E] border border-warm-cream/20 text-warm-cream text-xs px-2 py-1 rounded focus:outline-none focus:border-muted-gold"
                            >
                              <option value="">(Unassigned)</option>
                              {tables
                                .filter((t) => t.isActive)
                                .map((tbl) => (
                                  <option key={tbl.id} value={tbl.id}>
                                    Table {tbl.tableNumber} ({tbl.capacity}pax • {tbl.seatingArea})
                                  </option>
                                ))}
                            </select>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${getStatusBadge(res.status)}`}>
                              {res.status === "no_show" ? "no show" : res.status}
                            </span>
                          </td>
                          <td
                            className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Workflow Actions */}
                            {res.status === "pending" && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(res.id, "confirmed")}
                                className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[10px] uppercase tracking-wider rounded cursor-pointer disabled:opacity-50"
                              >
                                Confirm
                              </button>
                            )}

                            {(res.status === "confirmed" || res.status === "seated") && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(res.id, "completed")}
                                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 text-[10px] uppercase tracking-wider rounded cursor-pointer disabled:opacity-50"
                              >
                                Complete
                              </button>
                            )}

                            {(res.status === "pending" || res.status === "confirmed") && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(res.id, "cancelled")}
                                className="px-2 py-1 bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] uppercase tracking-wider rounded cursor-pointer disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            )}

                            {(res.status === "confirmed" || res.status === "pending") && (
                              <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(res.id, "no_show")}
                                className="px-2 py-1 bg-orange-950/60 hover:bg-orange-900 text-orange-300 border border-orange-800 text-[10px] uppercase tracking-wider rounded cursor-pointer disabled:opacity-50"
                              >
                                No Show
                              </button>
                            )}

                            <a
                              href={confirmWhatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-950/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700 text-[10px] uppercase tracking-wider rounded"
                              title="Send WhatsApp confirmation"
                            >
                              <MessageCircle className="w-3 h-3" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setSelectedReservation(res)}
                              className="px-2 py-1 bg-warm-cream/10 hover:bg-warm-cream/20 text-warm-cream text-[10px] uppercase tracking-wider rounded cursor-pointer"
                              title="View Full Details"
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 3. CUSTOMER INFORMATION */}
        {/* ========================================================================================= */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-warm-cream">
                  Customer Directory & History
                </h2>
                <p className="text-xs text-warm-cream/60 mt-1">
                  Guest contact profiles, repeat visit tallies, and full reservation histories.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-warm-cream/40" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search customer name or phone..."
                  className="w-full bg-[#18110E] border border-warm-cream/20 pl-8 pr-3 py-1.5 text-xs text-warm-cream placeholder:text-warm-cream/30 focus:outline-none focus:border-muted-gold rounded"
                />
              </div>
            </div>

            {/* Customer Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-muted-gold font-mono block">
                  Total Guests
                </span>
                <span className="font-serif text-2xl text-warm-cream mt-1 block">
                  {customers.length} Registered
                </span>
              </div>
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono block">
                  Repeat / Loyal Visitors
                </span>
                <span className="font-serif text-2xl text-warm-cream mt-1 block">
                  {customers.filter((c) => c.totalVisits > 1).length} Guests
                </span>
              </div>
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-sky-400 font-mono block">
                  Total Bookings Handled
                </span>
                <span className="font-serif text-2xl text-warm-cream mt-1 block">
                  {reservations.length} Reservations
                </span>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-[#241914] border border-warm-cream/10 overflow-x-auto rounded shadow">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1C1410] border-b border-warm-cream/10 text-muted-gold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Total Visits</th>
                    <th className="py-3 px-4">Last Visit</th>
                    <th className="py-3 px-4">Preferences & Notes</th>
                    <th className="py-3 px-4 text-right">Reservation History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-cream/5">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-warm-cream/40 font-light">
                        No customers found matching &ldquo;{customerSearch}&rdquo;.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((cust) => {
                      const cleanPhone = cust.phone.replace(/[^0-9]/g, "");
                      const custReservations = reservations.filter(
                        (r) =>
                          r.customerId === cust.id ||
                          r.phone.replace(/[^0-9]/g, "") === cleanPhone
                      );
                      const isExpanded = expandedCustomerHistory === cust.id;

                      return (
                        <React.Fragment key={cust.id}>
                          <tr className="hover:bg-warm-cream/5 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-warm-cream flex items-center gap-1.5">
                                <span>{cust.name}</span>
                                {cust.totalVisits > 1 && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-muted-gold/20 text-muted-gold border border-muted-gold/30 uppercase font-mono">
                                    Loyal
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`tel:${cust.phone}`}
                                  className="text-warm-cream hover:text-muted-gold transition-colors font-mono"
                                >
                                  {cust.phone}
                                </a>
                                <a
                                  href={`https://wa.me/${cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300"
                                  title="WhatsApp Customer"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              {cust.email && (
                                <div className="text-[11px] text-warm-cream/50 mt-0.5">
                                  {cust.email}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-warm-cream">
                              {cust.totalVisits} {cust.totalVisits === 1 ? "visit" : "visits"}
                            </td>
                            <td className="py-3.5 px-4 text-warm-cream/70">
                              {cust.lastVisitAt
                                ? new Date(cust.lastVisitAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="py-3.5 px-4">
                              {cust.preferredSeating && (
                                <span className="inline-block px-2 py-0.5 bg-warm-cream/10 text-warm-cream/80 text-[10px] rounded uppercase mr-1">
                                  {cust.preferredSeating}
                                </span>
                              )}
                              {cust.dietaryNotes && (
                                <span className="text-[11px] text-warm-cream/60 italic">
                                  {cust.dietaryNotes}
                                </span>
                              )}
                              {!cust.preferredSeating && !cust.dietaryNotes && (
                                <span className="text-warm-cream/30 italic">No notes</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedCustomerHistory(isExpanded ? null : cust.id)
                                }
                                className="inline-flex items-center gap-1 px-3 py-1 bg-warm-cream/10 hover:bg-warm-cream/20 text-warm-cream text-xs rounded transition-colors cursor-pointer"
                              >
                                <span>{custReservations.length} Bookings</span>
                                <ChevronRight
                                  className={`w-3 h-3 transition-transform ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </button>
                            </td>
                          </tr>

                          {/* Expanded Reservation History Accordion */}
                          {isExpanded && (
                            <tr className="bg-[#1B120E]">
                              <td colSpan={6} className="p-4 border-t border-warm-cream/10">
                                <div className="space-y-2 max-w-4xl">
                                  <h4 className="text-[11px] uppercase tracking-wider text-muted-gold font-mono">
                                    Reservation History for {cust.name}:
                                  </h4>
                                  {custReservations.length === 0 ? (
                                    <p className="text-xs text-warm-cream/40 italic">
                                      No direct reservation logs found for this customer.
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                      {custReservations.map((r) => (
                                        <div
                                          key={r.id}
                                          className="p-2.5 bg-[#241914] border border-warm-cream/10 rounded flex items-center justify-between"
                                        >
                                          <div>
                                            <span className="font-mono text-muted-gold">#{r.referenceNumber}</span>
                                            <span className="text-warm-cream ml-2 font-medium">
                                              {r.reservationDate} • {r.timeSlot}
                                            </span>
                                            <div className="text-[11px] text-warm-cream/50 mt-0.5">
                                              {r.guestsCount} guests • {r.seatingArea}
                                            </div>
                                          </div>
                                          <span className={`px-2 py-0.5 text-[9px] uppercase font-semibold rounded ${getStatusBadge(r.status)}`}>
                                            {r.status}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 4. TABLE MANAGEMENT */}
        {/* ========================================================================================= */}
        {activeTab === "tables" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-warm-cream">
                  Table Management
                </h2>
                <p className="text-xs text-warm-cream/60 mt-1">
                  Configure cafe floor capacity, seating sections, and toggle table active/maintenance status.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-muted-gold text-espresso font-semibold text-xs uppercase tracking-wider rounded hover:bg-muted-gold/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Table</span>
                </button>
              </div>
            </div>

            {/* Table Floor Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-muted-gold font-mono block">
                  Total Tables
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {tables.length}
                </span>
              </div>
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono block">
                  Active Tables
                </span>
                <span className="font-serif text-3xl text-emerald-400 mt-1 block">
                  {tables.filter((t) => t.isActive).length}
                </span>
              </div>
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-red-400 font-mono block">
                  Inactive / Maintenance
                </span>
                <span className="font-serif text-3xl text-warm-cream/50 mt-1 block">
                  {tables.filter((t) => !t.isActive).length}
                </span>
              </div>
              <div className="bg-[#241914] p-4 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-sky-400 font-mono block">
                  Live Seating Capacity
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {tables.filter((t) => t.isActive).reduce((sum, t) => sum + t.capacity, 0)} Seats
                </span>
              </div>
            </div>

            {/* Filter search */}
            <div className="flex items-center justify-between bg-[#211713] p-3 border border-warm-cream/10">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-warm-cream/40" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter tables..."
                  className="w-full bg-[#18110E] border border-warm-cream/20 pl-8 pr-3 py-1.5 text-xs text-warm-cream placeholder:text-warm-cream/30 focus:outline-none focus:border-muted-gold rounded"
                />
              </div>
              <span className="text-xs text-warm-cream/50 hidden sm:inline">
                Click toggle switch to change table active/maintenance status
              </span>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTables.map((tbl) => {
                const todayAssigned = todayReservations.filter((r) => r.tableId === tbl.id);
                return (
                  <div
                    key={tbl.id}
                    className={`p-5 bg-[#241914] border transition-all rounded space-y-3 ${
                      tbl.isActive
                        ? "border-warm-cream/10 hover:border-muted-gold/40"
                        : "border-red-900/40 opacity-70 bg-[#1D1411]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-warm-cream/5 border border-warm-cream/10 flex items-center justify-center font-mono font-bold text-muted-gold text-sm">
                          {tbl.tableNumber}
                        </div>
                        <div>
                          <span className="font-semibold text-warm-cream text-sm block">
                            Table {tbl.tableNumber}
                          </span>
                          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-coffee block">
                            {tbl.seatingArea}
                          </span>
                        </div>
                      </div>

                      {/* Active/Inactive Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleTableStatus(tbl.id, tbl.isActive)}
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          tbl.isActive ? "bg-emerald-600" : "bg-stone-700"
                        }`}
                        title={tbl.isActive ? "Active (Click to disable)" : "Inactive (Click to activate)"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            tbl.isActive ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-warm-cream/5">
                      <span className="text-warm-cream/60">Capacity:</span>
                      <span className="font-semibold text-warm-cream flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-muted-gold" />
                        {tbl.capacity} Guests
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-warm-cream/60">Status:</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] uppercase font-mono font-semibold rounded ${
                          tbl.isActive
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                            : "bg-red-950 text-red-300 border border-red-800"
                        }`}
                      >
                        {tbl.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {tbl.notes && (
                      <p className="text-[11px] text-warm-cream/50 italic bg-[#1B130F] p-2 rounded border border-warm-cream/5">
                        {tbl.notes}
                      </p>
                    )}

                    {todayAssigned.length > 0 && (
                      <div className="text-[11px] text-sky-400 bg-sky-950/40 p-2 rounded border border-sky-900/60 font-mono">
                        {todayAssigned.length} booking(s) scheduled today
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 5. BUSINESS SETTINGS */}
        {/* ========================================================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-warm-cream">
                Business & Reservation Settings
              </h2>
              <p className="text-xs text-warm-cream/60 mt-1">
                Configure store operating hours, live reservation availability, and official customer contacts.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-4 bg-emerald-950 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2 rounded">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Business settings have been successfully updated in database!</span>
              </div>
            )}

            {/* Quick Toggle: Reservation Availability */}
            <div className="bg-[#241914] border border-warm-cream/10 p-5 rounded space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base text-warm-cream">
                    Accepting Table Reservations
                  </h3>
                  <p className="text-xs text-warm-cream/60 mt-0.5">
                    Toggle online bookings on the website. If turned off, visitors see reservations temporarily closed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleOnlineReservations(!settings.isAcceptingReservations)}
                  className={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.isAcceptingReservations ? "bg-emerald-600" : "bg-stone-700"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.isAcceptingReservations ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSaveSettings}
              className="bg-[#241914] border border-warm-cream/10 p-6 space-y-5 text-xs rounded"
            >
              {/* Store Identity */}
              <div className="space-y-3">
                <h4 className="text-[11px] uppercase tracking-wider text-muted-gold font-mono border-b border-warm-cream/10 pb-1">
                  1. Brand Identity & Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settings.shopName}
                      onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                    Full Physical Address
                  </label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                    required
                  />
                </div>
              </div>

              {/* Opening Hours */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] uppercase tracking-wider text-muted-gold font-mono border-b border-warm-cream/10 pb-1">
                  2. Operating Hours
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      Weekday Hours (Mon – Fri)
                    </label>
                    <input
                      type="text"
                      value={settings.openingHoursWeekday}
                      onChange={(e) =>
                        setSettings({ ...settings, openingHoursWeekday: e.target.value })
                      }
                      placeholder="e.g. 7:00 AM – 10:00 PM"
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      Weekend Hours (Sat – Sun)
                    </label>
                    <input
                      type="text"
                      value={settings.openingHoursWeekend}
                      onChange={(e) =>
                        setSettings({ ...settings, openingHoursWeekend: e.target.value })
                      }
                      placeholder="e.g. 7:30 AM – 11:00 PM"
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] uppercase tracking-wider text-muted-gold font-mono border-b border-warm-cream/10 pb-1">
                  3. Contact Channels & Google Maps
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      WhatsApp Number (Digits with country code)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      placeholder="e.g. 94770000000"
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      Phone Number (Formatted)
                    </label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      placeholder="e.g. +94 11 234 5678"
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      Customer Service Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                      Max Party Size (Per Booking)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={settings.maxPartySize || 12}
                      onChange={(e) =>
                        setSettings({ ...settings, maxPartySize: Number(e.target.value) })
                      }
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-warm-cream/70 mb-1">
                    Google Maps URL
                  </label>
                  <input
                    type="url"
                    value={settings.googleMapsUrl}
                    onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-6 py-2.5 bg-muted-gold text-espresso font-semibold uppercase tracking-wider text-xs cursor-pointer hover:bg-muted-gold/90 transition-colors rounded disabled:opacity-50"
                >
                  {isSavingSettings ? "Saving Settings..." : "Save Business Settings"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 6. INQUIRIES */}
        {/* ========================================================================================= */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-warm-cream">Customer Inquiries Inbox</h3>
            <p className="text-xs text-warm-cream/60">
              Direct messages submitted through the website Contact Page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-[#241914] p-5 border border-warm-cream/10 space-y-3 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-warm-cream text-sm">{inq.name}</span>
                    <span className="text-[10px] text-warm-cream/40">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-warm-cream/70 font-light whitespace-pre-wrap bg-[#1B130F] p-3 border border-warm-cream/5 rounded">
                    {inq.message}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-gold">
                      {inq.email} • {inq.phone}
                    </span>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${inq.name}, thank you for contacting Movi Coffee!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Reply on WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 7. MENU & STOCK */}
        {/* ========================================================================================= */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-warm-cream">Digital Menu Stock Manager</h3>
              <p className="text-xs text-warm-cream/60 mt-1">
                Toggle items out of stock if coffee beans or freshly baked items sell out during the day.
              </p>
            </div>

            <div className="space-y-6">
              {menuCategories.map((cat) => (
                <div key={cat.id} className="bg-[#241914] border border-warm-cream/10 p-5 rounded">
                  <h4 className="font-serif text-lg text-muted-gold uppercase tracking-wider mb-4 border-b border-warm-cream/10 pb-2">
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.items.map((item) => {
                      const isAvailable = menuAvailability[item.id] !== false;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-[#1B130F] border border-warm-cream/5 rounded"
                        >
                          <div>
                            <div className="font-medium text-xs text-warm-cream">{item.name}</div>
                            <div className="text-[11px] text-muted-gold">{item.price}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleStock(item.id, isAvailable)}
                            className={`px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider rounded transition-colors cursor-pointer ${
                              isAvailable
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-red-950 hover:text-red-300 hover:border-red-800"
                                : "bg-red-950 text-red-300 border border-red-800 hover:bg-emerald-950 hover:text-emerald-300"
                            }`}
                          >
                            {isAvailable ? "In Stock" : "Sold Out"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* ========================================================================================= */}
        {/* 8. SEASONAL CAMPAIGN SYSTEM */}
        {/* ========================================================================================= */}
        {activeTab === "seasonal" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h3 className="font-serif text-2xl text-warm-cream">Seasonal Experience Manager</h3>
              <p className="text-xs text-warm-cream/60 mt-1">
                Configure centralized campaigns that automatically activate on schedule and cleanly revert to the core brand experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {seasonal.map((camp) => (
                <div key={camp.id} className="bg-[#241914] border border-warm-cream/10 p-5 sm:p-6 space-y-4 rounded shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-cream/10 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-muted-gold/20 text-muted-gold border border-muted-gold/40 font-semibold">
                        {camp.tag}
                      </span>
                      <span className="text-xs text-warm-cream/50 font-mono">
                        Theme: {camp.theme || "custom"}
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={camp.isActive}
                        onChange={async (e) => {
                          const newActive = e.target.checked;
                          setSeasonal((prev) =>
                            prev.map((s) => (s.id === camp.id ? { ...s, isActive: newActive } : s))
                          );
                          await updateSeasonalExperienceAction(camp.id, { isActive: newActive });
                          showToast(`Campaign ${newActive ? "activated" : "deactivated"} on public site`);
                        }}
                        className="accent-muted-gold w-4 h-4 cursor-pointer"
                      />
                      <span className={camp.isActive ? "text-emerald-400 font-medium" : "text-warm-cream/50"}>
                        {camp.isActive ? "Active on Public Site" : "Inactive / Scheduled"}
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1 font-mono">
                        Campaign Title
                      </label>
                      <input
                        type="text"
                        value={camp.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeasonal((prev) =>
                            prev.map((s) => (s.id === camp.id ? { ...s, title: val } : s))
                          );
                        }}
                        className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1 font-mono">
                        Highlight Subtext
                      </label>
                      <input
                        type="text"
                        value={camp.highlightText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeasonal((prev) =>
                            prev.map((s) => (s.id === camp.id ? { ...s, highlightText: val } : s))
                          );
                        }}
                        className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1 font-mono">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={camp.startDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeasonal((prev) =>
                            prev.map((s) => (s.id === camp.id ? { ...s, startDate: val } : s))
                          );
                        }}
                        className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-1.5 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1 font-mono">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={camp.endDate}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeasonal((prev) =>
                            prev.map((s) => (s.id === camp.id ? { ...s, endDate: val } : s))
                          );
                        }}
                        className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-1.5 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1 font-mono">
                        Subtle Visual Effect
                      </label>
                      <select
                        value={camp.visualEffect || "none"}
                        onChange={(e) => {
                          const val = e.target.value as SeasonalVisualEffect;
                          setSeasonal((prev) =>
                            prev.map((s) => (s.id === camp.id ? { ...s, visualEffect: val } : s))
                          );
                        }}
                        className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                      >
                        <option value="none">None (Standard Brand)</option>
                        <option value="snowfall">Snowfall (Christmas)</option>
                        <option value="warm-lights">Warm Lights (Valentine/Evening)</option>
                        <option value="golden-shimmer">Golden Shimmer (New Year)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1 font-mono">
                      Campaign Description & Story
                    </label>
                    <textarea
                      rows={2}
                      value={camp.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSeasonal((prev) =>
                          prev.map((s) => (s.id === camp.id ? { ...s, description: val } : s))
                        );
                      }}
                      className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-xs text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-warm-cream/40">
                      Auto-activates when current date is between {camp.startDate} and {camp.endDate}.
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        await updateSeasonalExperienceAction(camp.id, camp);
                        showToast(`Saved changes for ${camp.tag}`);
                      }}
                      className="px-4 py-1.5 bg-muted-gold text-espresso font-semibold text-xs uppercase tracking-wider cursor-pointer hover:bg-muted-gold/90 rounded transition-colors"
                    >
                      Save Configuration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 9. AI BUSINESS & OPERATIONS ASSISTANT */}
        {/* ========================================================================================= */}
        {activeTab === "ai" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h3 className="font-serif text-2xl text-warm-cream">Movi Business AI Assistant</h3>
              <p className="text-xs text-warm-cream/60 mt-1">
                Executive intelligence operating exclusively through controlled server-side tools. Customer privacy is strictly protected.
              </p>
            </div>

            {/* Quick Prompt Suggestions Grid */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-gold font-mono block">
                Executive Business Queries:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  "How many reservations do we have today?",
                  "How many guests are expected today?",
                  "What are our busiest reservation times?",
                  "How many confirmed reservations do we have this week?",
                  "How many cancellations happened?",
                  "Summarize this week's reservation activity.",
                  "Show reservation trends.",
                  "Draft a social media caption for a new menu item.",
                  "Suggest promotional content based only on the business information provided.",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendAi(prompt)}
                    className="text-left p-2.5 bg-[#241914] hover:bg-[#2D1F19] border border-warm-cream/10 hover:border-muted-gold/50 text-[11px] text-warm-cream/80 hover:text-warm-cream rounded transition-colors cursor-pointer"
                  >
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Conversation Console */}
            <div className="bg-[#241914] border border-warm-cream/10 flex flex-col h-[550px] rounded shadow-xl overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs">
                {aiChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] p-4 text-xs sm:text-sm leading-relaxed rounded-xl ${
                        msg.role === "user"
                          ? "bg-muted-gold text-espresso font-medium rounded-tr-none"
                          : "bg-[#1A120E] text-warm-cream border border-warm-cream/10 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-warm-cream/10 flex flex-wrap gap-1.5">
                          {msg.suggestions.map((sug, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSendAi(sug)}
                              className="px-2.5 py-1 bg-warm-cream/10 hover:bg-warm-cream/20 text-[11px] text-warm-cream rounded transition-colors cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="text-xs text-muted-gold italic p-3 flex items-center gap-2 bg-[#1A120E] border border-warm-cream/10 rounded-xl w-fit">
                    <Coffee className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing controlled analytics tools...</span>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendAi();
                }}
                className="p-3 bg-[#1B130F] border-t border-warm-cream/10 flex gap-2"
              >
                <input
                  type="text"
                  value={aiQuery}
                  disabled={isAiLoading}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask about peak hours, today's arrivals, or drafting social captions..."
                  className="flex-1 bg-[#150E0B] border border-warm-cream/20 px-3.5 py-2 text-xs text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                />
                <button
                  type="submit"
                  disabled={!aiQuery.trim() || isAiLoading}
                  className="px-5 py-2 bg-muted-gold text-espresso text-xs font-semibold uppercase tracking-wider disabled:opacity-40 cursor-pointer rounded hover:bg-muted-gold/90 transition-colors"
                >
                  <Send className="w-3.5 h-3.5 inline mr-1" />
                  Ask AI
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================================= */}
        {/* 10. REAL DATABASE BUSINESS ANALYTICS */}
        {/* ========================================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-warm-cream/10 pb-4">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-warm-cream">Business Analytics Hub</h3>
                <p className="text-xs text-warm-cream/60 mt-1">
                  Computed directly from actual database reservations. Privacy safe with zero fabricated statistics.
                </p>
              </div>
              <span className="text-xs font-mono text-muted-gold bg-muted-gold/10 px-2.5 py-1 rounded border border-muted-gold/30">
                Live Data Verified
              </span>
            </div>

            {/* Core Analytics KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
              <div className="bg-[#241914] p-4 border border-warm-cream/10 rounded">
                <span className="text-[10px] uppercase tracking-widest text-muted-gold block font-mono">
                  Total Bookings
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {businessAnalytics.overview.totalReservations}
                </span>
                <span className="text-[10px] text-warm-cream/40 mt-0.5 block">Lifetime recorded</span>
              </div>

              <div className="bg-[#241914] p-4 border border-warm-cream/10 rounded">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 block font-mono">
                  Confirmed Bookings
                </span>
                <span className="font-serif text-3xl text-emerald-400 mt-1 block">
                  {businessAnalytics.overview.confirmedCount}
                </span>
                <span className="text-[10px] text-emerald-400/60 mt-0.5 block">
                  {businessAnalytics.overview.confirmationRate}% fulfillment rate
                </span>
              </div>

              <div className="bg-[#241914] p-4 border border-warm-cream/10 rounded">
                <span className="text-[10px] uppercase tracking-widest text-red-400 block font-mono">
                  Cancelled
                </span>
                <span className="font-serif text-3xl text-red-400 mt-1 block">
                  {businessAnalytics.overview.cancelledCount}
                </span>
                <span className="text-[10px] text-red-400/60 mt-0.5 block">
                  {businessAnalytics.overview.cancellationRate}% cancellation rate
                </span>
              </div>

              <div className="bg-[#241914] p-4 border border-warm-cream/10 rounded">
                <span className="text-[10px] uppercase tracking-widest text-orange-400 block font-mono">
                  No-Shows
                </span>
                <span className="font-serif text-3xl text-orange-400 mt-1 block">
                  {businessAnalytics.overview.noShowCount}
                </span>
                <span className="text-[10px] text-warm-cream/40 mt-0.5 block">Unfulfilled tables</span>
              </div>

              <div className="bg-[#241914] p-4 border border-warm-cream/10 rounded">
                <span className="text-[10px] uppercase tracking-widest text-sky-400 block font-mono">
                  Total Guests Handled
                </span>
                <span className="font-serif text-3xl text-sky-400 mt-1 block">
                  {businessAnalytics.overview.totalGuests}
                </span>
                <span className="text-[10px] text-warm-cream/40 mt-0.5 block">Non-cancelled guests</span>
              </div>

              <div className="bg-[#241914] p-4 border border-warm-cream/10 rounded">
                <span className="text-[10px] uppercase tracking-widest text-muted-coffee block font-mono">
                  Avg Party Size
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {businessAnalytics.overview.averagePartySize}
                </span>
                <span className="text-[10px] text-warm-cream/40 mt-0.5 block">Guests per table</span>
              </div>
            </div>

            {/* Daily Trends & Status Breakdown (Split 2-Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Reservation Trends (2 Cols) */}
              <div className="lg:col-span-2 bg-[#241914] border border-warm-cream/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2.5">
                  <h4 className="font-serif text-lg text-warm-cream">Daily Reservation Trends (Last 7 Days)</h4>
                  <span className="text-xs font-mono text-muted-gold">Volume & Capacity</span>
                </div>

                <div className="grid grid-cols-7 gap-2 pt-4">
                  {businessAnalytics.dailyTrends.map((d) => {
                    const maxBar = Math.max(1, ...businessAnalytics.dailyTrends.map((t) => t.bookings));
                    const heightPercent = Math.min(100, Math.max(15, (d.bookings / maxBar) * 100));
                    return (
                      <div key={d.date} className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-mono text-warm-cream font-bold">
                          {d.bookings}
                        </span>
                        <div className="w-full bg-[#1B130F] h-32 rounded flex flex-col justify-end p-1 border border-warm-cream/5">
                          <div
                            className="w-full bg-muted-gold rounded-sm transition-all"
                            style={{ height: `${heightPercent}%` }}
                            title={`${d.dayLabel}: ${d.bookings} bookings, ${d.guests} guests`}
                          />
                        </div>
                        <span className="text-[10px] text-warm-cream/60 truncate text-center">
                          {d.dayLabel.split(",")[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-[#241914] border border-warm-cream/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2.5">
                  <h4 className="font-serif text-lg text-warm-cream">Status Breakdown</h4>
                  <span className="text-xs font-mono text-muted-gold">{businessAnalytics.overview.totalReservations} Total</span>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  {businessAnalytics.statusBreakdown.map((st) => (
                    <div key={st.status} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-warm-cream font-medium">{st.label}</span>
                        <span className="font-mono text-warm-cream/70">
                          {st.count} ({st.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#18110E] h-2 rounded overflow-hidden">
                        <div
                          className="h-full rounded"
                          style={{
                            width: `${st.percentage}%`,
                            backgroundColor: st.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Busiest Time Periods & Seating Area Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Busiest Time Periods */}
              <div className="bg-[#241914] border border-warm-cream/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2.5">
                  <h4 className="font-serif text-lg text-warm-cream">Busiest Time Periods</h4>
                  <span className="text-xs font-mono text-muted-gold">Slot Demand Heatmap</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {businessAnalytics.busiestTimeSlots.map((slot) => (
                    <div
                      key={slot.timeSlot}
                      className="p-3 bg-[#1B130F] border border-warm-cream/5 rounded flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-gold" />
                        <span className="font-mono font-semibold text-warm-cream">{slot.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-warm-cream/70">{slot.totalGuests} Guests</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted-gold/20 text-muted-gold border border-muted-gold/30">
                          {slot.count} Bookings
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seating Area Popularity */}
              <div className="bg-[#241914] border border-warm-cream/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2.5">
                  <h4 className="font-serif text-lg text-warm-cream">Seating Area Preferences</h4>
                  <span className="text-xs font-mono text-muted-gold">Customer Allocation</span>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  {businessAnalytics.seatingAreaDistribution.map((area) => (
                    <div key={area.area} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-warm-cream font-medium">{area.area}</span>
                        <span className="font-mono text-muted-gold">
                          {area.count} Bookings ({area.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#18110E] h-2.5 rounded overflow-hidden">
                        <div
                          className="h-full bg-muted-gold rounded"
                          style={{ width: `${area.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Digital Engagement & Menu Interest */}
            {analyticsSummary && (
              <div className="bg-[#241914] border border-warm-cream/10 p-5 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-warm-cream/10 pb-2.5">
                  <h4 className="font-serif text-lg text-warm-cream">Digital Traffic & Menu Discoveries</h4>
                  <span className="text-xs font-mono text-muted-gold">Storefront Analytics</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  <div className="p-4 bg-[#1B130F] border border-warm-cream/5 rounded">
                    <span className="text-[10px] uppercase tracking-wider text-muted-gold font-mono block">Website Page Views</span>
                    <span className="font-serif text-2xl text-warm-cream mt-1 block">{analyticsSummary.totalPageViews}</span>
                    <span className="text-[10px] text-warm-cream/50 mt-0.5 block">Storefront engagement</span>
                  </div>
                  <div className="p-4 bg-[#1B130F] border border-warm-cream/5 rounded">
                    <span className="text-[10px] uppercase tracking-wider text-muted-gold font-mono block">Online Booking Inquiries</span>
                    <span className="font-serif text-2xl text-warm-cream mt-1 block">{analyticsSummary.totalBookings}</span>
                    <span className="text-[10px] text-warm-cream/50 mt-0.5 block">Web reservations initiated</span>
                  </div>
                  <div className="p-4 bg-[#1B130F] border border-warm-cream/5 rounded sm:col-span-2 lg:col-span-1">
                    <span className="text-[10px] uppercase tracking-wider text-muted-gold font-mono block mb-2">Top Viewed Menu Items</span>
                    <div className="space-y-1.5 text-xs">
                      {analyticsSummary.popularItems && analyticsSummary.popularItems.length > 0 ? (
                        analyticsSummary.popularItems.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-warm-cream/80">
                            <span className="truncate">{item.name}</span>
                            <span className="font-mono text-muted-gold font-medium">{item.views} views</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-warm-cream/40 italic">Activity registering...</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================================= */}
      {/* MODAL 1: VIEW RESERVATION DETAILS & WORKFLOW */}
      {/* ========================================================================================= */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#241914] border border-warm-cream/20 max-w-xl w-full p-6 sm:p-7 space-y-5 rounded shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedReservation(null)}
              className="absolute top-5 right-5 text-warm-cream/50 hover:text-warm-cream p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-warm-cream/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-muted-gold text-sm font-semibold">
                  #{selectedReservation.referenceNumber}
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] uppercase font-semibold rounded ${getStatusBadge(selectedReservation.status)}`}>
                  {selectedReservation.status.replace("_", " ")}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-warm-cream mt-1">
                {selectedReservation.guestName}
              </h3>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-[#1B130F] p-3 rounded border border-warm-cream/5">
                <span className="text-[10px] uppercase text-warm-cream/50 block font-mono">Date & Time</span>
                <span className="text-warm-cream font-medium mt-1 block">
                  {selectedReservation.reservationDate} at {selectedReservation.timeSlot}
                </span>
              </div>

              <div className="bg-[#1B130F] p-3 rounded border border-warm-cream/5">
                <span className="text-[10px] uppercase text-warm-cream/50 block font-mono">Party Size & Area</span>
                <span className="text-warm-cream font-medium mt-1 block">
                  {selectedReservation.guestsCount} Guests ({selectedReservation.seatingArea})
                </span>
              </div>

              <div className="bg-[#1B130F] p-3 rounded border border-warm-cream/5">
                <span className="text-[10px] uppercase text-warm-cream/50 block font-mono">Phone Number</span>
                <a
                  href={`tel:${selectedReservation.phone}`}
                  className="text-muted-gold font-medium mt-1 block font-mono hover:underline"
                >
                  {selectedReservation.phone}
                </a>
              </div>

              <div className="bg-[#1B130F] p-3 rounded border border-warm-cream/5">
                <span className="text-[10px] uppercase text-warm-cream/50 block font-mono">Email Address</span>
                <span className="text-warm-cream font-medium mt-1 block truncate">
                  {selectedReservation.email || "None provided"}
                </span>
              </div>
            </div>

            {/* Special Request */}
            {selectedReservation.specialNotes && (
              <div className="bg-[#1B130F] p-3.5 rounded border border-warm-cream/10 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-gold font-mono block">
                  Guest Special Requests / Notes:
                </span>
                <p className="text-xs text-warm-cream/80 italic whitespace-pre-wrap">
                  &ldquo;{selectedReservation.specialNotes}&rdquo;
                </p>
              </div>
            )}

            {/* Table Assignment Selector */}
            <div className="bg-[#1B130F] p-3.5 rounded border border-warm-cream/10 space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-muted-gold font-mono block">
                Assign Cafe Table:
              </span>
              <select
                value={selectedReservation.tableId || ""}
                onChange={(e) => handleAssignTable(selectedReservation.id, e.target.value || null)}
                className="w-full bg-[#150E0B] border border-warm-cream/20 text-warm-cream text-xs px-3 py-2 rounded focus:outline-none focus:border-muted-gold"
              >
                <option value="">(Unassigned - allocate at door)</option>
                {tables
                  .filter((t) => t.isActive)
                  .map((tbl) => (
                    <option key={tbl.id} value={tbl.id}>
                      Table {tbl.tableNumber} — {tbl.capacity} Pax ({tbl.seatingArea})
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Workflow Action Buttons */}
            <div className="border-t border-warm-cream/10 pt-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedReservation.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedReservation.id, "confirmed")}
                    className="px-3.5 py-1.5 bg-emerald-900 text-emerald-200 border border-emerald-700 text-xs uppercase font-semibold tracking-wider rounded hover:bg-emerald-800 cursor-pointer"
                  >
                    Confirm Reservation
                  </button>
                )}

                {(selectedReservation.status === "confirmed" || selectedReservation.status === "seated") && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedReservation.id, "completed")}
                    className="px-3.5 py-1.5 bg-stone-800 text-stone-200 border border-stone-600 text-xs uppercase font-semibold tracking-wider rounded hover:bg-stone-700 cursor-pointer"
                  >
                    Mark Completed
                  </button>
                )}

                {(selectedReservation.status === "confirmed" || selectedReservation.status === "pending") && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedReservation.id, "no_show")}
                    className="px-3 py-1.5 bg-orange-950 text-orange-300 border border-orange-800 text-xs uppercase font-semibold tracking-wider rounded hover:bg-orange-900 cursor-pointer"
                  >
                    Mark No Show
                  </button>
                )}

                {selectedReservation.status !== "cancelled" && selectedReservation.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedReservation.id, "cancelled")}
                    className="px-3 py-1.5 bg-red-950 text-red-300 border border-red-800 text-xs uppercase font-semibold tracking-wider rounded hover:bg-red-900 cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              <a
                href={notificationService.generateOwnerConfirmationWhatsAppUrl(selectedReservation)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs uppercase font-semibold tracking-wider rounded hover:bg-emerald-900"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Guest</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================================= */}
      {/* MODAL 2: ADD NEW TABLE */}
      {/* ========================================================================================= */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#241914] border border-warm-cream/20 max-w-md w-full p-6 space-y-4 rounded shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddTableOpen(false)}
              className="absolute top-5 right-5 text-warm-cream/50 hover:text-warm-cream p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl text-warm-cream">Add New Table</h3>
            <p className="text-xs text-warm-cream/60">
              Create a new table for reservation allocation and floor plan tracking.
            </p>

            <form onSubmit={handleAddTable} className="space-y-4 text-xs pt-1">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                  Table Number / Identifier
                </label>
                <input
                  type="text"
                  placeholder="e.g. T-07 or C-03"
                  value={newTableForm.tableNumber}
                  onChange={(e) =>
                    setNewTableForm({ ...newTableForm, tableNumber: e.target.value })
                  }
                  className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Seating Area
                  </label>
                  <select
                    value={newTableForm.seatingArea}
                    onChange={(e) =>
                      setNewTableForm({
                        ...newTableForm,
                        seatingArea: e.target.value as SeatingArea,
                      })
                    }
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                  >
                    <option value="salon">Main Salon</option>
                    <option value="courtyard">Courtyard</option>
                    <option value="quiet-nook">Quiet Nook</option>
                    <option value="communal">Communal Bar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newTableForm.capacity}
                    onChange={(e) =>
                      setNewTableForm({ ...newTableForm, capacity: Number(e.target.value) })
                    }
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                  Location Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near power outlet, window view"
                  value={newTableForm.notes}
                  onChange={(e) => setNewTableForm({ ...newTableForm, notes: e.target.value })}
                  className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-4 py-2 bg-warm-cream/10 text-warm-cream text-xs uppercase tracking-wider rounded hover:bg-warm-cream/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-muted-gold text-espresso font-semibold text-xs uppercase tracking-wider rounded hover:bg-muted-gold/90 cursor-pointer"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
