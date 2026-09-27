export interface NavLink {
  label: string;
  href: string;
  isAction?: boolean;
}

export interface SiteConfig {
  businessName: string;
  tagline: string;
  supportingTagline: string;
  description: string;
  seoDescription: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  openingHoursDetails: { days: string; hours: string }[];
  instagram: string;
  facebook: string;
  mapUrl: string;
  location: {
    city: string;
    country: string;
    region: string;
    coordinatesPlaceholder: string;
    addressPlaceholder: string;
    googleMapsUrlPlaceholder: string;
  };
  positioning: string;
  amenities: {
    parking: string;
    wifi: string;
    seating: string;
    reservations: string;
  };
  services: string[];
  navigation: {
    main: NavLink[];
    mobile: NavLink[];
    footer: {
      explore: NavLink[];
      information: NavLink[];
    };
  };
  // Backwards compatibility aliases
  name: string;
  heroEyebrow: string;
  heroHeadline: {
    line1: string;
    line2: string;
  };
  heroDescription: string;
  contact: {
    phonePlaceholder: string;
    whatsappPlaceholder: string;
    emailPlaceholder: string;
    hoursPlaceholder: string[];
    openingHoursSummary: string;
  };
  socialsPlaceholder: {
    instagram: string;
    facebook: string;
  };
}

export const siteConfig: SiteConfig = {
  businessName: "[SHOP NAME]",
  name: "[SHOP NAME]",
  tagline: "GOOD COFFEE. BETTER MOMENTS.",
  supportingTagline: "Crafted coffee, thoughtful food and a place to slow down.",
  description:
    "A modern, premium coffee destination in Kaduwela where people can enjoy carefully prepared coffee, quality food, meaningful conversations and a relaxed atmosphere.",
  seoDescription:
    "Discover [SHOP NAME], a modern café in Kaduwela serving carefully prepared coffee, fresh food and a welcoming space for good conversations and slow moments.",
  address: "[ADDRESS], Kaduwela, Sri Lanka",
  phone: "[PHONE]",
  whatsapp: "[WHATSAPP]",
  email: "[EMAIL]",
  openingHours: "[OPENING HOURS]",
  openingHoursDetails: [
    { days: "Monday – Friday", hours: "[OPENING HOURS]" },
    { days: "Saturday – Sunday", hours: "[OPENING HOURS]" },
  ],
  instagram: "[INSTAGRAM]",
  facebook: "[facebook.com/shopname Placeholder]",
  mapUrl: "https://maps.google.com/?q=Kaduwela+Sri+Lanka",
  positioning:
    "A modern, premium coffee destination in Kaduwela where people can enjoy carefully prepared coffee, quality food, meaningful conversations and a relaxed atmosphere.",
  location: {
    city: "Kaduwela",
    country: "Sri Lanka",
    region: "Western Province",
    coordinatesPlaceholder: "6.9333° N, 79.9833° E",
    addressPlaceholder: "[ADDRESS], Kaduwela, Sri Lanka",
    googleMapsUrlPlaceholder: "https://maps.google.com/?q=Kaduwela+Sri+Lanka",
  },
  amenities: {
    parking: "Dedicated guest parking available on premises",
    wifi: "High-speed complimentary Wi-Fi for work & quiet study",
    seating: "Indoor air-conditioned salon, communal tables & open courtyard",
    reservations: "Walk-ins welcomed; private gathering reservations on request",
  },
  services: ["DINE IN", "TAKEAWAY", "[OTHER VERIFIED SERVICE]"],
  navigation: {
    main: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "Our Story", href: "/story" },
      { label: "Gallery", href: "/gallery" },
      { label: "Visit Us", href: "/visit" },
    ],
    mobile: [
      { label: "Home", href: "/" },
      { label: "Menu", href: "/menu" },
      { label: "Our Story", href: "/story" },
      { label: "Gallery", href: "/gallery" },
      { label: "Visit Us", href: "/visit" },
      { label: "Contact", href: "/contact" },
    ],
    footer: {
      explore: [
        { label: "Menu", href: "/menu" },
        { label: "Our Story", href: "/story" },
        { label: "Gallery", href: "/gallery" },
        { label: "Visit Us", href: "/visit" },
      ],
      information: [
        { label: "Contact", href: "/contact" },
        { label: "Get Directions", href: "/visit#directions" },
        { label: "Private Gatherings", href: "/contact#gatherings" },
      ],
    },
  },
  // Compatibility helpers
  heroEyebrow: "SPECIALTY COFFEE · KADUWELA",
  heroHeadline: {
    line1: "GOOD COFFEE.",
    line2: "BETTER MOMENTS.",
  },
  heroDescription:
    "Carefully prepared coffee, freshly made food, and a space designed for conversations, creativity and slow afternoons.",
  contact: {
    phonePlaceholder: "[PHONE]",
    whatsappPlaceholder: "[WHATSAPP]",
    emailPlaceholder: "[EMAIL]",
    hoursPlaceholder: [
      "Monday – Friday: [OPENING HOURS]",
      "Saturday – Sunday: [OPENING HOURS]",
    ],
    openingHoursSummary: "[OPENING HOURS]",
  },
  socialsPlaceholder: {
    instagram: "[INSTAGRAM]",
    facebook: "[facebook.com/shopname Placeholder]",
  },
};
