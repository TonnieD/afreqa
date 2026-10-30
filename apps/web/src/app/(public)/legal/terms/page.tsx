import React from "react";
import { FileText, ShieldAlert, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Admission",
  description: "Terms and conditions of festival entry, ticket purchases via HustleSasa, and code of conduct for Afreqa events.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest">
          <FileText className="w-3.5 h-3.5" />
          <span>Festival Contract</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-chrome">
          TERMS & CONDITIONS OF ADMISSION
        </h1>
        <p className="text-xs font-mono text-afreqa-silver-mid">
          Last Updated: January 1, 2026 • Valid for all Afreqa editions in Nairobi, Kenya
        </p>
      </div>

      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-afreqa-chrome-high/15 space-y-8 text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            1. Ticketing & Entry Verification
          </h2>
          <p>
            By purchasing an Afreqa ticket via our official ticketing partner HustleSasa or presenting a ticket at gate turnstiles, you agree to be bound by these Terms of Admission. Each ticket grants a revocable license for a single individual to enter the designated festival perimeter.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Tickets must be presented as a legible digital or printed QR code.</li>
            <li>Tickets purchased from unauthorized third-party scalpers or brokers will be voided without refund.</li>
            <li>All ticket sales are non-refundable except in the event of total cancellation without rescheduling.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            2. Strict Age Requirement (18+)
          </h2>
          <p>
            Afreqa is strictly an adult festival (18 years and above). You must present valid, physical, original government-issued photo identification (Kenya National Identity Card, Valid Passport, or Valid Kenyan/Foreign Driver&apos;s License) at entry. Failure to present valid ID will result in denied entry without ticket refund.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            3. Security, Searches & Prohibited Articles
          </h2>
          <p>
            For the safety of all dancers, festival security reserves the absolute right to conduct body pat-downs, bag inspections, and metal detection screenings upon entry. Prohibited items (outside alcohol, weapons, illicit substances, fireworks, drones, laser pointers) will be permanently confiscated and turned over to law enforcement authorities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            4. Filming, Sound Recording & Photography Notice
          </h2>
          <p>
            Afreqa produces cinematic high-definition after-movies, festival photography, and live broadcasts. By entering festival grounds, you consent to being photographed, filmed, and recorded as part of the festival audience. You grant Afreqa the perpetual, royalty-free, worldwide right to use your likeness in promotional after-movies and marketing archives.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            5. Zero-Tolerance Harassment Code of Conduct
          </h2>
          <p>
            Afreqa operates an uncompromising zero-tolerance policy against sexual harassment, discrimination, hate speech, physical violence, or any behavior that compromises another dancer&apos;s physical or psychological safety. Security personnel and stage managers have full authority to immediately eject violators from the venue without refund and refer incidents to the National Police Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            6. Assumption of Risk & Health
          </h2>
          <p>
            Attendees voluntarily assume all risks inherent in outdoor electronic music festivals, including high sound pressure levels (hearing protection is recommended), strobes, atmospheric haze, lasers, and dynamic crowd environments.
          </p>
        </section>
      </div>
    </div>
  );
}

