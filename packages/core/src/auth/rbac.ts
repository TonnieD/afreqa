import type { Role } from "../db/client.js";

export type Permission =
  | "users:manage"
  | "settings:manage"
  | "audit:view"
  | "events:read"
  | "events:write"
  | "artists:read"
  | "artists:write"
  | "gallery:read"
  | "gallery:write"
  | "subscribers:read"
  | "subscribers:export"
  | "subscribers:manage"
  | "campaigns:manage"
  | "inquiries:read"
  | "inquiries:manage"
  | "shop:read"
  | "shop:manage";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    "users:manage",
    "settings:manage",
    "audit:view",
    "events:read",
    "events:write",
    "artists:read",
    "artists:write",
    "gallery:read",
    "gallery:write",
    "subscribers:read",
    "subscribers:export",
    "subscribers:manage",
    "campaigns:manage",
    "inquiries:read",
    "inquiries:manage",
    "shop:read",
    "shop:manage",
  ],
  ADMIN: [
    "audit:view",
    "events:read",
    "events:write",
    "artists:read",
    "artists:write",
    "gallery:read",
    "gallery:write",
    "subscribers:read",
    "subscribers:export",
    "subscribers:manage",
    "campaigns:manage",
    "inquiries:read",
    "inquiries:manage",
    "shop:read",
    "shop:manage",
  ],
  EDITOR: [
    "events:read",
    "events:write",
    "artists:read",
    "artists:write",
    "gallery:read",
    "gallery:write",
  ],
  SUPPORT: [
    "events:read",
    "subscribers:read",
    "inquiries:read",
    "inquiries:manage",
    "shop:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function canExportSubscribers(role: Role): boolean {
  return hasPermission(role, "subscribers:export");
}

