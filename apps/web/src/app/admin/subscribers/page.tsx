import { requireAuth } from "@/lib/auth";
import { db, canExportSubscribers } from "@afreqa/core";
import { Download, Mail, MessageCircle, ShieldCheck, CheckCircle2, Clock, XCircle } from "lucide-react";

interface SubscribersPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminSubscribersPage({ searchParams }: SubscribersPageProps) {
  const user = await requireAuth("subscribers:read");
  const params = await searchParams;

  const statusFilter = typeof params.status === "string" ? params.status : undefined;
  const waFilter = params.whatsapp === "true" ? true : undefined;

  let subscribers: Array<{
    id: string;
    email: string;
    firstName: string | null;
    phoneE164: string | null;
    emailStatus: string;
    whatsappOptIn: boolean;
    interests: string[];
    source: string | null;
    createdAt: Date;
    verifiedAt: Date | null;
  }> = [];

  let totalCount = 0;
  let activeCount = 0;
  let waCount = 0;

  try {
    const whereClause: {
      emailStatus?: "ACTIVE" | "UNVERIFIED" | "UNSUBSCRIBED";
      whatsappOptIn?: boolean;
    } = {};

    if (statusFilter && ["ACTIVE", "UNVERIFIED", "UNSUBSCRIBED"].includes(statusFilter)) {
      whereClause.emailStatus = statusFilter as "ACTIVE" | "UNVERIFIED" | "UNSUBSCRIBED";
    }
    if (waFilter !== undefined) {
      whereClause.whatsappOptIn = waFilter;
    }

    const [list, total, active, wa] = await Promise.all([
      db.subscriber.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      db.subscriber.count(),
      db.subscriber.count({ where: { emailStatus: "ACTIVE" } }),
      db.subscriber.count({ where: { whatsappOptIn: true } }),
    ]);

    subscribers = list;
    totalCount = total;
    activeCount = active;
    waCount = wa;
  } catch {
    // If DB offline
  }

  const canExport = canExportSubscribers(user.role);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
            Audience CRM & Subscribers
          </h1>
          <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
            KDPA-compliant double opt-in subscriber ledger and unbundled WhatsApp contacts
          </p>
        </div>

        {canExport && (
          <a
            href="/api/admin/subscribers/export"
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-afreqa-chrome-high border border-white/15 font-bold text-xs uppercase tracking-wider transition shadow-sm"
          >
            <Download className="w-4 h-4 text-afreqa-teal" />
            <span>Export Sanitized CSV</span>
          </a>
        )}
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-afreqa-stage/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-afreqa-silver-mid font-mono uppercase">Total Subscribers</div>
            <div className="text-2xl font-bold text-afreqa-chrome-high font-display">{totalCount}</div>
          </div>
          <Mail className="w-5 h-5 text-afreqa-teal" />
        </div>

        <div className="p-4 rounded-xl bg-afreqa-stage/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-afreqa-silver-mid font-mono uppercase">Active & Verified</div>
            <div className="text-2xl font-bold text-emerald-400 font-display">{activeCount}</div>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-afreqa-stage/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-afreqa-silver-mid font-mono uppercase">WhatsApp Broadcast Opt-Ins</div>
            <div className="text-2xl font-bold text-[#25D366] font-display">{waCount}</div>
          </div>
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Mail className="w-12 h-12 text-afreqa-silver-mid mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-base text-afreqa-chrome-high">No Subscribers Found</h3>
            <p className="text-xs text-afreqa-silver-mid mt-1">
              Subscriber registrations from the public website will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-afreqa-chrome-high/10 text-afreqa-silver-mid uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Subscriber</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Phone / WhatsApp</th>
                  <th className="py-3.5 px-4">Interests</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Date Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-afreqa-chrome-high/5">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-afreqa-chrome-high">{sub.email}</div>
                      {sub.firstName && (
                        <div className="text-[11px] text-afreqa-silver-mid">{sub.firstName}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          sub.emailStatus === "ACTIVE"
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : sub.emailStatus === "UNVERIFIED"
                            ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                            : "bg-red-500/15 border border-red-500/30 text-red-400"
                        }`}
                      >
                        {sub.emailStatus === "ACTIVE" && <CheckCircle2 className="w-3 h-3" />}
                        {sub.emailStatus === "UNVERIFIED" && <Clock className="w-3 h-3" />}
                        {sub.emailStatus === "UNSUBSCRIBED" && <XCircle className="w-3 h-3" />}
                        <span>{sub.emailStatus}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {sub.phoneE164 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-afreqa-chrome-high">{sub.phoneE164}</span>
                          {sub.whatsappOptIn && (
                            <span className="px-1.5 py-0.2 rounded bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-[9px] uppercase">
                              WA Opt-In
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-afreqa-silver-mid">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {sub.interests.map((interest, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-afreqa-silver"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-afreqa-silver-mid">
                      {sub.source || "organic"}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-afreqa-silver-mid">
                      {new Date(sub.createdAt).toLocaleDateString([], { dateStyle: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

