export interface MenuItem {
  id: string;
  category: MenuCategoryType;
  name: string;
  description: string;
  price: string;
  image: string;
  notes?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isPopular?: boolean;
  available: boolean;
  popular?: boolean;
  // Compatibility
  pricePlaceholder?: string;
  originPlaceholder?: string;
  featured?: boolean;
}

export interface MenuCategory {
  id: MenuCategoryType;
  name: string;
  subtitle: string;
  description: string;
  items: MenuItem[];
}

export interface SignatureDrink {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pricePlaceholder: string;
  image: string;
  notes: string;
}

export const menuCategoriesList = [
  { id: "coffee", label: "COFFEE" },
  { id: "signature-drinks", label: "SIGNATURE DRINKS" },
  { id: "cold-coffee", label: "COLD COFFEE" },
  { id: "tea", label: "TEA" },
  { id: "breakfast", label: "BREAKFAST" },
  { id: "savoury", label: "SAVOURY" },
  { id: "desserts", label: "DESSERTS" },
] as const;

export type MenuCategoryType = (typeof menuCategoriesList)[number]["id"];

// Alias for preview
export const previewCategories = [
  { id: "coffee", label: "COFFEE" },
  { id: "signature-drinks", label: "SIGNATURE DRINKS" },
  { id: "cold-coffee", label: "COLD COFFEE" },
  { id: "tea", label: "TEA" },
  { id: "food", label: "FOOD" },
  { id: "desserts", label: "DESSERTS" },
] as const;

export type PreviewCategoryType = (typeof previewCategories)[number]["id"];

export const signatureCoffees: SignatureDrink[] = [
  {
    id: "signature-latte",
    name: "SIGNATURE LATTE",
    tagline: "House Specialty",
    description:
      "A nuanced double shot balanced with micro-textured velvety steamed milk, highlighting notes of honey and raw cane sweetness.",
    pricePlaceholder: "Rs. [PRICE]",
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop",
    notes: "Silky & Balanced",
  },
  {
    id: "spanish-latte",
    name: "SPANISH LATTE",
    tagline: "Caramel Sweetness",
    description:
      "Rich espresso layered over delicately sweetened condensed milk and cold silky dairy, finished over hand-cracked ice or served warm.",
    pricePlaceholder: "Rs. [PRICE]",
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
    notes: "Creamy & Indulgent",
  },
  {
    id: "cold-brew",
    name: "COLD BREW",
    tagline: "Twenty-Hour Steep",
    description:
      "Slow-steeped in cold filtered water for twenty hours, yielding a clean, ultra-low acidity elixir with notes of chocolate and stone fruit.",
    pricePlaceholder: "Rs. [PRICE]",
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000&auto=format&fit=crop",
    notes: "Crisp & Clean",
  },
  {
    id: "cappuccino",
    name: "CAPPUCCINO",
    tagline: "Classic Ratio",
    description:
      "A textbook third-wave espresso extraction enveloped in dense aerated milk foam with an organic single-origin cocoa dusting.",
    pricePlaceholder: "Rs. [PRICE]",
    image:
      "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1000&auto=format&fit=crop",
    notes: "Aerated & Deep",
  },
];

