import React from "react";
import { Cookie, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cookie Notice",
  description: "Information regarding cookie usage, local storage, and privacy on Afreqa website.",
};

export default function CookieNoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest">
          <Cookie className="w-3.5 h-3.5" />
          <span>Transparency</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-chrome">
          COOKIE & STORAGE NOTICE
        </h1>
        <p className="text-xs font-mono text-afreqa-silver-mid">
          Last Updated: January 1, 2026
        </p>
      </div>

      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-afreqa-chrome-high/15 space-y-8 text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            1. What Are Cookies?
          </h2>
          <p>
            Cookies are compact text files stored on your computer or mobile device when you browse websites. They allow web platforms to remember your preferences, secure session states, and understand user traffic flows.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            2. Minimal Cookie Policy
          </h2>
          <p>
            In alignment with privacy-by-design standards and the Kenya Data Protection Act, Afreqa employs a minimal cookie footprint. We do NOT use intrusive cross-site third-party ad tracking networks.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li><strong>Strictly Essential Cookies:</strong> Required to maintain secure administrative session logins and CSRF security tokens.</li>
            <li><strong>Performance & Rate-Limiting:</strong> Anonymized indicators used by our sliding-window rate limiters to prevent bot abuse and spam on ticketing and contact routes.</li>
            <li><strong>Functional Storage:</strong> Local storage used strictly to remember your preference for ambient festival frequency sound effects and dark theme rendering.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            3. Controlling Cookies
          </h2>
          <p>
            You can configure your browser to reject all cookies or notify you when a cookie is issued. Please note that disabling essential cookies may impact your ability to log in to the administrative portal.
          </p>
        </section>
      </div>
    </div>
  );
}

