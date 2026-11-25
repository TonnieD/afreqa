import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, hasPermission, recordAuditLog, hashPassword, type Role } from "@afreqa/core";

export const dynamic = "force-dynamic";

const VALID_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "users:manage")) {
    return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 403 });
  }

  const { id: targetId } = await params;

  // 1. Guard against self-deletion
  if (user.id === targetId) {
    return NextResponse.json(
      { error: "Security restriction: You cannot delete your own administrative account" },
      { status: 400 }
    );
  }

  try {
    const targetUser = await db.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Administrative user not found" }, { status: 404 });
    }

    // 2. Guard against deleting the last remaining SUPER_ADMIN
    if (targetUser.role === "SUPER_ADMIN") {
      const superAdminCount = await db.user.count({
        where: { role: "SUPER_ADMIN" },
      });

      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: "Security restriction: Cannot delete the sole remaining Super Admin account" },
          { status: 400 }
        );
      }
    }

    // 3. Delete user (sessions cascade-deleted automatically)
    await db.user.delete({
      where: { id: targetId },
    });

    // 4. Record Append-Only Audit Log
    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "USER_DELETE",
      resource: "User",
      resourceId: targetId,
      payload: {
        deletedUserId: targetId,
        deletedEmail: targetUser.email,
        deletedName: targetUser.name,
        deletedRole: targetUser.role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove administrative user", details: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const user = await getSessionUser();
  if (!user || !hasPermission(user.role, "users:manage")) {
    return NextResponse.json({ error: "Unauthorized: Super Admin access required" }, { status: 403 });
  }

  const { id: targetId } = await params;

  try {
    const targetUser = await db.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Administrative user not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, role, newPassword, forcePasswordReset } = body;

    const updateData: {
      name?: string;
      role?: Role;
      passwordHash?: string;
      mustChangePassword?: boolean;
    } = {};

    // Name update
    if (name && typeof name === "string" && name.trim().length >= 2) {
      updateData.name = name.trim();
    }

    // Role update
    if (role && VALID_ROLES.includes(role as Role)) {
      // Guard against demoting the sole SUPER_ADMIN
      if (targetUser.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
        const superAdminCount = await db.user.count({
          where: { role: "SUPER_ADMIN" },
        });

        if (superAdminCount <= 1) {
          return NextResponse.json(
            { error: "Security restriction: Cannot demote the sole remaining Super Admin" },
            { status: 400 }
          );
        }
      }
      updateData.role = role as Role;
    }

    // Password reset
    let passwordUpdated = false;
    if (newPassword && typeof newPassword === "string" && newPassword.trim().length >= 8) {
      updateData.passwordHash = await hashPassword(newPassword.trim());
      updateData.mustChangePassword = forcePasswordReset !== undefined ? Boolean(forcePasswordReset) : true;
      passwordUpdated = true;

      // Invalidate target user's active sessions to force fresh login
      await db.session.deleteMany({
        where: { userId: targetId },
      });
    } else if (forcePasswordReset !== undefined) {
      updateData.mustChangePassword = Boolean(forcePasswordReset);
    }

    const updatedUser = await db.user.update({
      where: { id: targetId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        mustChangePassword: true,
        totpEnabled: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            auditLogs: true,
            sessions: true,
          },
        },
      },
    });

    // Record Append-Only Audit Log
    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: passwordUpdated ? "USER_PASSWORD_RESET" : "USER_UPDATE",
      resource: "User",
      resourceId: targetId,
      payload: {
        targetUserId: targetId,
        targetEmail: updatedUser.email,
        updatedFields: Object.keys(updateData).filter((k) => k !== "passwordHash"),
        newRole: updatedUser.role,
        passwordResetBySuperAdmin: passwordUpdated,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update administrative user", details: String(error) }, { status: 500 });
  }
}
