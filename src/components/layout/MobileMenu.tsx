"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const prevPathname = React.useRef(pathname);

  // Close menu only when route actually changes (not on initial mount/open)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent body scroll when menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-espresso text-warm-cream lg:hidden h-[100dvh] pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-warm-cream/10">
            <Link
              href="/"
              onClick={onClose}
              className="flex flex-col text-left group"
            >
              <span className="font-serif text-xl tracking-tight text-warm-cream group-hover:text-muted-gold transition-colors">
                {siteConfig.name}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-muted-gold">
                {siteConfig.location.city}, {siteConfig.location.country}
              </span>
            </Link>

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 -mr-2 text-warm-cream/80 hover:text-warm-cream transition-colors focus-visible:outline-2 focus-visible:outline-muted-gold"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
            <nav className="flex flex-col space-y-5">
              {siteConfig.navigation.mobile.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 + index * 0.04,
                      duration: 0.35,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center justify-between py-2 text-2xl font-serif tracking-tight transition-colors ${
                        isActive
                          ? "text-muted-gold"
                          : "text-warm-cream/90 hover:text-warm-cream"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs font-sans uppercase tracking-widest text-warm-cream/40 group-hover:text-muted-gold transition-colors">
                        0{index + 1}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Actions & Details */}
            <div className="pt-8 border-t border-warm-cream/10 mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="gold"
                  size="md"
                  href="/menu"
                  className="w-full text-center"
                >
                  VIEW MENU
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  href="/visit#directions"
                  className="w-full text-center"
                >
                  GET DIRECTIONS
                </Button>
              </div>

              <div className="pt-4 flex items-center gap-2 text-warm-cream/60 text-xs font-sans tracking-wide">
                <MapPin className="w-4 h-4 text-muted-gold shrink-0" />
                <span>
                  {siteConfig.location.city}, {siteConfig.location.country}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
