import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import {
  validateSession,
  hasPermission,
  SESSION_COOKIE_NAME,
  type AuthUser,
  type Permission,
  type Role,
} from "@afreqa/core";

export async function getSessionUser(req?: NextRequest): Promise<AuthUser | null> {
  let token: string | undefined;

  // 1. Direct retrieval from incoming NextRequest in Route Handlers
  if (req) {
    token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
        if (match && match[1]) {
          token = decodeURIComponent(match[1]);
        }
      }
    }
  }

  // 2. Next.js server component / server action cookies() store
  if (!token) {
    try {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // Ignore if outside cookie context
    }
  }

  if (!token) return null;

  try {
    const result = await validateSession(token);
    return result ? result.user : null;
  } catch {
    return null;
  }
}

export async function requireAuth(requiredPermission?: Permission): Promise<AuthUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (user.mustChangePassword) {
    redirect("/admin/change-password");
  }

  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    redirect("/admin?error=unauthorized");
  }

  return user;
}

export async function requireRole(allowedRoles: Role[]): Promise<AuthUser> {
  const user = await getSessionUser();

  if (!user) {
    redirect("/admin/login");
  }

  if (!allowedRoles.includes(user.role)) {
    redirect("/admin?error=unauthorized");
  }

  return user;
}

