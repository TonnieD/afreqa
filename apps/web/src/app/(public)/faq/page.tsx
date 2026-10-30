"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, HelpCircle, Shield, AlertTriangle, ArrowRight } from "lucide-react";

interface FAQItem {
  id: string;
  category: "Tickets" | "Gate & Age" | "Venue & Travel" | "Safety & Health" | "Prohibited Items";
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "f1",
    category: "Tickets",
    question: "Where can I purchase authentic Afreqa tickets?",
    answer:
      "All official Afreqa tickets are exclusively sold online through our verified HustleSasa partner shop (https://afreqanairobi.hustlesasa.shop/). Each ticket delivers a unique, tamper-evident cryptographic QR code. We do NOT issue physical paper tickets in advance and do NOT recognize third-party unofficial resellers.",
  },
  {
    id: "f2",
    category: "Tickets",
    question: "What is your refund and cancellation policy?",
    answer:
      "Per standard event policy, all ticket sales are strictly final and non-refundable. If an event is postponed or cancelled due to force majeure, tickets will automatically remain valid for the rescheduled date or refunds will be processed via HustleSasa according to the announced organizer timeline.",
  },
  {
    id: "f3",
    category: "Tickets",
    question: "Do ticket prices increase as the event approaches?",
    answer:
      "Yes. Tickets are released in strictly capped allocations: Early Bird, Phase 1 General, and Final Release. Once an allocation sells out, the next price tier opens automatically. We strongly encourage locking in Early Bird allocations to secure the best pricing.",
  },
  {
    id: "f4",
    category: "Gate & Age",
    question: "What is the age restriction to enter Afreqa?",
    answer:
      "Afreqa is strictly an 18+ event. You MUST present an original physical government-issued identification document at the gate (Kenya National ID, Valid Passport, or Valid Driver’s License). Student IDs, birth certificates, and digital smartphone screenshots are NOT accepted by gate security under any circumstances.",
  },
  {
    id: "f5",
    category: "Gate & Age",
    question: "What time do doors open and what time is last entry?",
    answer:
      "Gates open at 18:00 EAT. Security and turnstiles operate throughout the night, with strict last entry at 02:00 EAT. Once gates close at 02:00, no further admissions will be processed even with a valid ticket.",
  },
  {
    id: "f6",
    category: "Gate & Age",
    question: "Are pass-outs (leaving and returning) allowed?",
    answer:
      "No. To maintain the highest security standard and crowd perimeter integrity, pass-outs are strictly forbidden. When your QR code is scanned and you cross the turnstiles, exiting the festival terminates your entry. Re-entry requires purchasing a new ticket if capacity allows.",
  },
  {
    id: "f7",
    category: "Venue & Travel",
    question: "Is there secure parking available at the venue?",
    answer:
      "Yes. Secure, illuminated on-site parking is available with 24/7 private security guards. However, parking capacity is limited. We strongly advocate taking Uber, Bolt, or carpooling to reduce traffic and ensure a stress-free departure.",
  },
  {
    id: "f8",
    category: "Venue & Travel",
    question: "Where is the designated Uber / Bolt pick-up zone?",
    answer:
      "There is a clearly signposted rideshare drop-off and pickup portal located at the main outer gate perimeter, well-lit with dedicated traffic marshalling to ensure fast vehicle arrivals without blocking festival access.",
  },
  {
    id: "f9",
    category: "Prohibited Items",
    question: "What items are prohibited from entering the festival grounds?",
    answer:
      "For everyone’s safety, the following are strictly banned: outside food and beverages, alcoholic drinks, illegal narcotics and substances, weapons or sharp objects of any kind, professional camera rigs with detachable lenses (unless accredited with a media press pass), drones, and laser pointers. All attendees are subject to thorough metal detection and bag screening at gate entry.",
  },
  {
    id: "f10",
    category: "Safety & Health",
    question: "Are there medical personnel on-site?",
    answer:
      "Yes. Fully equipped emergency medical tents staffed by certified paramedics and ambulance services are stationed on-site throughout the entire duration of the event. If you or a friend feel unwell, dehydrated, or overwhelmed, our medical team provides confidential, non-judgmental care.",
  },
  {
    id: "f11",
    category: "Safety & Health",
    question: "Is free drinking water available?",
    answer:
      "Yes. Free hydration stations are placed across the festival perimeter. You may bring empty reusable plastic water bottles (no glass or metal flasks) to refill freely throughout the night.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    f1: true,
    f4: true,
  });

  const categories = ["All", "Tickets", "Gate & Age", "Venue & Travel", "Safety & Health", "Prohibited Items"];

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Knowledge Base</span>
        </div>
        <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight">
          FREQUENTLY ASKED QUESTIONS
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto">
          Everything you need to know about tickets, gate admission protocols, venue transit, and festival guidelines.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g. age limit, parking, tickets, refund)..."
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#0f1117]/80 backdrop-blur-md border border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none transition-all shadow-xl"
        />
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
              selectedCategory === cat
                ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/10"
                : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="rounded-2xl bg-[#0f1117]/80 p-10 text-center border border-white/10">
            <p className="text-zinc-400 text-sm">
              No matching questions found for &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-xs font-mono text-amber-400 hover:underline font-semibold"
            >
              Reset filter
            </button>
          </div>
        ) : (
          filteredFAQs.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      {item.category}
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      {item.question}
                    </h3>
                  </div>
                  <div className="p-1 rounded-full text-zinc-400">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-white/5 font-normal">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support Callout */}
      <div className="rounded-2xl bg-[#0f1117]/80 backdrop-blur-md p-6 border border-white/10 text-center space-y-2">
        <p className="text-xs text-zinc-400 font-mono">
          Have an unlisted question about accessibility, press credentials, or brand partnerships?
        </p>
        <div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-white font-semibold transition-colors"
          >
            <span>Reach out to our operations team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

