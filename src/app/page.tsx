import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickInfoStrip } from "@/components/home/QuickInfoStrip";
import { SignatureCoffeeSection } from "@/components/home/SignatureCoffeeSection";
import { OurStorySection } from "@/components/home/OurStorySection";
import { CoffeeCraftSection } from "@/components/home/CoffeeCraftSection";
import { MenuPreviewSection } from "@/components/home/MenuPreviewSection";
import { TheSpaceSection } from "@/components/home/TheSpaceSection";
import { WhyVisitSection } from "@/components/home/WhyVisitSection";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { LocationSection } from "@/components/home/LocationSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Quick Information */}
      <QuickInfoStrip />

      {/* 3. Signature Coffee */}
      <SignatureCoffeeSection />

      {/* 4. Our Story */}
      <OurStorySection />

      {/* 5. Coffee Craft */}
      <CoffeeCraftSection />

      {/* 6. Menu Preview */}
      <MenuPreviewSection />

      {/* 7. The Space */}
      <TheSpaceSection />

      {/* 8. Why Visit */}
      <WhyVisitSection />

      {/* 9. Customer Reviews */}
      <CustomerReviewsSection />

      {/* 10. Gallery Preview */}
      <GalleryPreviewSection />

      {/* 11. Instagram */}
      <InstagramSection />

      {/* 12. Location */}
      <LocationSection />

      {/* 13. Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
