"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = hasPermission;
exports.canExportSubscribers = canExportSubscribers;
const ROLE_PERMISSIONS = {
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
function hasPermission(role, permission) {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
}
function canExportSubscribers(role) {
    return hasPermission(role, "subscribers:export");
}
//# sourceMappingURL=rbac.js.map