"use client";

import { useState } from "react";

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSource?: string;
}

const INTEREST_OPTIONS = [
  { id: "festivals", label: "Upcoming Festivals" },
  { id: "secret-lineups", label: "Secret Lineups" },
  { id: "early-bird", label: "Early Bird Tickets" },
  { id: "merch", label: "Merch Drops" },
];

export function SubscribeModal({ isOpen, onClose, defaultSource = "modal" }: SubscribeModalProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["festivals", "early-bird"]);
  const [honeypot, setHoneypot] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: firstName.trim() || undefined,
          phone: phone.trim() || undefined,
          whatsappOptIn,
          interests: selectedInterests,
          source: defaultSource,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit subscription.");
      }

      setSuccess(true);
      setSuccessMessage(data.message || "Please check your inbox to confirm your subscription!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-crowd/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-canvas border border-aurora/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-aurora/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Neon glow effects */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-aurora/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-silver hover:text-chrome flex items-center justify-center transition"
          aria-label="Close dialog"
        >
          ✕
        </button>

        {success ? (
          <div className="text-center py-6 relative z-10">
            <div className="w-16 h-16 rounded-full bg-aurora/10 border border-aurora/40 flex items-center justify-center mx-auto mb-4 text-aurora text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-black text-chrome uppercase tracking-wide mb-2">
              Frequency Signal Sent
            </h3>
            <p className="text-silver/90 text-sm leading-relaxed mb-6">
              {successMessage}
            </p>
            <div className="p-4 rounded-xl bg-crowd/80 border border-white/10 text-left text-xs text-silver/80 mb-6">
              <span className="font-bold text-aurora">Next Step:</span> Open the confirmation email and click <strong>Verify My Frequency</strong> to lock in your early access.
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-aurora text-crowd font-black text-xs uppercase tracking-widest hover:bg-aurora/90 transition shadow-lg shadow-aurora/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-aurora/10 border border-aurora/30 text-aurora text-xs font-mono tracking-widest uppercase mb-2">
                Inner Circle Access
              </div>
              <h2 className="text-2xl font-black text-chrome uppercase tracking-tight">
                Join the Frequency
              </h2>
              <p className="text-silver/80 text-xs mt-1">
                Be the first to unlock hidden stages, secret headliners, and Early Bird tickets.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Honeypot field (hidden from humans) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="subscribe_hp">Leave empty</label>
              <input
                id="subscribe_hp"
                type="text"
                tabIndex={-1}
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-silver/80 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Amani"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crowd/90 border border-white/15 text-chrome placeholder-silver/30 text-sm focus:outline-none focus:border-aurora transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-silver/80 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amani@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-crowd/90 border border-white/15 text-chrome placeholder-silver/30 text-sm focus:outline-none focus:border-aurora transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-silver/80 mb-1">
                Phone Number (WhatsApp optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678 or +254 712 345 678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-crowd/90 border border-white/15 text-chrome placeholder-silver/30 text-sm focus:outline-none focus:border-aurora transition"
              />
              <span className="text-[11px] text-silver/50 mt-1 block">
                Kenyan (+254) numbers are automatically formatted to international standard.
              </span>
            </div>

            {/* WhatsApp Opt-in */}
            <div className="p-3 rounded-xl bg-crowd/60 border border-white/10 flex items-start gap-3">
              <input
                id="modal_wa_optin"
                type="checkbox"
                checked={whatsappOptIn}
                onChange={(e) => setWhatsappOptIn(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-crowd text-aurora focus:ring-aurora"
              />
              <label htmlFor="modal_wa_optin" className="text-xs text-silver/90 cursor-pointer">
                <span className="font-bold text-chrome block mb-0.5">Opt into WhatsApp Broadcasts</span>
                Receive instant ticket alerts and flash drops directly on WhatsApp. Unbundled consent, no spam.
              </label>
            </div>

            {/* Interests Pills */}
            <div>
              <label className="block text-xs font-mono uppercase text-silver/80 mb-2">
                What interests you most?
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((item) => {
                  const isSelected = selectedInterests.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleInterest(item.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono transition border ${
                        isSelected
                          ? "bg-aurora/15 border-aurora text-aurora font-bold"
                          : "bg-white/5 border-white/10 text-silver/70 hover:border-white/20"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KDPA Consent Note */}
            <p className="text-[10px] text-silver/50 leading-normal">
              By subscribing, you agree to receive email and messaging updates under the <strong>Kenya Data Protection Act, 2019</strong>. Your data is never sold. One-click unsubscribe is included in every transmission.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-aurora via-cyan-400 to-violet text-crowd font-black text-xs uppercase tracking-widest hover:opacity-95 transition shadow-lg shadow-aurora/20 disabled:opacity-50"
            >
              {loading ? "Locking in Frequency..." : "Confirm & Join Inner Circle"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

