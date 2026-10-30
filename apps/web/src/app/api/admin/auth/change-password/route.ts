import { NextRequest, NextResponse } from "next/server";
import {
  db,
  verifyPassword,
  hashPassword,
  recordAuditLog,
  validateSession,
  SESSION_COOKIE_NAME,
} from "@afreqa/core";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionRes = await validateSession(token);
    if (!sessionRes) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = sessionRes;
    const body = await req.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new passwords are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters long." }, { status: 400 });
    }

    const dbUser = await db.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
      },
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "PASSWORD_CHANGED",
      resource: "User",
      resourceId: user.id,
    });

    return NextResponse.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}

