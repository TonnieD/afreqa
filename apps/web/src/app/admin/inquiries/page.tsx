import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { InquiriesInbox } from "@/components/admin/InquiriesInbox";

export default async function AdminInquiriesPage() {
  await requireAuth("inquiries:read");

  let inquiries: Array<{
    id: string;
    name: string;
    email: string;
    topic: string;
    message: string;
    isRead: boolean;
    isReplied: boolean;
    createdAt: Date;
  }> = [];

  try {
    inquiries = await db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Inquiries & Contact Inbox
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Review sponsorships, artist bookings, media queries, and general patron questions
        </p>
      </div>

      <InquiriesInbox initialInquiries={inquiries} />
    </div>
  );
}

