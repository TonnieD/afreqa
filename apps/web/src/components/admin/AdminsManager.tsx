"use client";

import React, { useState, useMemo } from "react";
import {
  UserCheck,
  UserPlus,
  Trash2,
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Check,
  Copy,
  AlertTriangle,
  Search,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import type { AuthUser, Role } from "@afreqa/core";
import { formatEatDateTime } from "@/lib/date";
import { AdminConfirmModal } from "@/components/admin/AdminConfirmModal";
import { AdminToast, type ToastMessage } from "@/components/admin/AdminToast";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  mustChangePassword: boolean;
  totpEnabled: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  _count?: {
    auditLogs: number;
    sessions: number;
  };
}

interface AdminsManagerProps {
  currentUser: AuthUser;
  initialUsers: AdminUserItem[];
}

const ROLE_DEFINITIONS: Record<
  Role,
  { label: string; badgeClass: string; description: string }
> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    badgeClass: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/40 shadow-glow-pink",
    description: "Full platform ownership, user provisioning, system logs & server configuration.",
  },
  ADMIN: {
    label: "Admin",
    badgeClass: "bg-cyan-500/15 text-cyan-300 border-cyan-500/40",
    description: "Full operational access (events, ticketing, artists, email campaigns, CRM & shop).",
  },
  EDITOR: {
    label: "Editor",
    badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
    description: "Content management only (events, lineup, playlists & media gallery).",
  },
  SUPPORT: {
    label: "Support",
    badgeClass: "bg-violet-500/15 text-violet-300 border-violet-500/40",
    description: "Inquiries inbox, CRM attendee lookups & order fulfillment.",
  },
};

