import { SeasonalExperience } from "@/types/settings";

/**
 * Centralized Master Catalog of Seasonal Experiences
 * Automatically activates based on start/end date and enabled state.
 * Returns to the core Movi Coffee brand experience when no campaign is scheduled.
 */
export const seasonalExperiencesCatalog: SeasonalExperience[] = [
  {
    id: "season-christmas",
    theme: "christmas",
    title: "Artisanal Holiday Blend & Spiced Pastries",
    tag: "CHRISTMAS AT MOVI",
    highlightText: "Single-origin roast with notes of candied orange, clove & dark chocolate",
    description:
      "Join us in Kaduwela this holiday season under warm amber lights. Warm your hands with our Spiced Cinnamon Eggnog Latte and holiday fruit tarts.",
    heroHeadline: "Warm Moments & Holiday Coffee",
    heroDescription:
      "Gather with loved ones in our festive courtyard. Handcrafted seasonal roasts, freshly baked cinnamon rolls, and holiday hospitality.",
    heroImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop",
    visualEffect: "snowfall",
    featuredMenuItemIds: ["caramel-macchiato", "cinnamon-roll", "pour-over"],
    ctaLabel: "EXPLORE HOLIDAY MENU",
    ctaHref: "/menu",
    isActive: true,
    startDate: "2026-12-01",
    endDate: "2026-12-31",
  },
  {
    id: "season-newyear",
    theme: "new-year",
    title: "Fresh Roasts for a Mindful New Year",
    tag: "NEW YEAR GREETINGS",
    highlightText: "Clean, slow pour-overs and zero-sugar cold extractions",
    description: "Start your new year intentionally. Savor quiet morning brew sessions in our study nooks.",
    heroHeadline: "Begin Your Year with Pure Craft",
    visualEffect: "golden-shimmer",
    ctaLabel: "VIEW COFFEE SELECTION",
    ctaHref: "/menu",
    isActive: false,
    startDate: "2027-01-01",
    endDate: "2027-01-10",
  },
  {
    id: "season-valentines",
    theme: "valentines",
    title: "Velvet Espresso & Dark Ganache for Two",
    tag: "VALENTINE'S SPECIAL",
    highlightText: "Artisanal dark chocolate mocha & raspberry cold froth",
    description: "Share a slow, intimate evening under the courtyard fairy lights with our signature dessert pairings.",
    heroHeadline: "Moments of Warmth & Connection",
    visualEffect: "warm-lights",
    ctaLabel: "RESERVE A TABLE FOR 2",
    ctaHref: "/book",
    isActive: false,
    startDate: "2027-02-07",
    endDate: "2027-02-15",
  },
  {
    id: "season-avurudu",
    theme: "avurudu",
    title: "Sinhala & Tamil New Year Harvest Special",
    tag: "SUBHA ALUTH AVURUDDAK VEWA",
    highlightText: "Ceylon spiced highland brew with kitul jaggery and coconut milk",
    description: "Honoring Sri Lankan agricultural heritage with handpicked central highland roasts and traditional sweet treats.",
    heroHeadline: "Celebrating Tradition & Highland Harvest",
    visualEffect: "festive-lanterns",
    ctaLabel: "DISCOVER CEYLON ROAST",
    ctaHref: "/menu",
    isActive: false,
    startDate: "2027-04-05",
    endDate: "2027-04-20",
  },
  {
    id: "season-mothersday",
    theme: "mothers-day",
    title: "Mother's Day Garden High Tea & Espresso",
    tag: "HONORING MOTHERS",
    highlightText: "Complimentary handcrafted macaron with every specialty pour-over",
    description: "Treat Mum to a tranquil afternoon in our breezy garden terrace in Kaduwela.",
    heroHeadline: "A Gentle Celebration in the Garden",
    visualEffect: "none",
    ctaLabel: "RESERVE FOR FAMILY",
    ctaHref: "/book",
    isActive: false,
    startDate: "2027-05-05",
    endDate: "2027-05-15",
  },
  {
    id: "season-summer",
    theme: "summer-iced",
    title: "Tropical Cold Brew & Tonic Espresso Festival",
    tag: "SUMMER ICED SERIES",
    highlightText: "24-Hour steeped single-origins, yuzu espresso tonics, and chilled cascara fizz",
    description: "Beat the afternoon heat with crisp, cold extractions crafted over crystal clear ice.",
    heroHeadline: "Crisp Cold Brews for Hot Days",
    visualEffect: "none",
    ctaLabel: "EXPLORE ICED MENU",
    ctaHref: "/menu",
    isActive: false,
    startDate: "2027-06-01",
    endDate: "2027-08-31",
  },
  {
    id: "season-harvest",
    theme: "harvest",
    title: "Ceylon Cinnamon & Hazelnut Roast",
    tag: "HARVEST SPECIAL",
    highlightText: "Limited single-origin highland release with roasted hazelnut and cinnamon bark",
    description: "Carefully roasted artisan highland beans celebrating Sri Lankan spices and fertile soils.",
    heroHeadline: "Highland Spice & Single-Origin Craft",
    visualEffect: "none",
    ctaLabel: "DISCOVER THE ROAST",
    ctaHref: "/menu",
    isActive: true,
    startDate: "2026-09-01",
    endDate: "2026-11-30",
  },
];

/**
 * Resolves the currently active seasonal experience based on date and enabled status.
 * Automatically falls back to null (core brand experience) when no campaign is scheduled.
 */
export function resolveActiveSeasonalExperience(
  customExperiences?: SeasonalExperience[],
  currentDateStr?: string
): SeasonalExperience | null {
  const experiences = customExperiences && customExperiences.length > 0 ? customExperiences : seasonalExperiencesCatalog;
  const now = currentDateStr || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo" }).format(new Date());

  const active = experiences.find(
    (exp) => exp.isActive && exp.startDate <= now && exp.endDate >= now
  );

  return active || null;
}
