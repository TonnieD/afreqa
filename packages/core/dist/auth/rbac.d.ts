import type { Role } from "../db/client.js";
export type Permission = "users:manage" | "settings:manage" | "audit:view" | "events:read" | "events:write" | "artists:read" | "artists:write" | "gallery:read" | "gallery:write" | "subscribers:read" | "subscribers:export" | "subscribers:manage" | "campaigns:manage" | "inquiries:read" | "inquiries:manage" | "shop:read" | "shop:manage";
export declare function hasPermission(role: Role, permission: Permission): boolean;
export declare function canExportSubscribers(role: Role): boolean;
//# sourceMappingURL=rbac.d.ts.map