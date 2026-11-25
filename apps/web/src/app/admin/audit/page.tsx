import { requireAuth } from "@/lib/auth";
import { formatEatDateTime } from "@/lib/date";
import { db } from "@afreqa/core";
import { ShieldCheck, ShieldAlert, Terminal, Lock } from "lucide-react";

export default async function AdminAuditPage() {
  await requireAuth("audit:view");

  let auditLogs: Array<{
    id: string;
    userId: string | null;
    userEmail: string | null;
    action: string;
    resource: string;
    resourceId: string | null;
    payloadJson: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }> = [];

  try {
    auditLogs = await db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-afreqa-teal font-bold">
              Compliance Ledger
            </span>
            <span className="text-xs text-afreqa-silver-mid">• Append-Only</span>
            <span className="text-xs font-mono font-semibold text-afreqa-fuchsia">
              • Timezone: East Africa Time (EAT +3 / UTC+3, 24-Hour System)
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
            Security & Audit Activity Trail
          </h1>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>DB-Enforced: UPDATE & DELETE Revoked</span>
        </div>
      </div>

      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden">
        {auditLogs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <ShieldAlert className="w-12 h-12 text-afreqa-silver-mid mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-base text-afreqa-chrome-high">No Audit Logs Recorded</h3>
            <p className="text-xs text-afreqa-silver-mid mt-1">
              All staff actions, logins, CSV exports, and data modifications are logged here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/5 border-b border-afreqa-chrome-high/10 text-afreqa-silver-mid uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Timestamp (EAT 24h / UTC+3)</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Target Resource</th>
                  <th className="py-3.5 px-4">Operator</th>
                  <th className="py-3.5 px-4">Payload (PII Masked)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-afreqa-chrome-high/5">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition font-mono text-[11px]">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-afreqa-silver font-medium">
                          {formatEatDateTime(log.createdAt)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-afreqa-fuchsia/10 text-afreqa-fuchsia border border-afreqa-fuchsia/20">
                          EAT 24h
                        </span>
                      </div>
                      <div className="text-[10px] text-afreqa-silver-mid/60 font-mono mt-0.5">
                        UTC+3 (Nairobi)
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-afreqa-teal/10 border border-afreqa-teal/30 text-afreqa-teal font-bold uppercase">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-afreqa-chrome-high font-sans font-semibold">
                      {log.resource}
                      {log.resourceId ? ` (${log.resourceId.slice(0, 8)}...)` : ""}
                    </td>

                    <td className="py-3.5 px-4 text-afreqa-silver">
                      {log.userEmail || "system/unauth"}
                    </td>

                    <td className="py-3.5 px-4 text-afreqa-silver-mid max-w-xs truncate">
                      {log.payloadJson ? log.payloadJson : "—"}
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

