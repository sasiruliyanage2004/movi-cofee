"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyActions } from "@/components/layout/MobileStickyActions";
import { ReadingProgressBar } from "@/components/ui/ReadingProgressBar";
import { CustomerSommelierModal } from "@/components/ai/CustomerSommelierModal";
import { SeasonalBanner } from "@/components/layout/SeasonalBanner";
import { SeasonalEffects } from "@/components/seasonal/SeasonalEffects";
import { SeasonalExperience } from "@/types/settings";

interface PublicSiteShellProps {
  children: React.ReactNode;
  seasonalExperience: SeasonalExperience | null;
}

export const PublicSiteShell: React.FC<PublicSiteShellProps> = ({
  children,
  seasonalExperience,
}) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1 flex flex-col">{children}</main>;
  }

  return (
    <>
      <SeasonalBanner experience={seasonalExperience} />
      <SeasonalEffects experience={seasonalExperience} />
      <ReadingProgressBar />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <MobileStickyActions />
      <CustomerSommelierModal />
    </>
  );
};
