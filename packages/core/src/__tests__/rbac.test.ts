import { describe, it, expect } from "vitest";
import { hasPermission, canExportSubscribers, type Role, type Permission } from "../index.js";

describe("Role-Based Access Control (RBAC) Matrix", () => {
  it("grants SUPER_ADMIN full administrative privileges", () => {
    const allPermissions: Permission[] = [
      "users:manage",
      "settings:manage",
      "audit:view",
      "events:write",
      "artists:write",
      "subscribers:export",
      "subscribers:manage",
      "campaigns:manage",
      "shop:manage",
    ];

    for (const perm of allPermissions) {
      expect(hasPermission("SUPER_ADMIN", perm)).toBe(true);
    }
    expect(canExportSubscribers("SUPER_ADMIN")).toBe(true);
  });

  it("grants ADMIN operational management but restricts core user management", () => {
    expect(hasPermission("ADMIN", "events:write")).toBe(true);
    expect(hasPermission("ADMIN", "artists:write")).toBe(true);
    expect(hasPermission("ADMIN", "subscribers:export")).toBe(true);
    expect(hasPermission("ADMIN", "audit:view")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(false);
    expect(canExportSubscribers("ADMIN")).toBe(true);
  });

  it("strictly restricts EDITOR to content creation without CRM or audit access", () => {
    expect(hasPermission("EDITOR", "events:write")).toBe(true);
    expect(hasPermission("EDITOR", "artists:write")).toBe(true);
    expect(hasPermission("EDITOR", "gallery:write")).toBe(true);

    // Forbidden for EDITOR:
    expect(hasPermission("EDITOR", "subscribers:read")).toBe(false);
    expect(hasPermission("EDITOR", "subscribers:export")).toBe(false);
    expect(hasPermission("EDITOR", "audit:view")).toBe(false);
    expect(hasPermission("EDITOR", "shop:manage")).toBe(false);
    expect(canExportSubscribers("EDITOR")).toBe(false);
  });

  it("restricts SUPPORT to read-only subscribers and customer inquiries", () => {
    expect(hasPermission("SUPPORT", "subscribers:read")).toBe(true);
    expect(hasPermission("SUPPORT", "inquiries:manage")).toBe(true);

    // Forbidden for SUPPORT:
    expect(hasPermission("SUPPORT", "subscribers:export")).toBe(false);
    expect(hasPermission("SUPPORT", "events:write")).toBe(false);
    expect(hasPermission("SUPPORT", "artists:write")).toBe(false);
    expect(hasPermission("SUPPORT", "audit:view")).toBe(false);
    expect(canExportSubscribers("SUPPORT")).toBe(false);
  });
});

