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
  { label: "About", href: "/about" },
  { label: "Vendors", href: "/vendors" },
  { label: "Partners", href: "/partners" },
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
          ? "bg-[#070709]/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-white/20 group-hover:border-amber-400 transition-all duration-300 shadow-lg">
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
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-wider text-white group-hover:text-amber-400 transition-colors">
              AFREQA
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-zinc-400 font-mono -mt-1">
              Nairobi EDM
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 glass-panel px-6 py-2 rounded-full border border-white/10">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-amber-400 ${
                  isActive
                    ? "text-amber-400 font-semibold"
                    : "text-zinc-300"
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs tracking-wider uppercase shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 hidden sm:inline-flex"
          >
            <Ticket className="w-4 h-4 text-black" />
            <span>Get Tickets</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-black" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl glass-panel text-white hover:text-amber-400 transition-colors"
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
            className="md:hidden bg-[#070709]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6"
          >
            <nav className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-white hover:text-amber-400 transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/go/tickets/resonance"
                className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg"
              >
                <Ticket className="w-4 h-4 text-black" />
                <span>Get Tickets Now</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

