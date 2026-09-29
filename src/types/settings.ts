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

export interface SeasonalExperience {
  id: string;
  title: string;
  tag: string;
  highlightText: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  isActive: boolean;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
