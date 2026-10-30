"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube, MessageCircle, ArrowUpRight, Shield, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#070709] border-t border-white/10 pt-16 pb-12 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/brand/logo.jpg"
                  alt="Afreqa"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                AFREQA
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Kenya&apos;s home for electronic dance music. Uniting high-energy festival fantasy with Nairobi&apos;s underground soundwaves.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/afreqa_"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on Instagram [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-zinc-400 hover:text-white hover:border-white/25 transition-all"
                aria-label="Afreqa Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@afreqa_"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on TikTok [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-zinc-400 hover:text-white hover:border-white/25 transition-all font-bold text-xs"
                aria-label="Afreqa TikTok"
              >
                TT
              </a>
              <a
                href="https://youtube.com/@afreqanairobi"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on YouTube [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-zinc-400 hover:text-white hover:border-white/25 transition-all"
                aria-label="Afreqa YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://chat.whatsapp.com/sample-afreqa-community"
                target="_blank"
                rel="noopener noreferrer"
                title="Join Afreqa WhatsApp Community [Placeholder]"
                className="p-2.5 rounded-full glass-panel text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="Afreqa WhatsApp Community"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4 font-bold">
              Festival
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/events" className="text-zinc-400 hover:text-white transition-colors">
                  Upcoming Editions
                </Link>
              </li>
              <li>
                <Link href="/events#past" className="text-zinc-400 hover:text-white transition-colors">
                  Past Archives
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-zinc-400 hover:text-white transition-colors">
                  Visual Gallery
                </Link>
              </li>
              <li>
                <Link href="/go/tickets/resonance" className="text-amber-400 hover:text-white transition-colors inline-flex items-center gap-1 font-semibold">
                  <span>Get Tickets</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & Support */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4 font-bold">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                  Our Movement
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-400 hover:text-white transition-colors">
                  Gate Rules & FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
                  Contact & Bookings
                </Link>
              </li>
              <li>
                <a
                  href="https://afreqanairobi.hustlesasa.shop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>HustleSasa Store</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Privacy & Compliance */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4 font-bold">
              Legal & Privacy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/legal/privacy" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy (KDPA 2019)
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="text-zinc-400 hover:text-white transition-colors">
                  Terms of Admission
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-zinc-400 hover:text-white transition-colors">
                  Cookie Notice
                </Link>
              </li>
              <li>
                <Link href="/legal/data-request" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Data Subject Request</span>
                </Link>
              </li>
              <li>
                <Link href="/unsubscribe" className="text-zinc-500 hover:text-white transition-colors">
                  Unsubscribe / Manage Data
                </Link>
              </li>
              <li>
                <a href="/api/whatsapp/vcard" download="afreqa.vcf" className="text-amber-400/80 hover:text-amber-400 transition-colors">
                  Save Afreqa Contact (.vcf)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} Afreqa Nairobi. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Engineered with passion for African Electronic Music</span>
            <Heart className="w-3 h-3 text-amber-400 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}

