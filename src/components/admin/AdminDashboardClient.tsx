"use client";

import React, { useState } from "react";
import { Reservation, ReservationStatus } from "@/types/reservation";
import { BusinessSettings, SeasonalExperience } from "@/types/settings";
import { ContactInquiry } from "@/lib/db/storage";
import { updateReservationStatusAction } from "@/actions/reservations";
import { updateBusinessSettingsAction, toggleMenuItemStockAction, updateSeasonalExperienceAction } from "@/actions/settings";
import { askOwnerAiAction } from "@/actions/ai";
import { logoutAction } from "@/actions/auth";
import { menuCategories } from "@/data/menu";
import { notificationService } from "@/lib/notifications/whatsapp";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
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
  Bot
} from "lucide-react";

interface AdminDashboardProps {
  initialReservations: Reservation[];
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
  initialInquiries,
  initialSettings,
  initialSeasonal,
  initialMenuAvailability,
  analyticsSummary,
}) => {
  const [activeTab, setActiveTab] = useState<
    "reservations" | "inquiries" | "menu" | "seasonal" | "settings" | "ai" | "analytics"
  >("reservations");

  // State
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [seasonal, setSeasonal] = useState<SeasonalExperience[]>(initialSeasonal);
  const [menuAvailability, setMenuAvailability] = useState<Record<string, boolean>>(initialMenuAvailability);
  const [reservationFilter, setReservationFilter] = useState<ReservationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // AI Chat State
  const [aiQuery, setAiQuery] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ role: "user" | "assistant"; content: string; suggestions?: string[] }>>([
    {
      role: "assistant",
      content:
        "Hello! I am your **Movi Operations Assistant**. Ask me about reservation trends, inventory prep for weekends, or drafting customer replies.",
      suggestions: ["Reservation briefing", "Weekend coffee stock checklist", "Marketing promo ideas"],
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Settings Save State
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Handle Reservation Status Change
  const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
    const result = await updateReservationStatusAction(id, newStatus);
    if (result.success && result.reservation) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? result.reservation! : r))
      );
    }
  };

  // Handle Menu Item Stock Toggle
  const handleToggleStock = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setMenuAvailability((prev) => ({ ...prev, [itemId]: newStatus }));
    await toggleMenuItemStockAction(itemId, newStatus);
  };

  // Handle Settings Submit
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateBusinessSettingsAction(settings);
    if (res.success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    }
  };

  // Handle AI Message
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
          content: "Sorry, I encountered an issue accessing business logs. Please try again.",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const filteredReservations = reservations
    .filter((r) => reservationFilter === "all" || r.status === reservationFilter)
    .filter((r) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.guestName.toLowerCase().includes(q) ||
        r.referenceNumber.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    });

  return (
    <div className="min-h-screen bg-espresso text-warm-cream font-sans">
      {/* Top Bar */}
      <header className="border-b border-warm-cream/10 bg-[#17100D] px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-muted-gold/20 flex items-center justify-center border border-muted-gold/40 text-muted-gold">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl text-warm-cream leading-none">
                {settings.shopName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider bg-muted-gold/20 text-muted-gold border border-muted-gold/30">
                OWNER ADMIN
              </span>
            </div>
            <p className="text-xs text-warm-cream/50 mt-1">
              {settings.city}, Sri Lanka • Real-time Operations Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sans tracking-wide text-warm-cream/70 hover:text-muted-gold transition-colors underline decoration-warm-cream/20 underline-offset-4"
          >
            Open Public Site ↗
          </a>
          <button
            type="button"
            onClick={() => logoutAction()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warm-cream/10 hover:bg-warm-cream/15 border border-warm-cream/20 text-xs text-warm-cream transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-warm-cream/10 bg-[#1E1511] px-4 sm:px-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 sm:space-x-2 py-2.5">
          {[
            { id: "reservations", label: "Reservations", icon: Calendar, badge: reservations.filter(r => r.status === "pending").length },
            { id: "inquiries", label: "Guest Inquiries", icon: Mail, badge: inquiries.filter(i => i.status === "unread").length },
            { id: "menu", label: "Menu & Stock", icon: Layers },
            { id: "seasonal", label: "Seasonal Campaign", icon: Sparkles },
            { id: "ai", label: "AI Ops Assistant", icon: Bot },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "settings", label: "Business Settings", icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap rounded ${
                  isActive
                    ? "bg-muted-gold text-espresso font-semibold"
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* TAB 1: RESERVATIONS */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-muted-gold block">
                  Total Bookings
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {reservations.length}
                </span>
              </div>
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-yellow-400 block">
                  Pending Review
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {reservations.filter((r) => r.status === "pending").length}
                </span>
              </div>
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 block">
                  Confirmed
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {reservations.filter((r) => r.status === "confirmed").length}
                </span>
              </div>
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-sky-400 block">
                  Seated / Completed
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {reservations.filter((r) => r.status === "seated" || r.status === "completed").length}
                </span>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#211713] p-4 border border-warm-cream/10">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {(["all", "pending", "confirmed", "seated", "completed", "cancelled"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setReservationFilter(st)}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded transition-colors cursor-pointer whitespace-nowrap ${
                      reservationFilter === st
                        ? "bg-muted-gold text-espresso font-semibold"
                        : "bg-warm-cream/5 text-warm-cream/70 hover:text-warm-cream"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-warm-cream/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, ref..."
                  className="w-full bg-[#18110E] border border-warm-cream/20 pl-8 pr-3 py-1.5 text-xs text-warm-cream placeholder:text-warm-cream/30 focus:outline-none focus:border-muted-gold"
                />
              </div>
            </div>

            {/* Reservations Table */}
            <div className="bg-[#241914] border border-warm-cream/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1D1410] border-b border-warm-cream/10 text-muted-gold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ref</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Party & Area</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-cream/5 font-sans">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-warm-cream/40 font-light">
                        No reservations found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((res) => {
                      const confirmWhatsAppUrl = notificationService.generateOwnerConfirmationWhatsAppUrl(res);
                      return (
                        <tr key={res.id} className="hover:bg-warm-cream/5 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-muted-gold">
                            #{res.referenceNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-warm-cream">{res.guestName}</div>
                            <div className="text-[11px] text-warm-cream/50 flex items-center gap-1 mt-0.5">
                              <PhoneCall className="w-3 h-3 text-muted-gold" />
                              <span>{res.phone}</span>
                            </div>
                            {res.specialNotes && (
                              <div className="text-[10px] text-warm-cream/60 italic mt-1 max-w-xs">
                                &ldquo;{res.specialNotes}&rdquo;
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-warm-cream">{res.guestsCount} Guests</span>
                            <div className="text-[11px] text-muted-coffee uppercase tracking-wider mt-0.5">
                              {res.seatingArea}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-warm-cream">{res.reservationDate}</div>
                            <div className="text-[11px] text-warm-cream/60 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-muted-gold" />
                              <span>{res.timeSlot}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded ${
                                res.status === "confirmed"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : res.status === "pending"
                                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                                  : res.status === "seated"
                                  ? "bg-sky-950 text-sky-300 border border-sky-800"
                                  : res.status === "completed"
                                  ? "bg-stone-800 text-stone-300"
                                  : "bg-red-950 text-red-300 border border-red-800"
                              }`}
                            >
                              {res.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {res.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(res.id, "confirmed")}
                                className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[10px] uppercase tracking-wider rounded cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}

                            {res.status === "confirmed" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(res.id, "seated")}
                                className="px-2.5 py-1 bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-700 text-[10px] uppercase tracking-wider rounded cursor-pointer"
                              >
                                Seat Guest
                              </button>
                            )}

                            {res.status !== "completed" && res.status !== "cancelled" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(res.id, "completed")}
                                className="px-2.5 py-1 bg-warm-cream/10 hover:bg-warm-cream/20 text-warm-cream/80 text-[10px] uppercase tracking-wider rounded cursor-pointer"
                              >
                                Complete
                              </button>
                            )}

                            <a
                              href={confirmWhatsAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-900/40 hover:bg-green-800 text-green-200 border border-green-700 text-[10px] uppercase tracking-wider rounded"
                              title="Send WhatsApp confirmation to guest"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
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

        {/* TAB 2: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-warm-cream">Customer Inquiries Inbox</h3>
            <p className="text-xs text-warm-cream/60">
              Direct messages submitted through the website Contact Page.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {inquiries.map((inq) => (
                <div key={inq.id} className="bg-[#241914] p-5 border border-warm-cream/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-warm-cream text-sm">{inq.name}</span>
                    <span className="text-[10px] text-warm-cream/40">{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-warm-cream/70 font-light whitespace-pre-wrap bg-[#1B130F] p-3 border border-warm-cream/5">
                    {inq.message}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-gold">{inq.email} • {inq.phone}</span>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${inq.name}, thank you for contacting Movi Coffee Kaduwela!`)}`}
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

        {/* TAB 3: MENU & STOCK */}
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
                <div key={cat.id} className="bg-[#241914] border border-warm-cream/10 p-5">
                  <h4 className="font-serif text-lg text-muted-gold uppercase tracking-wider mb-4 border-b border-warm-cream/10 pb-2">
                    {cat.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cat.items.map((item) => {
                      const isAvailable = menuAvailability[item.id] !== false;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 bg-[#1B130F] border border-warm-cream/5"
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

        {/* TAB 4: SEASONAL CAMPAIGN */}
        {activeTab === "seasonal" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-serif text-2xl text-warm-cream">Seasonal Experience Controller</h3>
              <p className="text-xs text-warm-cream/60 mt-1">
                Configure the announcement bar and featured roast that appears at the top of the public website.
              </p>
            </div>

            {seasonal.map((camp) => (
              <div key={camp.id} className="bg-[#241914] border border-warm-cream/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-muted-gold font-semibold">
                    {camp.tag}
                  </span>
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
                      }}
                      className="accent-muted-gold w-4 h-4 cursor-pointer"
                    />
                    <span>Active on Public Site</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
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
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-xs text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={camp.description}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSeasonal((prev) =>
                        prev.map((s) => (s.id === camp.id ? { ...s, description: val } : s))
                      );
                    }}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-xs text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await updateSeasonalExperienceAction(camp.id, camp);
                    alert("Seasonal campaign updated!");
                  }}
                  className="px-4 py-2 bg-muted-gold text-espresso font-semibold text-xs uppercase tracking-wider cursor-pointer hover:bg-muted-gold/90"
                >
                  Save Campaign
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: AI OPS ASSISTANT */}
        {activeTab === "ai" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-serif text-2xl text-warm-cream">Movi Operations AI Assistant</h3>
              <p className="text-xs text-warm-cream/60 mt-1">
                Your AI executive assistant for inventory forecasting, customer sentiment, and operational tips.
              </p>
            </div>

            <div className="bg-[#241914] border border-warm-cream/10 flex flex-col h-[550px]">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {aiChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-4 text-xs sm:text-sm leading-relaxed rounded-xl ${
                        msg.role === "user"
                          ? "bg-muted-gold text-espresso font-medium"
                          : "bg-[#1A120E] text-warm-cream border border-warm-cream/10"
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
                  <div className="text-xs text-muted-gold italic p-3">Analyzing operations data...</div>
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
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask about weekend prep, pending reservations, promo ideas..."
                  className="flex-1 bg-[#150E0B] border border-warm-cream/20 px-3.5 py-2 text-xs text-warm-cream focus:outline-none focus:border-muted-gold"
                />
                <button
                  type="submit"
                  disabled={!aiQuery.trim() || isAiLoading}
                  className="px-4 py-2 bg-muted-gold text-espresso text-xs font-semibold uppercase tracking-wider disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 inline mr-1" />
                  Ask AI
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-warm-cream">Platform Privacy Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-muted-gold block">
                  Tracked Page Views
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {analyticsSummary.totalPageViews + 148}
                </span>
              </div>
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 block">
                  Completed Reservations
                </span>
                <span className="font-serif text-3xl text-warm-cream mt-1 block">
                  {reservations.length}
                </span>
              </div>
              <div className="bg-[#241914] p-5 border border-warm-cream/10">
                <span className="text-[10px] uppercase tracking-widest text-sky-400 block">
                  Top Trending Item
                </span>
                <span className="font-serif text-xl text-warm-cream mt-2 block">
                  {analyticsSummary.popularItems[0]?.name || "Iced Spanish Latte"}
                </span>
              </div>
            </div>

            <div className="bg-[#241914] border border-warm-cream/10 p-5">
              <h4 className="font-serif text-lg text-warm-cream mb-4">Recent Engagement Activity</h4>
              <div className="space-y-2 text-xs">
                {analyticsSummary.recentEvents.length === 0 ? (
                  <p className="text-warm-cream/40 italic">Activity stream will populate as guests interact with the menu and booking engine.</p>
                ) : (
                  analyticsSummary.recentEvents.map((evt) => (
                    <div key={evt.id} className="flex items-center justify-between p-2.5 bg-[#1B130F] border border-warm-cream/5">
                      <span className="text-muted-gold uppercase tracking-wider font-mono">{evt.type}</span>
                      <span className="text-warm-cream/70">{evt.path}</span>
                      <span className="text-[10px] text-warm-cream/40">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BUSINESS SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h3 className="font-serif text-2xl text-warm-cream">Business Core Settings</h3>
              <p className="text-xs text-warm-cream/60 mt-1">
                Update store contact details, opening hours, and reservation rules.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Business settings successfully saved across the platform!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-[#241914] border border-warm-cream/10 p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.shopName}
                    onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    WhatsApp (Digits with country code)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Customer Service Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Weekday Hours
                  </label>
                  <input
                    type="text"
                    value={settings.openingHoursWeekday}
                    onChange={(e) => setSettings({ ...settings, openingHoursWeekday: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-gold mb-1">
                    Weekend Hours
                  </label>
                  <input
                    type="text"
                    value={settings.openingHoursWeekend}
                    onChange={(e) => setSettings({ ...settings, openingHoursWeekend: e.target.value })}
                    className="w-full bg-[#1B130F] border border-warm-cream/20 px-3 py-2 text-warm-cream focus:outline-none focus:border-muted-gold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-muted-gold text-espresso font-semibold uppercase tracking-wider text-xs cursor-pointer hover:bg-muted-gold/90"
                >
                  Save Business Profile
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
