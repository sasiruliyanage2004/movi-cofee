import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyActions } from "@/components/layout/MobileStickyActions";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1B1410",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    template: `%s | ${siteConfig.businessName} — Kaduwela`,
    default: `${siteConfig.businessName} | Coffee Shop & Café in Kaduwela`,
  },
  description: siteConfig.seoDescription,
  keywords: [
    "coffee shop Kaduwela",
    "cafe Kaduwela",
    "coffee Kaduwela",
    "cafe near Kaduwela",
    "café in Kaduwela",
    "specialty coffee Sri Lanka",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.businessName} | Coffee Shop & Café in Kaduwela`,
    description: siteConfig.seoDescription,
    url: "/",
    siteName: siteConfig.businessName,
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: `${siteConfig.businessName} Kaduwela Interior`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.businessName} | Coffee Shop & Café in Kaduwela`,
    description: siteConfig.seoDescription,
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: siteConfig.businessName,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.country,
    },
    telephone: siteConfig.phone,
    servesCuisine: "Specialty Coffee, Bakery, Light Fare",
    priceRange: "$$",
    url: "https://example.com",
    hasMap: siteConfig.mapUrl,
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "Wi-Fi",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Outdoor Seating",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "Parking",
        value: true,
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-warm-cream text-espresso selection:bg-muted-gold selection:text-espresso pb-14 lg:pb-0">
        <ReadingProgressBar />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
        <MobileStickyActions />
      </body>
    </html>
  );
}
