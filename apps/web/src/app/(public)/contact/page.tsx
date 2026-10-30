"use client";

import React, { useState } from "react";
import { Mail, MessageCircle, MapPin, Send, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "GENERAL",
    message: "",
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "GENERAL",
        message: "",
        website_url: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    "Hello Afreqa team! I have an inquiry regarding upcoming festival editions."
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5" />
          <span>Direct Lines</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
          CONTACT & BOOKINGS
        </h1>
        <p className="text-sm sm:text-base text-zinc-300">
          Whether you are an electronic music producer, potential brand partner, press representative, or festival attendee, we welcome your inquiry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Direct Communication Cards */}
        <div className="space-y-6 lg:col-span-1">
          {/* WhatsApp Direct Chat */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-emerald-500/30 space-y-4 shadow-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">
              Instant WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
              Fastest response for urgent ticketing inquiries, VIP table reservations, or gate access questions.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/254700000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/40"
              >
                <span>Chat with Operations</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Email Info */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-white/10 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Official Email
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              General: <span className="text-white">hello@afreqa.com</span>
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              Bookings: <span className="text-white">artists@afreqa.com</span>
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              Partners: <span className="text-white">sponsors@afreqa.com</span>
            </p>
          </div>

          {/* Location */}
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-6 sm:p-8 border border-white/10 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-zinc-300 flex items-center justify-center border border-white/15">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              Operations Base
            </h3>
            <p className="text-xs text-zinc-400 font-normal leading-relaxed">
              Afreqa Productions Ltd.<br />
              Kilimani / Karen, Nairobi, Kenya
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-[#0f1117]/80 backdrop-blur-md p-8 sm:p-10 border border-white/10 shadow-2xl">
            <h2 className="font-display font-extrabold text-2xl text-white mb-2">
              Send a Message
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mb-8 font-normal">
              Fill in your details below and our team will get in touch within 24 hours.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Message Delivered</p>
                  <p className="text-xs mt-0.5 text-zinc-300">
                    Thank you. Your message has been received by the Afreqa team.
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
              {/* Honeypot anti-spam field (hidden from visual users) */}
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
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amani Mwangi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Topic / Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#141721] border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="GENERAL">General Inquiries & Gate Info</option>
                    <option value="SPONSORSHIP">Sponsorship & Brand Activations</option>
                    <option value="BOOKING">Artist Bookings & Demo Submissions</option>
                    <option value="MEDIA">Press, Photography & Media Credentials</option>
                    <option value="OTHER">Other Matter</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail your inquiry, proposal, or question..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Sending..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
