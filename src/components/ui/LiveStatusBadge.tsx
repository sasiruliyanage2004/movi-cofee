"use client";

import React, { useState, useEffect } from "react";
import { getOperatingStatus, OperatingStatus } from "@/utils/openingStatus";

export interface LiveStatusBadgeProps {
  theme?: "light" | "dark";
  className?: string;
}

export const LiveStatusBadge: React.FC<LiveStatusBadgeProps> = ({
  theme = "dark",
  className = "",
}) => {
  const [status, setStatus] = useState<OperatingStatus>(getOperatingStatus);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getOperatingStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={`inline-flex items-center gap-2.5 text-[11px] font-sans tracking-[0.2em] uppercase font-medium ${
        isDark ? "text-warm-cream" : "text-espresso"
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {status.isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status.isOpen ? "bg-[#10b981]" : "bg-muted-gold"
          }`}
        />
      </span>
      <span>{status.headline}</span>
    </div>
  );
};
