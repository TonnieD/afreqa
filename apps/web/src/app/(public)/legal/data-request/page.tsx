"use client";

import React, { useState } from "react";
import { Shield, Send, CheckCircle2, AlertCircle, FileLock } from "lucide-react";

export default function DataRequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    requestType: "ERASURE",
    details: "",
    nationalIdNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/legal/data-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSuccessMessage(data.message);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        requestType: "ERASURE",
        details: "",
        nationalIdNumber: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>Section 26 Rights</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-chrome">
          DATA SUBJECT RIGHTS REQUEST
        </h1>
        <p className="text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
          Under the Kenya Data Protection Act, 2019, you have the right to request access, rectification, or permanent erasure of your personal data held by Afreqa.
        </p>
      </div>

      <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-afreqa-chrome-high/15 shadow-metallic">
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-afreqa-teal/15 border border-afreqa-teal/40 flex items-start gap-3 text-afreqa-teal text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Request Formally Registered</p>
              <p className="text-xs mt-0.5 text-afreqa-silver">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="As shown on official ID"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                Associated Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="The email you wish to manage"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                Associated Phone / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
                ID / Passport Last 4 Digits *
              </label>
              <input
                type="text"
                required
                placeholder="For identity verification"
                value={formData.nationalIdNumber}
                onChange={(e) => setFormData({ ...formData, nationalIdNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
              Type of Request *
            </label>
            <select
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors cursor-pointer"
            >
              <option value="ERASURE">Permanent Erasure / Deletion (Right to be Forgotten)</option>
              <option value="ACCESS">Subject Access Request (Provide all data held)</option>
              <option value="RECTIFICATION">Data Rectification / Correction</option>
              <option value="RESTRICTION">Restriction of Processing</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver font-semibold">
              Specific Instructions & Details *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Please provide any relevant details (e.g. newsletter unsubscribe, deletion of past contact logs, etc.)..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-afreqa-shadow/80 border border-afreqa-chrome-high/15 focus:border-afreqa-teal text-afreqa-chrome-high text-sm focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-afreqa-teal to-afreqa-violet text-afreqa-shadow font-extrabold text-sm uppercase tracking-wider shadow-glow-teal hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              <FileLock className="w-4 h-4" />
              <span>{loading ? "Registering..." : "Submit Formal Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
