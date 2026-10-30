"use client";

import { useState } from "react";
import { Mail, Check, MessageSquare, Clock } from "lucide-react";

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date;
}

export function InquiriesInbox({ initialInquiries }: { initialInquiries: InquiryItem[] }) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [selectedTopic, setSelectedTopic] = useState<string>("ALL");

  const toggleStatus = async (id: string, updates: { isRead?: boolean; isReplied?: boolean }) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");

      setInquiries(inquiries.map((inq) => (inq.id === id ? { ...inq, ...updates } : inq)));
    } catch (err) {
      alert("Failed to update inquiry status.");
    }
  };

  const filtered =
    selectedTopic === "ALL"
      ? inquiries
      : inquiries.filter((inq) => inq.topic === selectedTopic);

  return (
    <div className="space-y-4">
      {/* Topic Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "GENERAL", "SPONSORSHIP", "BOOKING", "PRESS"].map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition border ${
              selectedTopic === topic
                ? "bg-afreqa-teal text-afreqa-shadow border-afreqa-teal font-bold shadow-glow-teal"
                : "bg-white/5 border-white/10 text-afreqa-silver hover:bg-white/10"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden divide-y divide-afreqa-chrome-high/5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare className="w-12 h-12 text-afreqa-silver-mid mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-base text-afreqa-chrome-high">Inbox Zero</h3>
            <p className="text-xs text-afreqa-silver-mid mt-1">
              No inquiries found in this category.
            </p>
          </div>
        ) : (
          filtered.map((inq) => (
            <div
              key={inq.id}
              className={`p-5 transition ${
                inq.isRead ? "bg-transparent opacity-85" : "bg-white/[0.02]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      inq.isRead ? "bg-afreqa-silver-mid" : "bg-afreqa-teal animate-pulse"
                    }`}
                  />
                  <span className="font-bold text-sm text-afreqa-chrome-high">{inq.name}</span>
                  <span className="text-xs text-afreqa-silver-mid font-mono">&lt;{inq.email}&gt;</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-afreqa-teal uppercase">
                    {inq.topic}
                  </span>
                  <span className="text-[11px] font-mono text-afreqa-silver-mid">
                    {new Date(inq.createdAt).toLocaleDateString([], { dateStyle: "short" })}
                  </span>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-afreqa-teal/30 my-3">
                <p className="text-xs text-afreqa-silver leading-relaxed whitespace-pre-wrap">
                  {inq.message}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                {!inq.isRead && (
                  <button
                    onClick={() => toggleStatus(inq.id, { isRead: true })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-afreqa-silver text-[11px] transition"
                  >
                    <span>Mark Read</span>
                  </button>
                )}

                <button
                  onClick={() => toggleStatus(inq.id, { isReplied: !inq.isReplied })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition ${
                    inq.isReplied
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 hover:bg-white/10 text-afreqa-silver"
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{inq.isReplied ? "Replied" : "Mark Replied"}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