export function AdminsManager({ currentUser, initialUsers }: AdminsManagerProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUserForReset, setSelectedUserForReset] = useState<AdminUserItem | null>(null);

  // Form States for Add Admin
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addRole, setAddRole] = useState<Role>("ADMIN");
  const [addPassword, setAddPassword] = useState("");
  const [addForcePasswordReset, setAddForcePasswordReset] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Temporary Credential Display Modal (after creation or reset)
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State for Reset Password
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [resetForcePassword, setResetForcePassword] = useState(true);

  // Delete Confirm Modal State
  const [userToDelete, setUserToDelete] = useState<AdminUserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Helper to generate a strong random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let pwd = "";
    for (let i = 0; i < 14; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Handler: Add Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim() || !addEmail.trim()) {
      setToast({ type: "error", message: "Name and email are required." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName.trim(),
          email: addEmail.trim(),
          role: addRole,
          password: addPassword.trim() || undefined,
          forcePasswordReset: addForcePasswordReset,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create administrator");
      }

      setUsers((prev) => [...prev, data.user]);
      setIsAddModalOpen(false);

      // Reveal credentials modal
      setCreatedCredentials({
        name: data.user.name,
        email: data.user.email,
        password: data.temporaryPassword,
      });

      // Reset form
      setAddName("");
      setAddEmail("");
      setAddRole("ADMIN");
      setAddPassword("");
      setAddForcePasswordReset(true);

      setToast({
        type: "success",
        message: `Admin account for ${data.user.name} created successfully!`,
      });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to create administrator.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Change Role
  const handleRoleChange = async (targetUser: AdminUserItem, newRole: Role) => {
    if (targetUser.role === newRole) return;

    try {
      const res = await fetch(`/api/admin/users/${targetUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to change role");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );

      setToast({
        type: "success",
        message: `Updated ${targetUser.name}'s role to ${ROLE_DEFINITIONS[newRole].label}.`,
      });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to update role.",
      });
    }
  };

  // Handler: Reset Password Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForReset) return;

    const pwd = newPasswordInput.trim() || generateRandomPassword();

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${selectedUserForReset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: pwd,
          forcePasswordReset: resetForcePassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForReset.id ? { ...u, mustChangePassword: true } : u
        )
      );

      setIsResetPasswordModalOpen(false);
      setCreatedCredentials({
        name: selectedUserForReset.name,
        email: selectedUserForReset.email,
        password: pwd,
      });

      setNewPasswordInput("");
      setResetForcePassword(true);
      setSelectedUserForReset(null);

      setToast({
        type: "success",
        message: `Password reset successfully for ${selectedUserForReset.name}.`,
      });
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to reset password.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Delete Admin Confirm
  const confirmDeleteAdmin = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete administrator");
      }

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setToast({
        type: "success",
        message: `Administrative user ${userToDelete.name} was successfully removed.`,
      });
      setUserToDelete(null);
    } catch (err: unknown) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to remove administrator.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy to clipboard helper
  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `AFREQA OPS PORTAL CREDENTIALS\nEmail: ${createdCredentials.email}\nTemporary Password: ${createdCredentials.password}\nLogin URL: ${window.location.origin}/admin/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-afreqa-teal font-bold">
              Access Control & RBAC
            </span>
            <span className="text-xs text-afreqa-silver-mid">• Super Admin Authority</span>
            <span className="text-xs font-mono font-semibold text-afreqa-fuchsia">
              • Timezone: EAT (24h UTC+3)
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
            Administrators & Operational Staff
          </h1>
          <p className="text-xs text-afreqa-silver-mid mt-1">
            Provision, manage roles, and revoke administrative access for AFREQA platform operators.
          </p>
        </div>

        <button
          onClick={() => {
            setAddPassword(generateRandomPassword());
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition shadow-glow-pink"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Admin</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white/[0.02] p-3 rounded-2xl border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-afreqa-silver-mid absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-afreqa-chrome-high/15 text-xs text-afreqa-chrome-high placeholder-afreqa-silver-mid/50 focus:outline-none focus:border-pink-500/60 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-afreqa-silver-mid font-mono shrink-0">Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-afreqa-chrome-high/15 text-xs text-afreqa-chrome-high font-mono focus:outline-none focus:border-pink-500/60"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="SUPER_ADMIN">Super Admins</option>
            <option value="ADMIN">Admins</option>
            <option value="EDITOR">Editors</option>
            <option value="SUPPORT">Support</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 border-b border-afreqa-chrome-high/10 text-afreqa-silver-mid uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">System Role</th>
                <th className="py-3.5 px-4">Security Status</th>
                <th className="py-3.5 px-4">Added (EAT 24h)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-afreqa-chrome-high/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-afreqa-silver-mid">
                    <UserIcon className="w-10 h-10 mx-auto mb-2 opacity-30 text-pink-400" />
                    <p className="font-semibold text-afreqa-chrome-high">No administrators found</p>
                    <p className="text-[11px] mt-1">Try refining your search query or role filter.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const roleDef = ROLE_DEFINITIONS[u.role];

                  return (
                    <tr
                      key={u.id}
                      className={`hover:bg-white/[0.03] transition ${
                        isCurrent ? "bg-pink-500/[0.04]" : ""
                      }`}
                    >
                      {/* Operator Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-900 to-pink-600 border border-pink-500/30 flex items-center justify-center font-bold font-mono text-xs text-white shrink-0 shadow-glow-pink">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-afreqa-chrome-high text-xs">
                                {u.name}
                              </span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-afreqa-silver-mid font-mono mt-0.5">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* System Role Selector */}
                      <td className="py-3.5 px-4">
                        {isCurrent ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider ${roleDef.badgeClass}`}
                          >
                            <Shield className="w-3 h-3" />
                            {roleDef.label}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u, e.target.value as Role)}
                              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold focus:outline-none cursor-pointer bg-black/60 transition ${roleDef.badgeClass}`}
                            >
                              <option value="ADMIN">Admin (Full Ops)</option>
                              <option value="EDITOR">Editor (Content Only)</option>
                              <option value="SUPPORT">Support (CRM/Shop)</option>
                              <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                          </div>
                        )}
                        <div className="text-[10px] text-afreqa-silver-mid/60 mt-1 max-w-xs font-sans">
                          {roleDef.description}
                        </div>
                      </td>

                      {/* Security Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {u.mustChangePassword ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-300">
                              <AlertTriangle className="w-3 h-3" />
                              Password Reset Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                              <Check className="w-3 h-3" />
                              Active & Verified
                            </span>
                          )}
                          <div className="text-[10px] text-afreqa-silver-mid font-mono">
                            Audit operations: {u._count?.auditLogs ?? 0}
                          </div>
                        </div>
                      </td>

                      {/* Added Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono text-[11px] text-afreqa-silver">
                          {formatEatDateTime(u.createdAt)}
                        </div>
                        <div className="text-[9px] font-mono font-semibold text-afreqa-fuchsia mt-0.5">
                          EAT 24h
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Reset Password */}
                          <button
                            onClick={() => {
                              setSelectedUserForReset(u);
                              setNewPasswordInput(generateRandomPassword());
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-afreqa-silver hover:text-white transition"
                            title="Reset Password"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Admin */}
                          {!isCurrent && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                              title="Revoke Admin Access"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Add New Admin */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg bg-[#140b24] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-afreqa-chrome-high">Add New Administrator</h3>
                  <p className="text-xs text-afreqa-silver-mid">Grant operational access to AFREQA platform</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-afreqa-silver-mid hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-afreqa-silver mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-afreqa-silver-mid absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Alex Kamau"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-afreqa-silver-mid/40 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-afreqa-silver mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-afreqa-silver-mid absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={addEmail}
                    onChange={(e) => setAddEmail(e.target.value)}
                    placeholder="e.g. alex@afreqa.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-afreqa-silver-mid/40 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-afreqa-silver mb-1.5">
                  Assign System Role *
                </label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as Role)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                >
                  <option value="ADMIN">ADMIN — Full Operational Access (Events, Tickets, Lineup, CRM, Shop)</option>
                  <option value="EDITOR">EDITOR — Content Only (Events, Lineup, Playlists, Gallery)</option>
                  <option value="SUPPORT">SUPPORT — Customer Support (Inbox, Subscribers, Orders)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN — Full Platform Control (Includes User Provisioning)</option>
                </select>
                <p className="text-[11px] text-pink-300/80 mt-1 font-sans">
                  {ROLE_DEFINITIONS[addRole].description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver">
                    Initial Temporary Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setAddPassword(generateRandomPassword())}
                    className="text-[10px] font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-afreqa-silver-mid absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={addPassword}
                    onChange={(e) => setAddPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-pink-300 font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="forceReset"
                  checked={addForcePasswordReset}
                  onChange={(e) => setAddForcePasswordReset(e.target.checked)}
                  className="rounded border-white/20 text-pink-600 focus:ring-0 focus:ring-offset-0 bg-black/40"
                />
                <label htmlFor="forceReset" className="text-xs text-afreqa-silver cursor-pointer select-none">
                  Require password change upon first login (Recommended)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-afreqa-silver transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition shadow-glow-pink disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Administrator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Reset Password */}
      {isResetPasswordModalOpen && selectedUserForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#140b24] border border-pink-500/30 rounded-2xl p-6 shadow-2xl relative text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-afreqa-chrome-high">Reset Admin Password</h3>
                  <p className="text-xs text-afreqa-silver-mid">For {selectedUserForReset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsResetPasswordModalOpen(false)}
                className="text-afreqa-silver-mid hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-afreqa-silver">
                    New Temporary Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPasswordInput(generateRandomPassword())}
                    className="text-[10px] font-mono text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-afreqa-silver-mid absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-pink-300 font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="resetForce"
                  checked={resetForcePassword}
                  onChange={(e) => setResetForcePassword(e.target.checked)}
                  className="rounded border-white/20 text-pink-600 focus:ring-0 focus:ring-offset-0 bg-black/40"
                />
                <label htmlFor="resetForce" className="text-xs text-afreqa-silver cursor-pointer select-none">
                  Force user to choose a personal password on login
                </label>
              </div>

              <p className="text-[11px] text-amber-300/80 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                Note: Resetting this password will immediately invalidate all active sessions for this operator.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-afreqa-silver transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Credentials Reveal Card */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-[#160d29] border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-afreqa-chrome-high">Administrator Access Generated</h3>
                <p className="text-xs text-afreqa-silver-mid">Share these temporary credentials with the operator</p>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-xl p-4 space-y-2 font-mono text-xs">
              <div>
                <span className="text-afreqa-silver-mid">Name:</span>{" "}
                <span className="text-white font-semibold">{createdCredentials.name}</span>
              </div>
              <div>
                <span className="text-afreqa-silver-mid">Email:</span>{" "}
                <span className="text-afreqa-teal font-semibold">{createdCredentials.email}</span>
              </div>
              <div>
                <span className="text-afreqa-silver-mid">Temporary Password:</span>{" "}
                <span className="text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  {createdCredentials.password}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
              <button
                onClick={handleCopyCredentials}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Credentials</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCreatedCredentials(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL: Delete Admin */}
      <AdminConfirmModal
        isOpen={!!userToDelete}
        title="Revoke Administrator Access"
        description={`Are you sure you want to remove administrator "${userToDelete?.name}" (${userToDelete?.email})? All active sessions for this account will be terminated immediately. Historical audit log trails will be preserved.`}
        confirmText="Revoke Access"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={confirmDeleteAdmin}
        onCancel={() => setUserToDelete(null)}
      />

      {/* System Toast */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
