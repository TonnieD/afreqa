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
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest">
          <Mail className="w-3.5 h-3.5" />
          <span>Direct Lines</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-chrome">
          CONTACT & BOOKINGS
        </h1>
        <p className="text-sm sm:text-base text-afreqa-silver">
          Whether you are an electronic music producer, potential brand partner, press representative, or festival attendee, we welcome your frequency.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Direct Communication Cards */}
        <div className="space-y-6 lg:col-span-1">
          {/* WhatsApp Direct Chat */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-afreqa-teal/30 space-y-4 shadow-glow-teal relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-afreqa-teal/20 text-afreqa-teal flex items-center justify-center border border-afreqa-teal/30">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-xl text-afreqa-chrome-high">
              Instant WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed font-light">
              Fastest response for urgent ticketing inquiries, VIP table reservations, or gate access questions.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/254700000000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-afreqa-teal hover:bg-afreqa-teal/90 text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider transition-all shadow-glow-teal"
              >
                <span>Chat with Operations</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Email Info */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-afreqa-chrome-high/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-afreqa-violet/20 text-afreqa-violet flex items-center justify-center border border-afreqa-violet/30">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-afreqa-chrome-high">
              Official Email
            </h3>
            <p className="text-xs text-afreqa-silver-mid font-mono">
              General: hello@afreqa.com
            </p>
            <p className="text-xs text-afreqa-silver-mid font-mono">
              Bookings: artists@afreqa.com
            </p>
            <p className="text-xs text-afreqa-silver-mid font-mono">
              Partners: sponsors@afreqa.com
            </p>
          </div>

          {/* Location */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-afreqa-chrome-high/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-afreqa-gold/20 text-afreqa-gold flex items-center justify-center border border-afreqa-gold/30">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-afreqa-chrome-high">
              Operations Base
            </h3>
            <p className="text-xs text-afreqa-silver font-light leading-relaxed">
              Afreqa Productions Ltd.<br />
              Kilimani / Karen, Nairobi, Kenya
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-afreqa-chrome-high/15 shadow-metallic">
            <h2 className="font-display font-extrabold text-2xl text-afreqa-chrome-high mb-2">
              Transmit a Message
            </h2>
            <p className="text-xs sm:text-sm text-afreqa-silver mb-8 font-light">
              Fill in your details below and our team will get in touch within 24 hours.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-2xl bg-afreqa-teal/15 border border-afreqa-teal/40 flex items-start gap-3 text-afreqa-teal text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transmission Successful</p>
                  <p className="text-xs mt-0.5 text-afreqa-silver">
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
                  <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amani Mwangi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high placeholder:text-afreqa-silver-mid/50 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high placeholder:text-afreqa-silver-mid/50 text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high placeholder:text-afreqa-silver-mid/50 text-sm focus:outline-none transition-colors"
                  />
                </div>

                {/* Topic / Subject */}
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors cursor-pointer"
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
                <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail your inquiry, proposal, or question..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high placeholder:text-afreqa-silver-mid/50 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-afreqa-teal to-afreqa-violet text-afreqa-shadow font-extrabold text-sm uppercase tracking-wider shadow-glow-teal hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Transmitting..." : "Send Transmission"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
