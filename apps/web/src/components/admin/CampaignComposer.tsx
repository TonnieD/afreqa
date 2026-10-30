"use client";

import { useState } from "react";
import { Send, Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface CampaignItem {
  id: string;
  title: string;
  subject: string;
  status: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
}

export function CampaignComposer({ initialCampaigns }: { initialCampaigns: CampaignItem[] }) {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialCampaigns);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [contentHtml, setContentHtml] = useState(
    `<h1 style="color: #EDECEC;">Secret Frequency Alert</h1>\n<p style="color: #B6B5B5;">Early Bird tickets for Afreqa: Resonance have dropped. Click below to claim yours:</p>\n<p><a href="https://afreqa.com/go/tickets/resonance" style="display: inline-block; padding: 12px 28px; background: #16F4D0; color: #0B0504; font-weight: bold; border-radius: 50px; text-decoration: none;">Get Early Bird Tickets</a></p>`
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Are you ready to dispatch this broadcast to active subscribers?")) return;

    setSending(true);
    setStatusMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          previewText,
          contentHtml,
          segmentInterests: selectedInterests,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to dispatch campaign");

      setCampaigns([data, ...campaigns]);
      setStatusMessage(`Campaign "${data.title}" queued for ${data.totalRecipients} recipients!`);
      setTitle("");
      setSubject("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Campaign Form */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6 space-y-4">
        <h2 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
          Compose Newsletter Transmission
        </h2>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleDispatch} className="space-y-4 text-xs">
          <div>
            <label className="block font-mono uppercase text-afreqa-silver mb-1">
              Internal Campaign Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Resonance Early Bird Drop"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-afreqa-silver mb-1">
              Email Subject Line *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="⚡ Afreqa: Resonance tickets are live"
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-afreqa-silver mb-1">
              Preview Text (Inbox snippet)
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Grab Early Bird before prices increase..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-afreqa-silver mb-1">
              HTML Email Body *
            </label>
            <textarea
              rows={8}
              required
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-xs font-mono focus:outline-none focus:border-afreqa-teal transition"
            />
          </div>

          <div>
            <label className="block font-mono uppercase text-afreqa-silver mb-1.5">
              Audience Filter (All active if unselected)
            </label>
            <div className="flex flex-wrap gap-2">
              {["festivals", "early-bird", "secret-lineups", "merch"].map((tag) => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition border ${
                      isSelected
                        ? "bg-afreqa-teal/15 border-afreqa-teal text-afreqa-teal font-bold"
                        : "bg-white/5 border-white/10 text-afreqa-silver"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider shadow-glow-teal hover:opacity-90 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? "Enqueuing to pg-boss..." : "Dispatch Broadcast"}</span>
          </button>
        </form>
      </div>

      {/* Broadcast History & Live Preview */}
      <div className="space-y-6">
        <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6">
          <h2 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3 mb-4">
            Live HTML Body Preview
          </h2>
          <div
            className="p-5 rounded-xl bg-afreqa-shadow border border-white/10 text-xs text-afreqa-silver overflow-hidden max-h-72 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </div>

        <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-6">
          <h2 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3 mb-4">
            Transmission History
          </h2>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <p className="text-xs text-afreqa-silver-mid text-center py-4">No past campaigns.</p>
            ) : (
              campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-3.5 rounded-xl bg-afreqa-shadow border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-afreqa-chrome-high">{camp.title}</div>
                    <div className="text-[11px] text-afreqa-silver-mid font-mono">{camp.subject}</div>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-afreqa-teal font-bold">{camp.sentCount}</span> /{" "}
                    {camp.totalRecipients} sent
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

