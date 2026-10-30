import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  validateSession,
  hasPermission,
  SESSION_COOKIE_NAME,
  type AuthUser,
  type Permission,
  type Role,
} from "@afreqa/core";

export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const result = await validateSession(token);
  return result ? result.user : null;
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

