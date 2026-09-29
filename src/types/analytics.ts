export type AnalyticsEventType =
  | "page_view"
  | "menu_item_view"
  | "booking_started"
  | "booking_completed"
  | "coffee_matcher_completed"
  | "whatsapp_click"
  | "directions_click";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  path: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  totalBookings: number;
  popularItems: { name: string; views: number }[];
  recentEvents: AnalyticsEvent[];
}
