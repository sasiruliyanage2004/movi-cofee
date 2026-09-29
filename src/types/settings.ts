export interface BusinessSettings {
  shopName: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHoursWeekday: string;
  openingHoursWeekend: string;
  googleMapsUrl: string;
  isAcceptingReservations: boolean;
  maxPartySize: number;
}

export type SeasonalTheme =
  | "christmas"
  | "new-year"
  | "valentines"
  | "avurudu" // Sinhala & Tamil New Year
  | "mothers-day"
  | "fathers-day"
  | "halloween"
  | "graduation"
  | "summer-iced"
  | "harvest";

export type SeasonalVisualEffect = "none" | "snowfall" | "warm-lights" | "golden-shimmer" | "festive-lanterns";

export interface SeasonalExperience {
  id: string;
  theme: SeasonalTheme;
  title: string;
  tag: string;
  highlightText: string;
  description: string;
  heroHeadline?: string;
  heroDescription?: string;
  heroImage?: string;
  visualEffect?: SeasonalVisualEffect;
  featuredMenuItemIds?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  isActive: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
