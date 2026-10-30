"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Handshake,
  Award,
  Zap,
  Radio,
  Eye,
  Users,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageCircle,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    titleRole: "",
    email: "",
    phone: "",
    tierInterest: "EXPERIENTIAL_LOUNGE",
    budgetBracket: "KES 500K - 1M",
    objectives: "",
    website_url: "", // Honeypot
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const compiledMessage = `Brand / Organization: ${formData.companyName}
Contact Representative: ${formData.contactName} (${formData.titleRole || "Representative"})
Partnership Interest: ${formData.tierInterest}
Estimated Activation Budget: ${formData.budgetBracket}

Campaign & Strategic Objectives:
${formData.objectives}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.contactName} (${formData.companyName})`,
          email: formData.email,
          phone: formData.phone,
          subject: "SPONSORSHIP",
          message: compiledMessage,
          website_url: formData.website_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit partnership inquiry");
      }

      setSuccess(true);
      setFormData({
        companyName: "",
        contactName: "",
        titleRole: "",
        email: "",
        phone: "",
        tierInterest: "EXPERIENTIAL_LOUNGE",
        budgetBracket: "KES 500K - 1M",
        objectives: "",
        website_url: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit partnership inquiry.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Afreqa Partnerships Team! I would like to explore brand sponsorship and activation opportunities for upcoming editions."
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Handshake className="w-3.5 h-3.5" />
          <span>Brand Alliances & Sponsorships</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
          PARTNER WITH AFREQA
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          Connect your brand with East Africa&apos;s most culturally magnetic electronic music movement. Elevate your presence through multi-sensory stage takeovers, experiential lounges, and digital reach.
        </p>
      </div>

      {/* 2. VALUE PROPOSITION METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black font-display text-white">100% 18+</div>
          <h4 className="font-bold text-sm text-amber-400">Verified Adults</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Concentrated urban demographic of creators, tech leaders, professionals, and tastemakers with high disposable income.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black font-display text-white">10+ Hours</div>
          <h4 className="font-bold text-sm text-amber-400">Deep Dwell Time</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Attendees remain inside our festival sanctuary from sunset till sunrise, maximizing repeated brand impressions.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Eye className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black font-display text-white">Viral Impact</div>
          <h4 className="font-bold text-sm text-amber-400">TikTok & IG Reach</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Visual stage architecture designed specifically to spark organic social sharing across @AFREQA_ and attendee feeds.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl font-black font-display text-white">Tomorrowland XP</div>
          <h4 className="font-bold text-sm text-amber-400">World-Class Prestige</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Elevate your brand image by aligning with premium acoustic standards, safe dancefloors, and futuristic stage crafts.
          </p>
        </div>
      </div>

      {/* 3. PARTNERSHIP OPPORTUNITIES */}
      <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 sm:p-12 border border-white/10 space-y-8 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            Custom Activation Avenues
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            We don’t do passive static banners. We build living, interactive experiences that festivalgoers remember:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-black/40 p-6 border border-white/10 space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              CATEGORY EXCLUSIVE
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Mainstage Naming & Takeover
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Headline integration on our monolithic stage architecture. Your brand woven into the visual countdowns, laser sweeps, and official festival announcements.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-6 border border-white/10 space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              CONSUMER EXPERIENCE
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Experiential Brand Lounges
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Dedicated experiential footprints: interactive photo installations, recharge stations, gaming zones, sensory chillout zones, and product sampling bars.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-6 border border-white/10 space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              BEVERAGE PARTNERSHIP
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Official Pouring & Bar Rights
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Exclusive pouring categories across spirits, beer, energy drinks, or mixers. Signature themed cocktails, branded bars, and direct POS sales integration.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-6 border border-white/10 space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              HOSPITALITY
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              VIP Deck & Table Hosting
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Host key stakeholders, C-suite partners, or loyal influencers on our elevated VIP deck with dedicated table service and private backstage credentials.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-6 border border-white/10 space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              CONTENT & DIGITAL
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Official After-Movie Integration
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Persistent brand placement in our 4K cinematic after-movies, YouTube recaps, DJ set recordings, and targeted WhatsApp/Email newsletter announcements.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-6 border border-white/10 space-y-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              INNOVATION
            </span>
            <h3 className="font-display font-bold text-xl text-white">
              Custom Fintech & Tech Trials
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Ideal high-volume festival sandbox for cashless wristbands, fintech apps, digital ticketing activations, or telecom 5G connectivity showcases.
            </p>
          </div>
        </div>
      </div>

      {/* 4. PARTNERSHIP FORM & DIRECT LINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Direct Operations Details */}
        <div className="space-y-6 lg:col-span-1">
          {/* WhatsApp Direct */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              Head of Partnerships
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Connect directly with our commercial team to request our confidential Festival Deck, deck rate cards, or custom activation proposals.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/254702665665?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/40"
              >
                <span>WhatsApp 0702 665 665</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Email Info */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-white/10 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Direct Corporate Desk
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Email: <span className="text-white">sponsors@afreqa.com</span>
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              Hotline: <span className="text-white">0702 665 665</span>
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              Base: <span className="text-white">Nairobi, Kenya</span>
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Proposal Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 sm:p-10 border border-white/10 shadow-2xl">
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">
              Initiate a Brand Partnership
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-8 font-normal">
              Share your brand objectives and our partnerships director will connect with a bespoke concept within 24 hours.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transmission Successful</p>
                  <p className="text-xs mt-0.5 text-zinc-300">
                    Thank you. Your sponsorship inquiry has been routed to our commercial team. We look forward to co-creating an unforgettable experience.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_url">Website URL (leave blank)</label>
                <input
                  type="text"
                  id="website_url"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Company / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red Bull / Tusker / Safaricom"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Lead Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kelvin Otieno"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partnerships@brand.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Partnership Category *
                  </label>
                  <select
                    value={formData.tierInterest}
                    onChange={(e) => setFormData({ ...formData, tierInterest: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="MAINSTAGE_HEADLINE">Mainstage Headline & Stage Naming</option>
                    <option value="EXPERIENTIAL_LOUNGE">Experiential Brand Village Lounge</option>
                    <option value="BEVERAGE_POUR">Official Beverage / Bar Pouring Partner</option>
                    <option value="VIP_HOSPITALITY">VIP Deck & Table Hospitality Sponsor</option>
                    <option value="DIGITAL_MEDIA">Digital, Content & After-Movie Sponsor</option>
                    <option value="OTHER_BESPOKE">Custom Activation / Bespoke Package</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Estimated Activation Budget
                  </label>
                  <select
                    value={formData.budgetBracket}
                    onChange={(e) => setFormData({ ...formData, budgetBracket: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="KES 250K - 500K">KES 250,000 – KES 500,000</option>
                    <option value="KES 500K - 1M">KES 500,000 – KES 1,000,000</option>
                    <option value="KES 1M - 2.5M">KES 1,000,000 – KES 2,500,000</option>
                    <option value="KES 2.5M+">KES 2,500,000+ (Headline Stage Partner)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Strategic Objectives & Concept Pitch *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Outline your target KPIs, activation ideas, and how you envision your brand living at Afreqa..."
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Transmitting..." : "Submit Partnership Request"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

