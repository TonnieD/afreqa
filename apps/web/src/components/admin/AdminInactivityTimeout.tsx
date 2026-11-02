"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Clock, ShieldAlert, LogOut } from "lucide-react";

// 30 minutes of inactivity in milliseconds
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
// Show warning 2 minutes before logout (28 minutes)
const WARNING_THRESHOLD_MS = 28 * 60 * 1000;
const STORAGE_KEY = "afreqa_admin_last_activity";

export function AdminInactivityTimeout() {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const warningDismissedRef = useRef(false);

  const performLogout = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {
      // safe fallback
    } finally {
      router.push("/admin/login?reason=inactivity");
      router.refresh();
    }
  }, [router]);

  const updateActivity = useCallback(() => {
    const now = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, String(now));
    } catch {
      // ignore storage quota errors
    }
    setShowWarning(false);
    warningDismissedRef.current = false;
  }, []);

  useEffect(() => {
    // Initialize timestamp if absent
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }

    // Interaction events to monitor
    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];
    
    // Throttle activity updates to once every 10 seconds
    let lastRecorded = 0;
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastRecorded > 10000) {
        lastRecorded = now;
        updateActivity();
      }
    };

    events.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    // Check inactivity periodically every 5 seconds
    const intervalId = setInterval(() => {
      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      const lastActivity = lastActivityStr ? Number(lastActivityStr) : Date.now();
      const idleTime = Date.now() - lastActivity;

      if (idleTime >= INACTIVITY_TIMEOUT_MS) {
        performLogout();
      } else if (idleTime >= WARNING_THRESHOLD_MS) {
        setShowWarning(true);
        const rem = Math.max(0, Math.floor((INACTIVITY_TIMEOUT_MS - idleTime) / 1000));
        setSecondsRemaining(rem);
      } else {
        setShowWarning(false);
      }
    }, 5000);

    // Visibility change handler: check immediately when returning to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const lastActivityStr = localStorage.getItem(STORAGE_KEY);
        const lastActivity = lastActivityStr ? Number(lastActivityStr) : Date.now();
        const idleTime = Date.now() - lastActivity;

        if (idleTime >= INACTIVITY_TIMEOUT_MS) {
          performLogout();
        } else {
          updateActivity();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [performLogout, updateActivity]);

  if (!showWarning) {
    return null;
  }

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#161922] border border-amber-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in text-white"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
              Inactivity Notice
            </h4>
            <span className="text-xs font-mono font-bold text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
              {formattedTime}
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your admin session will automatically terminate in {formattedTime} due to 30 minutes of inactivity.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={updateActivity}
              className="flex-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold transition shadow"
            >
              Stay Signed In
            </button>
            <button
              type="button"
              onClick={performLogout}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
              title="Log out now"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
