export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  category: "coffee" | "food" | "space" | "people";
  src: string;
  alt: string;
  aspectRatio: "portrait" | "landscape" | "square";
  featuredInSpace?: boolean;
  spaceArea?: "entrance" | "bar" | "seating" | "details" | "courtyard";
}

export const galleryItems: GalleryImage[] = [
  {
    id: "gal-coffee-1",
    title: "Hand-Poured Filter",
    caption: "Meticulous pour-over preparation under morning natural light.",
    category: "coffee",
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
    alt: "Hand drip coffee preparation on wooden counter",
    aspectRatio: "portrait",
    spaceArea: "bar",
  },
  {
    id: "gal-space-1",
    title: "Sunlit Morning Corner",
    caption: "Sunlit seating designed for conversation and peaceful pauses.",
    category: "space",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm minimalist cafe interior with wooden furniture and warm light",
    aspectRatio: "landscape",
    featuredInSpace: true,
    spaceArea: "seating",
  },
  {
    id: "gal-coffee-2",
    title: "Crema & Extraction",
    caption: "Golden espresso stream extracted at calibrated pressure.",
    category: "coffee",
    src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    alt: "Espresso cup filling with rich golden crema",
    aspectRatio: "square",
    spaceArea: "bar",
  },
  {
    id: "gal-food-1",
    title: "Morning Viennoiserie",
    caption: "Flaky golden croissants baked fresh daily at dawn.",
    category: "food",
    src: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop",
    alt: "Crisp flaky croissant on minimal ceramic plate",
    aspectRatio: "portrait",
  },
  {
    id: "gal-people-1",
    title: "Shared Conversations",
    caption: "Friends and coffee lovers gathering around communal timber tables.",
    category: "people",
    src: "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop",
    alt: "People enjoying conversations around coffee in comfortable natural light",
    aspectRatio: "landscape",
  },
  {
    id: "gal-space-2",
    title: "The Entrance Portico",
    caption: "Warm natural timber threshold welcoming visitors into the café.",
    category: "space",
    src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm cafe entrance threshold with ambient lighting",
    aspectRatio: "portrait",
    featuredInSpace: true,
    spaceArea: "entrance",
  },
  {
    id: "gal-space-3",
    title: "The Main Coffee Bar",
    caption: "Stone and oak brew counter where every cup is calibrated.",
    category: "space",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    alt: "Specialty coffee bar with espresso machine and brew equipment",
    aspectRatio: "landscape",
    featuredInSpace: true,
    spaceArea: "bar",
  },
  {
    id: "gal-space-4",
    title: "Verdant Courtyard",
    caption: "Sheltered outdoor terrace surrounded by tropical greenery in Kaduwela.",
    category: "space",
    src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    alt: "Calm outdoor terrace seating with lush green plants",
    aspectRatio: "landscape",
    featuredInSpace: true,
    spaceArea: "courtyard",
  },
  {
    id: "gal-food-2",
    title: "Artisanal Sourdough Tartine",
    caption: "Whipped local ricotta, wild floral honey, and toasted seeds.",
    category: "food",
    src: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop",
    alt: "Artisan sourdough breakfast plate on wooden table",
    aspectRatio: "square",
  },
];

export const spaceAreas = [
  {
    id: "entrance",
    name: "The Entrance",
    description: "A calm, leafy transition from the Kaduwela street into quiet sanctuary.",
    image:
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm cafe entrance threshold",
  },
  {
    id: "coffee-bar",
    name: "The Coffee Bar",
    description: "The tactile heart of our craft, where extraction and conversation meet.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    alt: "Espresso machine and brew station on stone counter",
  },
  {
    id: "seating",
    name: "Main Seating",
    description: "Generous timber tables and comfortable banquettes set in soft filtered daylight.",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm timber tables and chairs in bright cafe",
  },
  {
    id: "interior-details",
    name: "Interior Details",
    description: "Hand-thrown ceramics, textured plaster, and warm acoustic warmth.",
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop",
    alt: "Handcrafted ceramic cup with latte art",
  },
  {
    id: "outdoor-courtyard",
    name: "Courtyard Terrace",
    description: "An open-air garden retreat shaded by native tropical canopy.",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
    alt: "Shaded outdoor terrace with coffee table",
  },
];

export const instagramFeed = [
  {
    id: "insta-1",
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
    caption: "Morning calibration at the brew bar. Fresh origins on pour today.",
    tag: "@shopname",
  },
  {
    id: "insta-2",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    caption: "Warm laminated viennoiserie fresh out of our morning oven.",
    tag: "@shopname",
  },
  {
    id: "insta-3",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop",
    caption: "Slow light streaming through our Kaduwela courtyard.",
    tag: "@shopname",
  },
  {
    id: "insta-4",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    caption: "Velvety extraction with golden crema and caramelized notes.",
    tag: "@shopname",
  },
  {
    id: "insta-5",
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
    caption: "Stoneware cups crafted specifically for our flat whites.",
    tag: "@shopname",
  },
  {
    id: "insta-6",
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop",
    caption: "An afternoon pause away from the rush. Table is ready.",
    tag: "@shopname",
  },
];
