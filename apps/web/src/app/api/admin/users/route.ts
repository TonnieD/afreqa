import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/csrf";
import { getSessionUser } from "@/lib/auth";
import { db, hasPermission, recordAuditLog, hashPassword, type Role } from "@afreqa/core";

export const dynamic = "force-dynamic";

const VALID_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"];

function generateSecurePassword(length = 12): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%^&*";
  const all = upper + lower + digits + symbols;
  
  let result = "";
  result += upper[Math.floor(Math.random() * upper.length)];
  result += lower[Math.floor(Math.random() * lower.length)];
  result += digits[Math.floor(Math.random() * digits.length)];
  result += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 4; i < length; i++) {
    result += all[Math.floor(Math.random() * all.length)];
  }

  return result.split("").sort(() => 0.5 - Math.random()).join("");
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Session expired or authentication missing. Please log in again." }, { status: 401 });
  }
  if (!hasPermission(user.role, "users:manage")) {
    return NextResponse.json({ error: "Unauthorized: Administrator access required" }, { status: 403 });
  }

  try {
    const users = await db.user.findMany({
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load administrative users", details: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const originError = assertSameOrigin(req);
  if (originError) return originError;
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Session expired or authentication missing. Please log in again." }, { status: 401 });
  }
  if (!hasPermission(user.role, "users:manage")) {
    return NextResponse.json({ error: "Unauthorized: Administrator access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, role, password, forcePasswordReset = true } = body;

    // Validate inputs
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Valid full name (min 2 characters) is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
    }

    if (!role || !VALID_ROLES.includes(role as Role)) {
      return NextResponse.json({ error: `Valid role is required (${VALID_ROLES.join(", ")})` }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json({ error: "A user with this email address already exists in the system" }, { status: 409 });
    }

    // Determine initial password
    const tempPassword = (password && typeof password === "string" && password.trim().length >= 8)
      ? password.trim()
      : generateSecurePassword(14);

    const passwordHash = await hashPassword(tempPassword);

    const newUser = await db.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        role: role as Role,
        passwordHash,
        mustChangePassword: Boolean(forcePasswordReset),
      },
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
      action: "USER_CREATE",
      resource: "User",
      resourceId: newUser.id,
      payload: {
        createdUserId: newUser.id,
        createdEmail: newUser.email,
        createdName: newUser.name,
        createdRole: newUser.role,
        mustChangePassword: newUser.mustChangePassword,
      },
    });

    return NextResponse.json({
      user: newUser,
      temporaryPassword: tempPassword,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create administrative user", details: String(error) }, { status: 500 });
  }
}
