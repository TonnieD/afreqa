import Link from "next/link";
import { db, enqueueWelcomeEmail, logger } from "@afreqa/core";

export const metadata = {
  title: "Verify Frequency | Afreqa Nairobi",
  description: "Confirm your subscription to the Afreqa Electronic Music community.",
};

interface VerifyPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyEmailPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : null;

  if (!token) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <div className="bg-canvas/60 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black text-chrome uppercase tracking-wider mb-3">
            Missing Verification Token
          </h1>
          <p className="text-silver/80 text-sm leading-relaxed mb-8">
            No valid verification token was detected in your link. Please open the confirmation link directly from the email sent to your inbox.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-chrome font-bold text-xs uppercase tracking-widest transition"
          >
            ← Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Look up subscriber with token
  const subscriber = await db.subscriber.findUnique({
    where: { verificationToken: token },
  });

  const now = new Date();
  const isExpired = subscriber?.tokenExpiresAt && subscriber.tokenExpiresAt < now;

  if (!subscriber || isExpired) {
    return (
      <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <div className="bg-canvas/60 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">⏳</span>
          </div>
          <h1 className="text-2xl font-black text-chrome uppercase tracking-wider mb-3">
            Link Expired or Invalid
          </h1>
          <p className="text-silver/80 text-sm leading-relaxed mb-8">
            This verification link has expired (cryptographic links are valid for 24 hours) or has already been used.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-aurora/10 border border-aurora/40 text-aurora hover:bg-aurora hover:text-crowd font-bold text-xs uppercase tracking-widest transition"
            >
              Subscribe Again
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-chrome font-bold text-xs uppercase tracking-widest transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Activate subscriber
  if (subscriber.emailStatus !== "ACTIVE") {
    await db.subscriber.update({
      where: { id: subscriber.id },
      data: {
        emailStatus: "ACTIVE",
        verifiedAt: now,
        verificationToken: null,
        tokenExpiresAt: null,
      },
    });

    // Enqueue welcome email in background
    try {
      await enqueueWelcomeEmail({
        subscriberId: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        vcardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://afreqa.com"}/api/whatsapp/vcard`,
        whatsappCommunityUrl: "https://chat.whatsapp.com/sample-afreqa-community",
      });
    } catch (err) {
      logger.error("Failed to enqueue welcome email upon verification", err);
    }
  }

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-canvas/80 border border-aurora/30 rounded-3xl p-8 sm:p-12 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-aurora/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-aurora/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aurora/10 border border-aurora/40 text-aurora text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-aurora animate-ping" />
            Frequency Confirmed
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-chrome uppercase tracking-tight mb-4">
            Welcome to the Inner Circle{subscriber.firstName ? `, ${subscriber.firstName}` : ""}
          </h1>

          <p className="text-silver text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-10">
            Your frequency is locked in. You are now officially cleared for early ticket releases, secret warehouse locations, and exclusive EDM drops.
          </p>

          {/* Action Step 1: Save Contact */}
          <div className="bg-crowd/80 border border-white/10 rounded-2xl p-6 mb-6 text-left hover:border-aurora/40 transition">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-aurora font-bold">Priority Step</span>
                  <span className="text-xs text-silver/60">• Crucial for WhatsApp Broadcasts</span>
                </div>
                <h3 className="text-base font-bold text-chrome">Save Afreqa to Your Phone Contacts</h3>
                <p className="text-silver/80 text-xs mt-1">
                  WhatsApp broadcast messages only arrive if you have Afreqa saved in your phone address book. Tap below to download our official contact card.
                </p>
              </div>
              <a
                href="/api/whatsapp/vcard"
                download="afreqa.vcf"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-aurora text-crowd font-black text-xs uppercase tracking-wider hover:bg-aurora/90 transition shadow-lg shadow-aurora/20"
              >
                <span>📇</span>
                Download .VCF
              </a>
            </div>
          </div>

          {/* Action Step 2: Join WhatsApp Community */}
          <div className="bg-crowd/80 border border-white/10 rounded-2xl p-6 mb-10 text-left hover:border-violet/40 transition">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-violet font-bold">Community</span>
                </div>
                <h3 className="text-base font-bold text-chrome">Join the Afreqa WhatsApp Community</h3>
                <p className="text-silver/80 text-xs mt-1">
                  Connect with Nairobi dance music enthusiasts, arrange festival carpools, and get stage time alerts.
                </p>
              </div>
              <a
                href="https://chat.whatsapp.com/sample-afreqa-community"
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-crowd font-black text-xs uppercase tracking-wider hover:opacity-90 transition shadow-lg shadow-[#25D366]/20"
              >
                <span>💬</span>
                Open WhatsApp
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/events"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-chrome font-bold text-xs uppercase tracking-widest transition"
            >
              Explore Next Editions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

