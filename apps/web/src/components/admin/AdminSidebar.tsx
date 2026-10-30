"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Mail,
  MessageSquare,
  Image as ImageIcon,
  ShoppingBag,
  ShieldAlert,
  ArrowUpRight,
  LogOut,
} from "lucide-react";
import type { AuthUser } from "@afreqa/core";

interface AdminSidebarProps {
  user: AuthUser;
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Events & Phases", href: "/admin/events", icon: Calendar },
  { label: "Artists & Lineup", href: "/admin/artists", icon: Users },
  { label: "Subscribers & CRM", href: "/admin/subscribers", icon: Mail, minRole: ["SUPER_ADMIN", "ADMIN", "SUPPORT"] },
  { label: "Email Campaigns", href: "/admin/campaigns", icon: Mail, minRole: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Inquiries & Inbox", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Media & Gallery", href: "/admin/gallery", icon: ImageIcon },
  { label: "Merch & Orders", href: "/admin/shop", icon: ShoppingBag, minRole: ["SUPER_ADMIN", "ADMIN", "SUPPORT"] },
  { label: "Audit Log Trail", href: "/admin/audit", icon: ShieldAlert, minRole: ["SUPER_ADMIN", "ADMIN"] },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-afreqa-shadow border-r border-afreqa-chrome-high/10 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-afreqa-chrome-high/10 flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-afreqa-chrome-high/30">
            <Image src="/brand/logo.jpg" alt="Afreqa" fill className="object-cover" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-sm text-afreqa-chrome-high tracking-wider uppercase">
              AFREQA OPS
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-widest text-afreqa-teal">
              {user.role}
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            if (item.minRole && !item.minRole.includes(user.role)) {
              return null;
            }

            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-afreqa-teal/15 text-afreqa-teal border border-afreqa-teal/30 font-bold"
                    : "text-afreqa-silver hover:bg-white/5 hover:text-afreqa-chrome-high"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer user profile & actions */}
      <div className="p-4 border-t border-afreqa-chrome-high/10 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs">
          <div className="font-bold text-afreqa-chrome-high truncate">{user.name}</div>
          <div className="text-[11px] text-afreqa-silver-mid font-mono truncate">{user.email}</div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <Link
            href="/"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-afreqa-silver hover:text-afreqa-chrome-high text-xs font-medium transition"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