export const menuCategories: MenuCategory[] = [
  {
    id: "coffee",
    name: "COFFEE",
    subtitle: "Precision Extractions & Filters",
    description:
      "Calibrated espresso and hand-poured filters focusing on clarity, sweetness, and terroir.",
    items: [
      {
        id: "double-espresso",
        category: "coffee",
        name: "Double Espresso",
        description:
          "Balanced extraction highlighting caramel sweetness, subtle stone fruit, and golden crema.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
        notes: "Concentrated clarity",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
        originPlaceholder: "[Coffee Origin Placeholder]",
      },
      {
        id: "cortado",
        category: "coffee",
        name: "Cortado",
        description:
          "Equal parts espresso and lightly textured silky steamed milk served in an artisanal glass.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop",
        notes: "Silky harmony",
        isVegetarian: true,
        available: true,
        originPlaceholder: "[Coffee Origin Placeholder]",
      },
      {
        id: "flat-white",
        category: "coffee",
        name: "Flat White",
        description:
          "Double ristretto with micro-foamed milk for a glossy texture and sweet coffee presence.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=1000&auto=format&fit=crop",
        notes: "Micro-textured milk",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
        originPlaceholder: "[Coffee Origin Placeholder]",
      },
      {
        id: "pour-over",
        category: "coffee",
        name: "Single-Cup Pour Over (V60)",
        description:
          "Hand-poured slow extraction uncovering intricate florals, delicate acidity, and clean finish.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1000&auto=format&fit=crop",
        notes: "Hand-brewed filter",
        isVegetarian: true,
        available: true,
        originPlaceholder: "[Coffee Origin Placeholder]",
      },
    ],
  },
  {
    id: "signature-drinks",
    name: "SIGNATURE DRINKS",
    subtitle: "Crafted Creations",
    description:
      "Inventive coffee expressions balancing botanical, spiced, and sweet flavour profiles.",
    items: [
      {
        id: "sig-latte-item",
        category: "signature-drinks",
        name: "Signature Latte",
        description:
          "Velvety steamed dairy infused with delicate honey blossom notes over a double ristretto.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1000&auto=format&fit=crop",
        notes: "House signature",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
      },
      {
        id: "spanish-latte-item",
        category: "signature-drinks",
        name: "Spanish Latte",
        description:
          "Rich espresso layered with sweetened condensed milk and silky chilled whole milk.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
        notes: "Sweet & rich",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
      },
      {
        id: "espresso-tonic",
        category: "signature-drinks",
        name: "Botanical Espresso Tonic",
        description:
          "Chilled double espresso floated over artisan tonic water, citrus peel, and botanical aromatics.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000&auto=format&fit=crop",
        notes: "Bright & effervescent",
        isVegetarian: true,
        available: true,
      },
    ],
  },
  {
    id: "cold-coffee",
    name: "COLD COFFEE",
    subtitle: "Chilled & Steeped",
    description:
      "Refreshing cold extracts steeped long and slow for hot Kaduwela afternoons.",
    items: [
      {
        id: "cold-brew-item",
        category: "cold-coffee",
        name: "Classic Cold Brew",
        description:
          "Twenty-hour slow steeped specialty blend poured over clear crystalline ice.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000&auto=format&fit=crop",
        notes: "Clean & rounded",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
      },
      {
        id: "iced-latte-item",
        category: "cold-coffee",
        name: "Iced Shaken Latte",
        description:
          "Double espresso shaken cold with creamy whole milk and natural vanilla dust.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop",
        notes: "Cooling & silky",
        isVegetarian: true,
        available: true,
      },
      {
        id: "nitro-cold-brew",
        category: "cold-coffee",
        name: "Chilled Nitro Brew",
        description:
          "Infused with nitrogen for a cascading velvet head and creamy stout-like body.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=1000&auto=format&fit=crop",
        notes: "Velvety cascade",
        isVegetarian: true,
        available: true,
      },
    ],
  },
  {
    id: "tea",
    name: "TEA",
    subtitle: "Artisanal Ceylon Infusions",
    description:
      "Handpicked single-estate Ceylon loose leaves and aromatic herbal botanicals.",
    items: [
      {
        id: "ceylon-silver-tips",
        category: "tea",
        name: "Single-Estate Silver Tips",
        description:
          "Rare sun-dried white tea buds steeped gently for delicate pine and melon notes.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop",
        notes: "Delicate white tea",
        isVegetarian: true,
        available: true,
      },
      {
        id: "high-grown-black",
        category: "tea",
        name: "High-Grown Nuwara Eliya Black",
        description:
          "Bright amber cup with brisk floral character and clean citrus astringency.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop",
        notes: "Crisp & uplifting",
        isVegetarian: true,
        available: true,
      },
      {
        id: "chamomile-lemongrass",
        category: "tea",
        name: "Lemongrass & Wild Chamomile",
        description:
          "Caffeine-free soothing herbal infusion with organic Sri Lankan lemongrass.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000&auto=format&fit=crop",
        notes: "Calming herbal",
        isVegetarian: true,
        available: true,
      },
    ],
  },
  {
    id: "breakfast",
    name: "BREAKFAST",
    subtitle: "Morning Provisions & Bakes",
    description:
      "Nourishing morning plates prepared fresh for unhurried starts in Kaduwela.",
    items: [
      {
        id: "sourdough-toast",
        category: "breakfast",
        name: "Whipped Ricotta & Honey Sourdough",
        description:
          "House-toasted artisanal sourdough, light whipped ricotta, local floral honey, and sea salt.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop",
        notes: "Warm & savory-sweet",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
      },
      {
        id: "granola-bowl",
        category: "breakfast",
        name: "Roasted Spiced Granola & Curd",
        description:
          "House-toasted oats, nuts, coconut blossom honey, and creamy buffalo curd with seasonal fruits.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000&auto=format&fit=crop",
        notes: "Local curd & seasonal fruit",
        isVegetarian: true,
        available: true,
      },
    ],
  },
  {
    id: "savoury",
    name: "SAVOURY",
    subtitle: "Warm Plates & Tartines",
    description:
      "Honest, thoughtfully prepared savory plates made for light lunches and afternoon pauses.",
    items: [
      {
        id: "avocado-tartine",
        category: "savoury",
        name: "Crushed Avocado & Herb Tartine",
        description:
          "Ripe avocado, lime juice, toasted seeds, micro-greens, and chili flakes on rustic sourdough toast.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop",
        notes: "Fresh & vibrant",
        isVegetarian: true,
        isSpicy: true,
        isPopular: true,
        available: true,
        popular: true,
      },
      {
        id: "croissant-sandwich",
        category: "savoury",
        name: "Warm Gruyère & Herb Omelette Croissant",
        description:
          "Flaky butter croissant filled with soft pasture-raised eggs, aged gruyère, and chives.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
        notes: "Savory breakfast",
        isVegetarian: true,
        available: true,
      },
    ],
  },
  {
    id: "desserts",
    name: "DESSERTS",
    subtitle: "Daily Bakes & Pastries",
    description:
      "Laminated pastries and delicate sweet bakes crafted fresh each morning.",
    items: [
      {
        id: "butter-croissant",
        category: "desserts",
        name: "Artisanal Butter Croissant",
        description:
          "Slow-fermented laminated pastry baked to crisp, honey-gold honeycomb layers.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
        notes: "Baked fresh daily",
        isVegetarian: true,
        isPopular: true,
        available: true,
        popular: true,
      },
      {
        id: "almond-frangipane",
        category: "desserts",
        name: "Twice-Baked Almond Frangipane",
        description:
          "Golden croissant filled with almond cream, toasted flaked almonds, and vanilla dust.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
        notes: "Crisp & nutty",
        isVegetarian: true,
        available: true,
      },
      {
        id: "cardamom-bun",
        category: "desserts",
        name: "Braided Cardamom & Brown Sugar Bun",
        description:
          "Swedish-style cardamom brioche dough twisted with caramelized sugar and Ceylon spice.",
        price: "Rs. [PRICE]",
        pricePlaceholder: "Rs. [PRICE]",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
        notes: "Aromatic & warm",
        isVegetarian: true,
        available: true,
      },
    ],
  },
];
