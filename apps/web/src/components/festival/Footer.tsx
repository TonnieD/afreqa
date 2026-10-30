"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, MessageCircle, ArrowUpRight, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-afreqa-shadow border-t border-afreqa-chrome-high/10 pt-16 pb-12 overflow-hidden z-10">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-afreqa-violet/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-afreqa-chrome-high/10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-afreqa-chrome-high/30">
                <Image
                  src="/brand/logo.jpg"
                  alt="Afreqa"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-chrome">
                AFREQA
              </span>
            </Link>
            <p className="text-sm text-afreqa-silver leading-relaxed">
              Kenya&apos;s home for electronic dance music. Uniting high-energy festival fantasy with Nairobi&apos;s underground soundwaves.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/afreqa_"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on Instagram [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-afreqa-silver hover:text-afreqa-teal hover:border-afreqa-teal/50 transition-all"
                aria-label="Afreqa Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@afreqa_"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on TikTok [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-afreqa-silver hover:text-afreqa-teal hover:border-afreqa-teal/50 transition-all font-bold text-xs"
                aria-label="Afreqa TikTok"
              >
                TT
              </a>
              <a
                href="https://youtube.com/@afreqanairobi"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on YouTube [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-afreqa-silver hover:text-afreqa-teal hover:border-afreqa-teal/50 transition-all"
                aria-label="Afreqa YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://chat.whatsapp.com/sample-afreqa-community"
                target="_blank"
                rel="noopener noreferrer"
                title="Join Afreqa WhatsApp Community [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-afreqa-teal hover:border-afreqa-teal/50 transition-all shadow-glow-teal"
                aria-label="Afreqa WhatsApp Community"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-afreqa-teal mb-4 font-semibold">
              Festival
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/events" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Upcoming Editions
                </Link>
              </li>
              <li>
                <Link href="/events#past" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Past Archives
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Visual Gallery
                </Link>
              </li>
              <li>
                <Link href="/go/tickets/resonance" className="text-afreqa-teal hover:text-afreqa-chrome-high transition-colors inline-flex items-center gap-1">
                  <span>Get Tickets</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & Support */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-afreqa-teal mb-4 font-semibold">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Our Movement
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Gate Rules & FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Contact & Bookings
                </Link>
              </li>
              <li>
                <a
                  href="https://afreqanairobi.hustlesasa.shop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors inline-flex items-center gap-1"
                >
                  <span>HustleSasa Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & Compliance */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-afreqa-teal mb-4 font-semibold">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Privacy Policy (KDPA 2019)
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Terms of Admission
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors">
                  Cookie Notice
                </Link>
              </li>
              <li>
                <Link href="/legal/data-request" className="text-afreqa-silver hover:text-afreqa-chrome-high transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-afreqa-teal" />
                  <span>Data Subject Request</span>
                </Link>
              </li>
              <li>
                <Link href="/unsubscribe" className="text-afreqa-silver/60 hover:text-afreqa-chrome-high transition-colors">
                  Unsubscribe / Manage Data
                </Link>
              </li>
              <li>
                <a href="/api/whatsapp/vcard" download="afreqa.vcf" className="text-afreqa-teal/80 hover:text-afreqa-teal transition-colors">
                  Save Afreqa Contact (.vcf)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-afreqa-silver-mid font-mono">
          <p>© {new Date().getFullYear()} Afreqa Nairobi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with passion for African Electronic Music</span>
            <Heart className="w-3 h-3 text-afreqa-teal inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}

