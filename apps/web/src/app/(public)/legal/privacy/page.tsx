import React from "react";
import Link from "next/link";
import { Shield, Lock, FileText, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy (KDPA 2019)",
  description: "Afreqa Kenya Data Protection Act 2019 compliance, personal data collection, processing, and rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-afreqa-teal text-xs font-mono font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          <span>KDPA 2019 Compliance</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-chrome">
          PRIVACY & DATA PROTECTION POLICY
        </h1>
        <p className="text-xs font-mono text-afreqa-silver-mid">
          Effective Date: January 1, 2026 • Governed under the Kenya Data Protection Act, 2019
        </p>
      </div>

      <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-afreqa-chrome-high/15 space-y-8 text-sm sm:text-base text-afreqa-silver leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            1. Commitment to Your Privacy
          </h2>
          <p>
            Afreqa Productions Ltd. (&ldquo;Afreqa&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to processing your personal data lawfully, fairly, and transparently in full conformity with the <strong>Kenya Data Protection Act, No. 24 of 2019 (KDPA)</strong> and the guidance issued by the Office of the Data Protection Commissioner (ODPC) Kenya.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            2. Personal Data We Collect
          </h2>
          <p>We may collect and process the following categories of data:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Identity & Contact Information:</strong> Name, email address, telephone/WhatsApp number (normalized to Kenyan E.164 standard +254).</li>
            <li><strong>Ticketing & Transaction Meta:</strong> External ticketing click tracking data, ticket tier preferences, and timestamps. (Note: Financial payment details, card numbers, and M-Pesa PINs are processed directly by authorized payment gateways such as HustleSasa or Paystack and are never stored on Afreqa servers).</li>
            <li><strong>Technical & Log Data:</strong> Masked IP addresses (cryptographically hashed with SHA-256), browser user-agent, and anonymized referral URLs for security and rate-limiting.</li>
            <li><strong>Communications:</strong> Inquiries submitted through our contact forms or direct WhatsApp channels.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            3. Legal Basis for Processing
          </h2>
          <p>Under Section 30 of the KDPA, we process your personal data under the following lawful grounds:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Consent:</strong> When you subscribe to our newsletter, opt into our WhatsApp broadcast channel, or submit a contact request. You may withdraw consent at any time.</li>
            <li><strong>Performance of Contract:</strong> To facilitate ticketing access, event communications, and gate admission verification.</li>
            <li><strong>Legitimate Interests:</strong> To protect festival infrastructure against distributed denial-of-service (DDoS) attacks, automated bot scalping, and fraudulent activities.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            4. Append-Only Audit Security
          </h2>
          <p>
            Afreqa implements rigorous technical safeguards. Our administrative operations utilize append-only audit logs where update and delete privileges are strictly revoked at the database engine level. Raw personal information (such as passwords, email addresses, and phone numbers) is automatically masked prior to audit log generation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            5. Your Rights as a Data Subject (KDPA Section 26)
          </h2>
          <p>You have the legal right to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right of Access:</strong> Request a confirmation and copy of all personal data held about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of false, inaccurate, or outdated data.</li>
            <li><strong>Right to Erasure / Deletion:</strong> Request permanent deletion of your contact records and opt-in histories.</li>
            <li><strong>Right to Object:</strong> Object to processing for direct marketing or promotional broadcasts.</li>
          </ul>
          <div className="pt-2">
            <Link
              href="/legal/data-request"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-afreqa-teal hover:underline font-bold"
            >
              <span>Submit a Formal Data Subject Request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-afreqa-chrome-high">
            6. Contact Our Data Protection Lead
          </h2>
          <p>
            For any questions or privacy inquiries, contact our Data Protection Officer at:
            <br />
            <strong className="text-afreqa-chrome-high font-mono">Email: privacy@afreqa.com</strong>
            <br />
            Address: Afreqa Productions Ltd., Nairobi, Kenya
          </p>
        </section>
      </div>
    </div>
  );
}

