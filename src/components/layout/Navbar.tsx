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

  const showScrolledStyle = isScrolled || !transparentAtTop;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 ${
          showScrolledStyle
            ? "bg-[#F5F0E8]/92 backdrop-blur-md py-4 border-b border-espresso/10 shadow-[0_2px_12px_rgba(27,20,16,0.04)]"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <Container width="wide">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link
              href="/"
              className="group flex flex-col text-left transition-opacity hover:opacity-85"
              aria-label={`${siteConfig.name} Home`}
            >
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-espresso leading-none">
                {siteConfig.name}
              </span>
              <span className="font-sans text-[9px] uppercase tracking-[0.28em] text-muted-coffee mt-1">
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
                    className={`relative font-sans text-xs tracking-[0.16em] uppercase transition-colors duration-200 py-1 ${
                      isActive
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
                variant="primary"
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
                className="p-2 -mr-2 text-espresso hover:text-muted-coffee transition-colors focus-visible:outline-2 focus-visible:outline-espresso"
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
