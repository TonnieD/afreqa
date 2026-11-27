"use client";

import { useState, useMemo } from "react";
import { Mail, Check, MessageSquare, Clock, Search, Trash2, Eye, EyeOff, Store, Handshake, Calendar, Sparkles } from "lucide-react";
import { AdminConfirmModal } from "@/components/admin/AdminConfirmModal";
import { AdminToast, type ToastMessage } from "@/components/admin/AdminToast";
import { formatEatDateTime } from "@/lib/date";

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  details?: Record<string, unknown> | null;
  isRead: boolean;
  isReplied: boolean;
  createdAt: Date | string;
}

export function InquiriesInbox({ initialInquiries }: { initialInquiries: InquiryItem[] }) {
  const [inquiries, setInquiries] = useState<InquiryItem[]>(initialInquiries);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // System On-Screen Popups (Replacing native browser confirm/alert)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const unreadCount = useMemo(() => inquiries.filter((inq) => !inq.isRead).length, [inquiries]);

  // Determine classified channel: VENDOR, PARTNER, BOOKING, PRESS, GENERAL
  const getInquiryCategory = (inq: InquiryItem): "VENDOR" | "PARTNER" | "BOOKING" | "PRESS" | "GENERAL" => {
    const msg = inq.message || "";
    if (inq.topic === "VENDOR" || msg.includes("[VENDOR APPLICATION]")) {
      return "VENDOR";
    }
    if (inq.topic === "SPONSORSHIP" || msg.includes("Brand / Organization") || msg.includes("Partnership")) {
      return "PARTNER";
    }
    if (inq.topic === "BOOKING" || msg.toLowerCase().includes("vip table") || msg.toLowerCase().includes("table booking")) {
      return "BOOKING";
    }
    if (inq.topic === "PRESS" || inq.topic === "MEDIA") {
      return "PRESS";
    }
    return "GENERAL";
  };

  const toggleStatus = async (id: string, updates: { isRead?: boolean; isReplied?: boolean }) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");

      setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, ...updates } : inq)));
    } catch {
      setToast({
        type: "error",
        message: "Failed to update inquiry status. Please check database connection.",
      });
    }
  };

  const promptDeleteInquiry = (id: string, senderName: string) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Message from ${senderName}`,
      description: `Are you sure you want to permanently delete this message from ${senderName}? This operation will remove the patron inquiry from the database immediately and cannot be undone.`,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const res = await fetch(`/api/admin/inquiries/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Delete failed");
          setInquiries((prev) => prev.filter((inq) => inq.id !== id));
          setToast({
            type: "success",
            message: "Inquiry permanently deleted from database.",
          });
        } catch {
          setToast({
            type: "error",
            message: "Failed to delete inquiry from database.",
          });
        } finally {
          setIsDeleting(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const markAllAsRead = async () => {
    const unreadIds = inquiries.filter((inq) => !inq.isRead).map((inq) => inq.id);
    if (unreadIds.length === 0) return;

    for (const id of unreadIds) {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      }).catch(() => {});
    }

    setInquiries((prev) => prev.map((inq) => ({ ...inq, isRead: true })));
  };

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const cat = getInquiryCategory(inq);

      if (selectedCategory === "VENDORS" && cat !== "VENDOR") return false;
      if (selectedCategory === "PARTNERS" && cat !== "PARTNER") return false;
      if (selectedCategory === "BOOKINGS" && cat !== "BOOKING") return false;
      if (selectedCategory === "PRESS" && cat !== "PRESS") return false;
      if (selectedCategory === "GENERAL" && cat !== "GENERAL") return false;

      if (unreadOnly && inq.isRead) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = inq.name.toLowerCase().includes(q);
        const matchesEmail = inq.email.toLowerCase().includes(q);
        const matchesMsg = inq.message.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesMsg) return false;
      }

      return true;
    });
  }, [inquiries, selectedCategory, unreadOnly, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Category Pills & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "ALL", label: "All Messages" },
            { id: "VENDORS", label: "Vendors & Stalls" },
            { id: "PARTNERS", label: "Sponsors & Partners" },
            { id: "BOOKINGS", label: "VIP Bookings" },
            { id: "GENERAL", label: "General Contact" },
            { id: "PRESS", label: "Press / Media" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition border ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white border-pink-400 font-bold shadow-glow-pink"
                  : "bg-white/5 border-white/10 text-afreqa-silver hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Unread Toggle & Mark All Read */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition border flex items-center gap-1.5 ${
              unreadOnly
                ? "bg-pink-500/20 text-pink-400 border-pink-500/40 font-bold"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${unreadCount > 0 ? "bg-pink-400 animate-pulse" : "bg-zinc-500"}`} />
            <span>Unread Only ({unreadCount})</span>
          </button>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-mono text-zinc-400 hover:text-pink-400 underline underline-offset-4 transition"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by sender name, email, or message keyword..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 text-xs font-mono focus:outline-none focus:border-pink-500 transition"
        />
      </div>

      {/* Messages List */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden divide-y divide-afreqa-chrome-high/5">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare className="w-12 h-12 text-pink-400/40 mx-auto mb-3" />
            <h3 className="font-bold text-base text-afreqa-chrome-high">Inbox Zero</h3>
            <p className="text-xs text-afreqa-silver-mid mt-1">
              No messages found matching your criteria.
            </p>
          </div>
        ) : (
          filtered.map((inq) => {
            const cat = getInquiryCategory(inq);

            return (
              <div
                key={inq.id}
                className={`p-5 transition ${
                  inq.isRead ? "bg-transparent opacity-80 hover:opacity-100" : "bg-pink-500/[0.04] border-l-2 border-l-pink-500"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        inq.isRead ? "bg-zinc-600" : "bg-pink-400 shadow-[0_0_8px_#ec4899] animate-pulse"
                      }`}
                    />
                    <span className="font-bold text-sm text-white">{inq.name}</span>
                    <span className="text-xs text-zinc-400 font-mono">&lt;{inq.email}&gt;</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Channel Pill */}
                    {cat === "VENDOR" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/15 text-pink-400 border border-pink-500/30">
                        <Store className="w-3 h-3" />
                        <span>VENDOR APPLICATION</span>
                      </span>
                    )}
                    {cat === "PARTNER" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        <Handshake className="w-3 h-3" />
                        <span>SPONSOR / PARTNER</span>
                      </span>
                    )}
                    {cat === "BOOKING" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                        <Calendar className="w-3 h-3" />
                        <span>VIP BOOKING</span>
                      </span>
                    )}
                    {cat === "GENERAL" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400">
                        GENERAL
                      </span>
                    )}
                    {cat === "PRESS" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400">
                        PRESS
                      </span>
                    )}

                    <span className="text-[11px] font-mono text-zinc-500 pl-2">
                      {formatEatDateTime(inq.createdAt)} EAT (24h)
                    </span>
                  </div>
                </div>

                {/* Structured Details (if Vendor / Partner) */}
                {inq.details && Object.keys(inq.details).length > 0 && (
                  <div className="pl-4 my-2 flex flex-wrap gap-2">
                    {Object.entries(inq.details).map(([k, v]) =>
                      v ? (
                        <span
                          key={k}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
                        >
                          <span className="text-pink-400 font-bold uppercase">{k}:</span>
                          <span>{String(v)}</span>
                        </span>
                      ) : null
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="pl-4 border-l-2 border-pink-500/30 my-3 bg-white/[0.01] p-3 rounded-r-xl">
                  <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {inq.message}
                  </p>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(inq.id, { isRead: !inq.isRead })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono transition"
                    >
                      {inq.isRead ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Mark Unread</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-pink-400" />
                          <span className="text-pink-400 font-semibold">Mark Read</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleStatus(inq.id, { isReplied: !inq.isReplied })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition ${
                        inq.isReplied
                          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                          : "bg-white/5 hover:bg-white/10 text-zinc-400"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{inq.isReplied ? "Replied" : "Mark Replied"}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => promptDeleteInquiry(inq.id, inq.name)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* System Modal Popups & Notifications */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText="Permanently Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
