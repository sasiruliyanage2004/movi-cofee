<div align="center">

# ☕ [SHOP NAME] — Kaduwela, Sri Lanka
### *“GOOD COFFEE. BETTER MOMENTS.”*

A modern, bespoke specialty coffee destination in Kaduwela, Sri Lanka. Crafted coffee, thoughtful food, and an unhurried sanctuary designed for meaningful conversations and slow afternoons.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

[Quick Start](#-quick-start) • [Site Architecture](#-site-architecture) • [Design System](#-design-system) • [Data Configuration](#-data--cms-configuration) • [SEO & A11y](#-seo--accessibility)

</div>

---

## 📖 Overview

This project is a high-end hospitality web experience developed for a specialty coffee shop located in **Kaduwela, Western Province, Sri Lanka**. 

Rather than relying on repetitive SaaS card layouts or generic café templates, the website embodies an **editorial hospitality design** created by senior UI/UX designers and frontend engineers:
- **Atmospheric Typography**: Pairing the editorial elegance of *Cormorant Garamond* with the contemporary geometric legibility of *Manrope*.
- **Restrained Color Architecture**: Grounded in *Warm Cream* (`#F5F0E8`), rich *Espresso* (`#1B1410`), and brushed *Muted Gold* (`#B79A67`).
- **Natural, Tactile Animations**: Controlled Framer Motion micro-interactions, subtle viewport image reveals, and full support for `prefers-reduced-motion`.
- **Pure Data Separation**: All business data, menus, galleries, stories, and testimonials are isolated in clean TypeScript schemas, ready for any Headless CMS or relational database.

---

## 🏛️ Site Architecture & Routes

The application is built on the Next.js App Router with Server Components by default:

```
src/app/
├── layout.tsx         # Root layout with SEO JSON-LD, Fonts, Navbar, Footer & Mobile Actions
├── globals.css        # Tailwind v4 theme tokens, hairline dividers, typography rules
├── page.tsx           # Complete 14-section premium homepage
├── menu/page.tsx      # Comprehensive menu explorer with 7 categories and dietary filters
├── story/page.tsx     # Brand philosophy narrative with 4 chapters & core values
├── gallery/page.tsx   # Curated visual journal with touch-swipe fullscreen lightbox
├── visit/page.tsx     # Destination details, verified amenities, hours, and direction routes
├── contact/page.tsx   # Accessible inquiry form with client validation & direct channels
├── robots.ts          # Automated /robots.txt generation
└── sitemap.ts         # Dynamic XML sitemap generator
```

### 🎯 14 Homepage Sections Flow

1. **Hero**: Full-viewport cinematic canvas with slow scale parallax (`1.05 → 1.00`), word-by-word headline reveal, and service indicators.
2. **Quick Information**: 4-column divided editorial strip (`SPECIALTY COFFEE`, `FRESH FOOD`, `KADUWELA`, `OPEN DAILY`).
3. **Signature Coffee**: 4 featured drinks with editorial photography, preparation notes, and `Rs. [PRICE]` placeholders.
4. **Our Story**: Asymmetric composition pairing large architectural photography with brand intention narrative.
5. **Coffee Craft**: 4-phase technical timeline (`01 SELECT`, `02 PREPARE`, `03 BREW`, `04 SERVE`).
6. **Menu Preview**: 6 category tabs (`COFFEE`, `SIGNATURE DRINKS`, `COLD COFFEE`, `TEA`, `FOOD`, `DESSERTS`) with instant tab switching.
7. **The Space**: Architectural breakdown of 5 spatial zones (Entrance, Coffee Bar, Main Seating, Details, Courtyard Terrace).
8. **Why Visit**: 4 brand value pillars with hairline dividers and oversized numeral indexes.
9. **Customer Reviews**: Honest review policy with guest reflection carousel and direct review submission CTA.
10. **Gallery Preview**: Masonry layout with category filters and interactive modal lightbox.
11. **Instagram**: 6 curated static feed photography panels with hover micro-interactions.
12. **Location & Contact**: Exact address, hours breakdown, phone, WhatsApp, and stylized map navigation viewport.
13. **Final CTA**: High-contrast, full-width cinematic call to action (*"Your next coffee is waiting. Come by. Stay awhile."*).
14. **Global Footer**: Brand quote banner, navigation columns, operational schedule, and copyright metadata.

---

## 🎨 Design System & Design Tokens

### Color Palette

| Token | Hex | Role | Usage |
| :--- | :---: | :--- | :--- |
| **Warm Cream** | `#F5F0E8` | Primary Canvas | Main background, clean whitespace, light cards |
| **Espresso** | `#1B1410` | Primary Contrast | Headlines, dark sections, navigation, deep backgrounds |
| **Deep Coffee** | `#2B1B14` | Secondary Dark | Button hover states, layered depth, rich contrast |
| **Soft Beige** | `#E8DED0` | Neutral Fill | Card backgrounds, subtle dividers, accent panels |
| **Muted Coffee** | `#74533D` | Supporting Accent | Subtitles, eyebrow labels, borders, subtle text |
| **Muted Gold** | `#B79A67` | Metallic Highlight | Badges, active indicators, hairline borders, focus rings |

### Typography Hierarchy

```css
/* Display & Headlines */
font-serif: Cormorant Garamond, Georgia, serif;
letter-spacing: -0.015em;

/* Body, Interface & Navigation */
font-sans: Manrope, system-ui, sans-serif;
letter-spacing: 0.02em - 0.28em (uppercase tracking);
```

---

## 📂 Data & CMS Configuration

Business data is strictly separated into `src/data/` for easy updates or future CMS integration:

| File | Content & Purpose |
| :--- | :--- |
| [`site.ts`](file:///src/data/site.ts) | Brand name (`[SHOP NAME]`), taglines, phone, WhatsApp, email, address, opening hours, amenities, and navigation links. |
| [`menu.ts`](file:///src/data/menu.ts) | 7 menu categories (`coffee`, `signature-drinks`, `cold-coffee`, `tea`, `breakfast`, `savoury`, `desserts`), items, dietary tags (`isVegetarian`, `isSpicy`, `isPopular`). |
| [`gallery.ts`](file:///src/data/gallery.ts) | High-aesthetic image items categorized by `coffee`, `food`, `space`, and `people`, plus Instagram feed items. |
| [`story.ts`](file:///src/data/story.ts) | Narrative chapters (`The Beginning`, `The Coffee`, `The Space`, `The People`) and 4 foundational values. |
| [`testimonials.ts`](file:///src/data/testimonials.ts) | Guest feedback structure with zero-fabrication protocol (`hasRealReviews: false`) and review CTA. |

> [!NOTE]  
> **No Fake Data Policy**: Placeholders such as `[SHOP NAME]`, `[ADDRESS]`, `[PHONE]`, `[WHATSAPP]`, and `Rs. [PRICE]` are deliberately used until actual commercial details are supplied.

---

## 📱 Mobile-First UX

The website is optimized for touch and handheld performance across `360px`, `390px`, and `430px` devices:
* **Mobile Sticky Actions**: A quick-access bar pinned to the bottom of the screen featuring **MENU**, **CALL**, **WHATSAPP**, and **DIRECTIONS**.
* **Touch-Enabled Lightbox**: Swipe left and right gesture support for seamless mobile photo browsing.
* **Full-Screen Mobile Menu**: Accessible slide-in navigation with large tap targets, keyboard trap, and body scroll lock.
* **Horizontal Scroll Filters**: Category and dietary buttons scroll horizontally without breaking page viewport width.

---

## 🚀 Quick Start

### Option A: One-Click Launch (Windows)
Double-click the included batch launcher:
```cmd
start.bat
```
* Automatically verifies Node.js installation.
* Automatically runs `npm install` if `node_modules` is missing.
* Starts the development server and launches your default browser at `http://localhost:3000`.

### Option B: Command Line

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Run code quality lint**:
   ```bash
   npm run lint
   ```

---

## ⚡ SEO & Accessibility

- **Structured Data**: Inlined `CafeOrCoffeeShop` Schema.org JSON-LD in `layout.tsx` for local search rankings in Kaduwela.
- **Search Metadata**: Optimized titles, meta descriptions, and localized keywords (`coffee shop Kaduwela`, `cafe Kaduwela`, `specialty coffee Sri Lanka`).
- **Sitemap & Robots**: Automated `sitemap.xml` and `robots.txt` generation for rapid crawler indexing.
- **Accessibility Standards**:
  - Full keyboard navigation for menus and lightbox modals (`Escape`, `ArrowLeft`, `ArrowRight`).
  - High-contrast visual cues with explicit `:focus-visible` ring styling.
  - `prefers-reduced-motion` compliance across all Framer Motion and CSS transitions.
  - Clean HTML5 semantic tags (`<header>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<footer>`, `<aside>`).

---

## 🛠️ Tech Stack Summary

* **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styles**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Fonts**: `next/font/google` (*Cormorant Garamond* & *Manrope*)

---

<div align="center">
  <sub>Crafted with care for Kaduwela, Sri Lanka. Built for high performance and longevity.</sub>
</div>
