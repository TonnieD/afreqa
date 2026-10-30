import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { CampaignComposer } from "@/components/admin/CampaignComposer";

export default async function AdminCampaignsPage() {
  await requireAuth("campaigns:manage");

  let campaigns: Array<{
    id: string;
    title: string;
    subject: string;
    status: string;
    totalRecipients: number;
    sentCount: number;
    failedCount: number;
    createdAt: Date;
  }> = [];

  try {
    campaigns = await db.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-afreqa-chrome-high/10">
        <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
          Email Campaigns & Newsletters
        </h1>
        <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
          Compose, preview, and dispatch background email broadcasts to verified subscribers
        </p>
      </div>

      <CampaignComposer initialCampaigns={campaigns} />
    </div>
  );
}

