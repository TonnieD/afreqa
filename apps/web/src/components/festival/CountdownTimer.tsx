"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string; // ISO string
  eventTitle?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function CountdownTimer({ targetDate, eventTitle = "Next Gathering" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 py-6">
        <div className="w-16 h-20 rounded-xl glass-panel animate-pulse" />
        <div className="w-16 h-20 rounded-xl glass-panel animate-pulse" />
        <div className="w-16 h-20 rounded-xl glass-panel animate-pulse" />
        <div className="w-16 h-20 rounded-xl glass-panel animate-pulse" />
      </div>
    );
  }

  if (timeLeft.isExpired) {
    return (
      <div className="py-4 px-6 rounded-2xl glass-panel border-afreqa-teal/50 shadow-glow-teal text-center">
        <p className="font-mono text-xs text-afreqa-teal uppercase tracking-widest font-semibold animate-pulse">
          Live Now
        </p>
        <h3 className="font-display font-extrabold text-2xl text-chrome mt-1">
          THE GATES ARE OPEN
        </h3>
      </div>
    );
  }

  const units = [
    { label: "DAYS", value: timeLeft.days },
    { label: "HOURS", value: timeLeft.hours },
    { label: "MINS", value: timeLeft.minutes },
    { label: "SECS", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 sm:gap-4">
        {units.map((unit, index) => (
          <div key={unit.label} className="flex items-center">
            <div className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-panel border border-afreqa-chrome-high/15 min-w-[64px] sm:min-w-[84px] shadow-metallic hover:border-afreqa-teal/40 transition-colors">
              <span className="font-display text-2xl sm:text-4xl font-black text-afreqa-chrome-high tracking-tight">
                {String(unit.value).padStart(2, "0")}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-afreqa-teal font-semibold mt-1">
                {unit.label}
              </span>
            </div>
            {index < units.length - 1 && (
              <span className="text-afreqa-silver-mid font-mono text-xl sm:text-2xl px-1 sm:px-2 animate-pulse">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-mono tracking-wider text-afreqa-silver-mid uppercase">
        Countdown to {eventTitle}
      </p>
    </div>
  );
}

