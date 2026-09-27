"use client";

import { useEffect } from "react";

export const DeveloperConsoleBadge: React.FC = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(
        "%c☕ MOVI COFFEE — KADUWELA%c\n\nCrafted & Engineered by Sasiru Liyanage\nAvailable for bespoke web experiences & engineering roles.\n\nGitHub: https://github.com/sasiruliyanage2004\nTech Stack: Next.js 16 (Turbopack) · React 19 · Tailwind CSS · Framer Motion\n",
        "color: #D4AF37; font-size: 14px; font-weight: bold;",
        "color: #8C7B70; font-size: 11px;"
      );
    }
  }, []);

  return null;
};
