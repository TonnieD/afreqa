"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Ticket, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioWaveIndicator } from "./AudioWaveIndicator";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-afreqa-shadow/85 backdrop-blur-md border-b border-afreqa-chrome-high/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-afreqa-chrome-high/30 group-hover:border-afreqa-teal transition-all shadow-glow-teal duration-300">
            <Image
              src="/brand/logo.jpg"
              alt="Afreqa Logo"
              fill
              sizes="44px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-chrome group-hover:text-afreqa-teal transition-colors">
              AFREQA
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-afreqa-silver-mid font-mono -mt-1">
              Nairobi EDM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 glass-panel px-6 py-2 rounded-full">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-afreqa-teal ${
                  isActive
                    ? "text-afreqa-teal font-semibold drop-shadow-[0_0_8px_rgba(22,244,208,0.6)]"
                    : "text-afreqa-silver"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3 sm:gap-4">
          <AudioWaveIndicator />

          {/* Primary "Get Tickets" CTA */}
          <Link
            href="/go/tickets/resonance"
            className="relative group overflow-hidden rounded-full p-[1px] font-semibold text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 active:scale-95 shadow-glow-teal hidden sm:inline-flex"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-afreqa-teal via-afreqa-violet to-afreqa-teal bg-[length:200%_auto] animate-pulse rounded-full" />
            <span className="relative flex items-center gap-2 px-4 py-2 bg-afreqa-shadow rounded-full text-afreqa-chrome-high group-hover:bg-transparent group-hover:text-afreqa-shadow font-bold transition-all duration-300">
              <Ticket className="w-4 h-4 text-afreqa-teal group-hover:text-afreqa-shadow transition-colors" />
              <span>Get Tickets</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl glass-panel text-afreqa-chrome-high hover:text-afreqa-teal transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-afreqa-shadow/95 backdrop-blur-xl border-b border-afreqa-chrome-high/10 px-6 py-6"
          >
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-afreqa-chrome-high hover:text-afreqa-teal transition-colors py-2 border-b border-afreqa-chrome-high/5"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/go/tickets/resonance"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-full bg-gradient-to-r from-afreqa-teal to-afreqa-violet text-afreqa-shadow font-bold text-sm uppercase tracking-wider shadow-glow-teal"
              >
                <Ticket className="w-4 h-4" />
                <span>Get Tickets Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

