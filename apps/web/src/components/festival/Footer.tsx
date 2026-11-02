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
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              <strong className="text-white">A Tomorrowland XP in Nairobi.</strong> Dedicated to uncompromising electronic music: Hardstyle & Uptempo, Progressive EDM, Big Room, Hard Techno, and Afro-Tech.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-2">
                Official Channels (@afreqa_)
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com/afreqa_"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram: @afreqa_ • Official Gallery, After-Movies & Announcements"
                  className="p-2.5 rounded-full glass-panel text-pink-400 hover:text-white hover:border-pink-500/40 transition-all"
                  aria-label="Afreqa Instagram @afreqa_"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://tiktok.com/@afreqa_"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok: @afreqa_ • 160 BPM Rave Drops, Crowd POVs & Fit Checks"
                  className="px-2.5 py-1.5 rounded-full glass-panel text-cyan-400 hover:text-white hover:border-cyan-500/40 transition-all font-mono font-bold text-[11px]"
                  aria-label="Afreqa TikTok @afreqa_"
                >
                  TT
                </a>
              <a
                href="https://x.com/afreqa_"
                target="_blank"
                rel="noopener noreferrer"
                title="Afreqa on X"
                className="p-2.5 rounded-full glass-panel text-zinc-400 hover:text-white hover:border-white/25 transition-all"
                aria-label="Afreqa X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbAYtdlCcW4lOTonkS0h"
                target="_blank"
                rel="noopener noreferrer"
                title="Join Afreqa WhatsApp Channel"
                className="p-2.5 rounded-full glass-panel text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="Afreqa WhatsApp Channel"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <Link
                href="/music"
                title="Afreqa Curated Spotify Playlists"
                className="p-2.5 rounded-full glass-panel text-emerald-400 hover:border-emerald-500/50 transition-all"
                aria-label="Afreqa Spotify Playlists"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.354-.678.468-1.033.253-2.83-1.73-6.395-2.121-10.592-1.162-.405.093-.812-.162-.904-.567-.093-.404.162-.812.567-.905 4.588-1.048 8.528-.601 11.71 1.349.354.215.467.676.252 1.032zm1.467-3.264c-.273.444-.855.586-1.299.313-3.24-1.993-8.178-2.57-12.01-1.405-.494.15-1.023-.13-1.173-.623-.15-.494.13-1.023.623-1.173 4.382-1.33 9.816-.689 13.546 1.6 443.272.585.855.313 1.298zm.135-3.398C15.222 8.35 8.825 8.14 5.137 9.26c-.595.18-1.226-.16-1.407-.756-.18-.596.16-1.226.756-1.407 4.238-1.286 11.306-1.047 15.772 1.604.536.319.712 1.018.393 1.554-.319.535-1.018.712-1.551.394z"/>
                </svg>
              </Link>
            </div>
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
                <Link href="/music" className="text-zinc-400 hover:text-white transition-colors">
                  Spotify Playlists
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

          {/* Col 3: Collaborate & Connect */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-amber-400 mb-4 font-bold">
              Collaborate
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/vendors" className="text-zinc-400 hover:text-white transition-colors">
                  Vendors & Stalls
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-zinc-400 hover:text-white transition-colors">
                  Brand Partnerships
                </Link>
              </li>
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

