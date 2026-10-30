import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import {
  Users,
  MessageCircle,
  Ticket,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Plus,
  ExternalLink,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const user = await requireAuth();

  // Aggregate metrics
  let totalSubscribers = 0;
  let activeSubscribers = 0;
  let whatsappOptIns = 0;
  let totalClicks = 0;
  let activeEventsCount = 0;
  let recentClicks: Array<{
    id: string;
    placement: string;
    phaseName: string | null;
    createdAt: Date;
    event: { title: string; slug: string };
  }> = [];
  let recentAuditLogs: Array<{
    id: string;
    action: string;
    resource: string;
    userEmail: string | null;
    createdAt: Date;
  }> = [];

  try {
    const [subCount, activeCount, waCount, clickCount, eventCount, clicks, audits] =
      await Promise.all([
        db.subscriber.count(),
        db.subscriber.count({ where: { emailStatus: "ACTIVE" } }),
        db.subscriber.count({ where: { whatsappOptIn: true } }),
        db.clickEvent.count(),
        db.event.count({ where: { status: "PUBLISHED" } }),
        db.clickEvent.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { event: { select: { title: true, slug: true } } },
        }),
        db.auditLog.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            action: true,
            resource: true,
            userEmail: true,
            createdAt: true,
          },
        }),
      ]);

    totalSubscribers = subCount;
    activeSubscribers = activeCount;
    whatsappOptIns = waCount;
    totalClicks = clickCount;
    activeEventsCount = eventCount;
    recentClicks = clicks;
    recentAuditLogs = audits;
  } catch {
    // If DB is offline during build
  }

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-afreqa-teal font-bold">
              Operations Control
            </span>
            <span className="text-xs text-afreqa-silver-mid">• Nairobi GMT+3</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-afreqa-chrome-high uppercase tracking-wide">
            Welcome back, {user.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition shadow-glow-teal"
          >
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </Link>
          <Link
            href="/admin/subscribers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-afreqa-chrome-high font-bold text-xs uppercase tracking-wider transition border border-white/10"
          >
            <span>Audience CRM</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Subscribers */}
        <div className="rounded-2xl bg-afreqa-stage/80 border border-afreqa-chrome-high/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-afreqa-silver-mid mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Total Audience</span>
            <Users className="w-4 h-4 text-afreqa-teal" />
          </div>
          <div className="text-3xl font-extrabold text-afreqa-chrome-high font-display">
            {totalSubscribers}
          </div>
          <div className="text-xs text-afreqa-teal mt-1 font-mono">
            {activeSubscribers} Active ({totalSubscribers > 0 ? Math.round((activeSubscribers / totalSubscribers) * 100) : 0}%)
          </div>
        </div>

        {/* Card 2: WhatsApp Opt-ins */}
        <div className="rounded-2xl bg-afreqa-stage/80 border border-afreqa-chrome-high/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-afreqa-silver-mid mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">WhatsApp Reach</span>
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-3xl font-extrabold text-afreqa-chrome-high font-display">
            {whatsappOptIns}
          </div>
          <div className="text-xs text-afreqa-silver mt-1 font-mono">
            Direct broadcast consent
          </div>
        </div>

        {/* Card 3: Ticket Clicks */}
        <div className="rounded-2xl bg-afreqa-stage/80 border border-afreqa-chrome-high/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-afreqa-silver-mid mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">HustleSasa Leads</span>
            <Ticket className="w-4 h-4 text-afreqa-violet" />
          </div>
          <div className="text-3xl font-extrabold text-afreqa-chrome-high font-display">
            {totalClicks}
          </div>
          <div className="text-xs text-afreqa-violet mt-1 font-mono">
            Outbound ticket clicks
          </div>
        </div>

        {/* Card 4: Published Events */}
        <div className="rounded-2xl bg-afreqa-stage/80 border border-afreqa-chrome-high/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-afreqa-silver-mid mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Active Editions</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-afreqa-chrome-high font-display">
            {activeEventsCount}
          </div>
          <div className="text-xs text-amber-400 mt-1 font-mono">
            Published on live portal
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Clicks & Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Outbound Ticket Traffic Stream */}
        <div className="rounded-2xl bg-afreqa-stage/60 border border-afreqa-chrome-high/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-afreqa-chrome-high">Recent Ticket Click Stream</h3>
              <p className="text-xs text-afreqa-silver-mid">Real-time referrals directed to HustleSasa</p>
            </div>
            <Link
              href="/admin/events"
              className="text-xs font-mono text-afreqa-teal hover:underline flex items-center gap-1"
            >
              <span>View Events</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-afreqa-chrome-high/5">
            {recentClicks.length === 0 ? (
              <p className="text-xs text-afreqa-silver-mid py-6 text-center">No ticket click traffic recorded yet.</p>
            ) : (
              recentClicks.map((click) => (
                <div key={click.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="font-semibold text-afreqa-chrome-high">{click.event.title}</div>
                    <div className="text-[11px] text-afreqa-silver-mid font-mono">
                      Placement: <span className="text-afreqa-teal">{click.placement}</span>
                      {click.phaseName ? ` • ${click.phaseName}` : ""}
                    </div>
                  </div>
                  <span className="text-afreqa-silver-mid font-mono text-[11px] shrink-0">
                    {new Date(click.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Append-Only Audit Trail Preview */}
        <div className="rounded-2xl bg-afreqa-stage/60 border border-afreqa-chrome-high/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-afreqa-chrome-high">Security & Audit Activity</h3>
              <p className="text-xs text-afreqa-silver-mid">Append-only administrative operations</p>
            </div>
            <Link
              href="/admin/audit"
              className="text-xs font-mono text-afreqa-teal hover:underline flex items-center gap-1"
            >
              <span>Full Audit Log</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-afreqa-chrome-high/5">
            {recentAuditLogs.length === 0 ? (
              <p className="text-xs text-afreqa-silver-mid py-6 text-center">No recent security events.</p>
            ) : (
              recentAuditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-afreqa-teal font-bold">
                        {log.action}
                      </span>
                      <span className="text-afreqa-silver font-medium">{log.resource}</span>
                    </div>
                    <div className="text-[11px] text-afreqa-silver-mid font-mono mt-0.5">
                      By: {log.userEmail || "System"}
                    </div>
                  </div>
                  <span className="text-afreqa-silver-mid font-mono text-[11px] shrink-0">
                    {new Date(log.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

