import { NextRequest, NextResponse } from "next/server";
import {
  db,
  verifyPassword,
  createSession,
  checkRateLimit,
  recordAuditLog,
  SESSION_COOKIE_NAME,
  SESSION_DURATION_DAYS,
} from "@afreqa/core";

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    // 1. Rate limiting: 5 login attempts per 15 minutes per IP
    const rateCheck = await checkRateLimit(`rate:login:${rawIp}`, 5, 900).catch(() => ({
      allowed: true,
      remaining: 4,
      resetInSeconds: 900,
    }));

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = body.email ? String(body.email).toLowerCase().trim() : "";
    const password = body.password ? String(body.password) : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // 2. Lookup user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      await recordAuditLog({
        action: "LOGIN_FAILED",
        resource: "User",
        userEmail: email,
        ipAddress: rawIp,
        userAgent,
        payload: { reason: "User not found" },
      });

      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 3. Verify Argon2 password hash
    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      await recordAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "LOGIN_FAILED",
        resource: "User",
        ipAddress: rawIp,
        userAgent,
        payload: { reason: "Bad credentials" },
      });

      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // 4. Create Session in DB
    const session = await createSession(user.id, {
      userAgent,
      ipAddress: rawIp,
    });

    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      action: "LOGIN_SUCCESS",
      resource: "Session",
      resourceId: session.id,
      ipAddress: rawIp,
      userAgent,
      payload: { role: user.role },
    });

    // 5. Set session cookie
    const response = NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

