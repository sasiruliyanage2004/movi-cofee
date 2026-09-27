"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { MobileMenu } from "./MobileMenu";

export interface NavbarProps {
  transparentAtTop?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  transparentAtTop = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomepage = pathname === "/";
  // Dark header when at the top of the homepage hero
  const isDarkHeader = isHomepage && !isScrolled && transparentAtTop;
  const showScrolledStyle = isScrolled || !transparentAtTop || !isHomepage;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          showScrolledStyle
            ? "bg-[#F5F0E8]/95 backdrop-blur-md py-4 border-b border-espresso/10 shadow-[0_2px_12px_rgba(27,20,16,0.05)]"
            : "bg-gradient-to-b from-espresso/80 via-espresso/40 to-transparent py-6 border-b border-transparent"
        }`}
      >
        <Container width="wide">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="group flex flex-col text-left transition-opacity hover:opacity-90"
              aria-label={`${siteConfig.name} Home`}
            >
              <span
                className={`font-serif text-2xl sm:text-3xl font-normal tracking-tight leading-none transition-colors duration-300 ${
                  isDarkHeader ? "text-warm-cream" : "text-espresso"
                }`}
              >
                {siteConfig.name}
              </span>
              <span
                className={`font-sans text-[9px] uppercase tracking-[0.28em] mt-1 transition-colors duration-300 ${
                  isDarkHeader ? "text-muted-gold" : "text-muted-coffee"
                }`}
              >
                {siteConfig.location.city} • Sri Lanka
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-9">
              {siteConfig.navigation.main.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative font-sans text-xs tracking-[0.18em] uppercase transition-colors duration-300 py-1 ${
                      isDarkHeader
                        ? isActive
                          ? "text-warm-cream font-semibold"
                          : "text-warm-cream/80 hover:text-warm-cream"
                        : isActive
                        ? "text-espresso font-semibold"
                        : "text-espresso/70 hover:text-espresso"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-muted-gold" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action on Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant={isDarkHeader ? "gold" : "primary"}
                size="sm"
                href="/menu"
                className="shadow-sm"
              >
                VIEW MENU
              </Button>
            </div>

            {/* Mobile Hamburger Trigger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 -mr-2 transition-colors focus-visible:outline-2 focus-visible:outline-muted-gold cursor-pointer ${
                  isDarkHeader
                    ? "text-warm-cream hover:text-muted-gold"
                    : "text-espresso hover:text-muted-coffee"
                }`}
                aria-label="Open Navigation Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                <Menu className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};
