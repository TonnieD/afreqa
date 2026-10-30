"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  Utensils,
  Sparkles,
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertCircle,
  Send,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
  Flame,
} from "lucide-react";

export default function VendorsPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    category: "FOOD_BEVERAGE",
    instagramHandle: "",
    spaceNeeds: "3x3m Canopy",
    powerNeeds: "Standard 13A Single Socket",
    description: "",
    website_url: "", // Honeypot anti-spam
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
      const compiledMessage = `Vendor Business: ${formData.businessName}
Category: ${formData.category}
Instagram / Portfolio: ${formData.instagramHandle || "N/A"}
Space Needs: ${formData.spaceNeeds}
Power Requirements: ${formData.powerNeeds}

Products & Concept Description:
${formData.description}`;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.contactName} (${formData.businessName})`,
          email: formData.email,
          phone: formData.phone,
          subject: "VENDOR",
          message: compiledMessage,
          website_url: formData.website_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit vendor application");
      }

      setSuccess(true);
      setFormData({
        businessName: "",
        contactName: "",
        email: "",
        phone: "",
        category: "FOOD_BEVERAGE",
        instagramHandle: "",
        spaceNeeds: "3x3m Canopy",
        powerNeeds: "Standard 13A Single Socket",
        description: "",
        website_url: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit application.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Afreqa Team! I am interested in booking a vendor stall for upcoming festival editions."
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Store className="w-3.5 h-3.5" />
          <span>Festival Market Village</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
          VEND WITH AFREQA
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          Showcase your culinary creations, streetwear, festival apparel, or rave accessories to thousands of passionate electronic music dancers in Nairobi.
        </p>
      </div>

      {/* 2. WHY VEND STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-lg text-white">Prime Demographics</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            100% 18+ verified festival crowd with high purchasing power, eager to discover artisan food & festival merchandise.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Store className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-lg text-white">Curated Market Village</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Strategically located in high-traffic illuminated paths between the mainstage and chillout lounges.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-lg text-white">Full Power & Security</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Standard electrical hookups, overnight perimeter security guards, and dedicated festival waste management provided.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 space-y-2 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="font-display font-bold text-lg text-white">Digital Brand Exposure</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Official social media features across our Instagram, TikTok, and WhatsApp community leading up to each edition.
          </p>
        </div>
      </div>

      {/* 3. VENDOR CATEGORIES */}
      <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 sm:p-12 border border-white/10 space-y-8 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            What We Are Looking For
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            We curate our market village to ensure non-competing, high-quality vendors across these four pillars:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl bg-black/40 p-5 border border-white/10 space-y-2">
            <div className="text-amber-400 flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <Utensils className="w-4 h-4" />
              <span>Gourmet Street Food</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Fast, delicious, portable festival food: gourmet smash burgers, artisan tacos, shawarmas, loaded fries, and vegan delicacies.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10 space-y-2">
            <div className="text-amber-400 flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <ShoppingBag className="w-4 h-4" />
              <span>Fashion & Streetwear</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Kenya streetwear brands, rave attire, custom jackets, festival sunglasses, bucket hats, and statement accessories.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10 space-y-2">
            <div className="text-amber-400 flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Sensory & Glow</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Face gems, neon body paint, festival glitter bars, LED accessories, and creative cosmetic activations.
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 p-5 border border-white/10 space-y-2">
            <div className="text-amber-400 flex items-center gap-2 font-mono text-xs font-bold uppercase">
              <Store className="w-4 h-4" />
              <span>Beverage & Refreshment</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Artisan non-alcoholic mocktails, iced matcha & specialty coffee, bubble teas, and energizing wellness infusions.
            </p>
          </div>
        </div>
      </div>

      {/* 4. APPLICATION FORM & DIRECT CHAT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Direct WhatsApp & Requirements */}
        <div className="space-y-6 lg:col-span-1">
          {/* Quick WhatsApp */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              Vendor Coordinator
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Have an urgent question regarding stall slots, power capacities, or fee structures? Chat directly with operations.
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

          {/* Checklist */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Vendor Checklist</span>
            </div>
            <ul className="space-y-3 text-xs text-zinc-300 font-normal">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Public Health Certificate:</strong> Required for all Food & Beverage personnel handling consumables.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Eco-Friendly Packaging:</strong> Strictly zero single-use plastics or non-biodegradable containers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Digital Payments:</strong> Bring an active M-Pesa Till / Paybill or card POS terminal for quick transactions.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Application Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 sm:p-10 border border-white/10 shadow-2xl">
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">
              Apply for a Vendor Stall
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-8 font-normal">
              Submit your brand details below. Our team reviews applications on a rolling basis.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Application Received</p>
                  <p className="text-xs mt-0.5 text-zinc-300">
                    Thank you for applying. The Afreqa vendor team will review your concept and reach out via email/WhatsApp within 48 hours.
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
                    Brand / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi Smash Burger Co."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Lead Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zawadi Maina"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="orders@yourbrand.com"
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
                    Vendor Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="FOOD_BEVERAGE">Food & Gourmet Dining</option>
                    <option value="BEVERAGE_COFFEE">Artisan Drinks & Specialty Coffee</option>
                    <option value="FASHION_APPAREL">Fashion, Streetwear & Rave Gear</option>
                    <option value="ACCESSORIES_GLOW">Glow, Face Art & Accessories</option>
                    <option value="OTHER">Other Unique Concept</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Instagram Handle / Website
                  </label>
                  <input
                    type="text"
                    placeholder="@yourbrand or link"
                    value={formData.instagramHandle}
                    onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Stall Space Required
                  </label>
                  <select
                    value={formData.spaceNeeds}
                    onChange={(e) => setFormData({ ...formData, spaceNeeds: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="3x3m Canopy">Standard 3m x 3m Stall Space</option>
                    <option value="6x3m Double Stall">Expanded 6m x 3m Double Stall</option>
                    <option value="Food Truck / Trailer">Mobile Food Truck / Trailer Spot</option>
                    <option value="Table Stand Only">Compact 1.5m Table Spot</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Electrical Power Needs
                  </label>
                  <select
                    value={formData.powerNeeds}
                    onChange={(e) => setFormData({ ...formData, powerNeeds: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Standard 13A Single Socket">Standard 13A Single Socket (POS / Lighting / Phone)</option>
                    <option value="Heavy Load 16A/32A">Heavy Appliance Load (Deep Fryers / Grills / Espresso)</option>
                    <option value="No Power Needed">No Electrical Power Required</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Product Offerings & Pitch *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail what you will sell, average price points, and any previous event experience..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <span>{loading ? "Submitting Application..." : "Submit Vendor Application"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

