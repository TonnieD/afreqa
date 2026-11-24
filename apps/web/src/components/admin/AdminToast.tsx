"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id?: string;
  type: "success" | "error" | "info";
  message: string;
}

export function AdminToast({
  toast,
  onClose,
  duration = 4500,
}: {
  toast: ToastMessage | null;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, duration, onClose]);

  if (!toast) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 right-6 z-[110] max-w-sm w-full bg-[#160e29] border border-pink-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-white flex items-start gap-3"
    >
      <div
        className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
          toast.type === "success"
            ? "bg-emerald-500/20 text-emerald-400"
            : toast.type === "error"
            ? "bg-red-500/20 text-red-400"
            : "bg-pink-500/20 text-pink-400"
        }`}
      >
        {toast.type === "success" ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : toast.type === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Info className="w-5 h-5" />
        )}
      </div>

      <div className="flex-1 space-y-0.5">
        <h5 className="text-[10px] font-mono uppercase font-bold tracking-wider text-pink-400">
          {toast.type === "success" ? "System Notification" : toast.type === "error" ? "Action Notice" : "Information"}
        </h5>
        <p className="text-xs text-zinc-200 font-sans leading-snug">{toast.message}</p>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
