export interface StoryChapter {
  id: string;
  tag: string;
  title: string;
  copy: string[];
  image: string;
  alt: string;
  caption: string;
}

export interface StoryValue {
  name: string;
  eyebrow: string;
  description: string;
}

export const storyData = {
  heroHeading: "OUR STORY",
  heroSubtitle: "Built around good coffee and good company.",
  chapters: [
    {
      id: "beginning",
      tag: "THE BEGINNING",
      title: "An unhurried vision for Kaduwela.",
      copy: [
        "[REAL STORY: When we set out to build our coffee shop, we noticed Kaduwela was moving at an increasingly rapid pace. We wanted to build a sanctuary where guests could pause, slow down, and appreciate intentional craft.]",
        "[REAL STORY: Rather than rushing morning takeaway queues, we designed every touchpoint around presence, tactile natural materials, and authentic human warmth.]",
      ],
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
      alt: "Quiet morning light in our Kaduwela cafe interior",
      caption: "Natural timber, soft illumination, and generous space to pause.",
    },
    {
      id: "coffee",
      tag: "THE COFFEE",
      title: "Calibration, terroir, and respect for every bean.",
      copy: [
        "[REAL COFFEE STORY: Every coffee we serve undergoes rigorous morning calibration. We balance water mineral chemistry, water temperature profiles, and micron-level grind settings to extract sweetness, floral notes, and balanced acidity.]",
        "[REAL COFFEE STORY: From our classic double espresso to hand-poured single-origin V60 filters and 20-hour cold brews, nothing is left to chance.]",
      ],
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
      alt: "Meticulous pour-over preparation at brew bar",
      caption: "Hand-poured slow extraction honoring the coffee farmers' work.",
    },
    {
      id: "space",
      tag: "THE SPACE",
      title: "An architectural haven grounded in calm.",
      copy: [
        "[REAL SPACE STORY: Our physical environment was carefully considered to foster ease and reflection. Natural clay plasters, solid timber surfaces, filtered acoustic dampening, and an airy courtyard terrace come together to create a true sanctuary.]",
        "[REAL SPACE STORY: Whether you need an inspiring corner to sketch and read, or a welcoming table to share with friends, the space naturally adapts to your pace.]",
      ],
      image:
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1200&auto=format&fit=crop",
      alt: "Verdant courtyard garden terrace in Kaduwela",
      caption: "A sheltered courtyard framed by native tropical greenery.",
    },
    {
      id: "people",
      tag: "THE PEOPLE",
      title: "Hospitality rooted in genuine care.",
      copy: [
        "[REAL TEAM STORY: Our baristas and kitchen crew are craftsmen who care deeply about the people walking through our doors. Every cup is served with sincere attention and gratitude for your presence.]",
        "[REAL TEAM STORY: We believe a great coffee shop is ultimately measured not just by its extraction yield, but by how guests feel when they leave our doors.]",
      ],
      image:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1200&auto=format&fit=crop",
      alt: "Warm hospitality and team conversation in cafe",
      caption: "Real hospitality centered around human warmth.",
    },
  ] as StoryChapter[],
  values: [
    {
      name: "Quality",
      eyebrow: "PILLAR 01",
      description:
        "Calibrated water mineral balances, premium single origins, and unhurried preparation in every cup.",
    },
    {
      name: "Hospitality",
      eyebrow: "PILLAR 02",
      description:
        "A warm, welcoming demeanor that treats every guest with attentiveness, patience, and dignity.",
    },
    {
      name: "Community",
      eyebrow: "PILLAR 03",
      description:
        "An enduring neighborhood living room for Kaduwela where meaningful conversations flourish.",
    },
    {
      name: "Craft",
      eyebrow: "PILLAR 04",
      description:
        "Dedication to technical precision, tactile stoneware ceramics, and honest daily scratch-baking.",
    },
  ] as StoryValue[],
};
