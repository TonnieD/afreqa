import crypto from "crypto";
import { db } from "../db/client.js";
import { logger } from "../logger.js";
import type { Session, Role } from "@prisma/client";

export const SESSION_COOKIE_NAME = "afreqa_session";
export const SESSION_DURATION_DAYS = 7;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  mustChangePassword: boolean;
  totpEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function createSession(
  userId: string,
  meta?: { userAgent?: string | null; ipAddress?: string | null }
): Promise<Session> {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  const session = await db.session.create({
    data: {
      sessionToken,
      userId,
      expires,
      userAgent: meta?.userAgent || null,
      ipAddress: meta?.ipAddress || null,
    },
  });

  return session;
}

export async function validateSession(
  sessionToken: string
): Promise<{ session: Session; user: AuthUser } | null> {
  if (!sessionToken || sessionToken.length < 32) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { sessionToken },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          mustChangePassword: true,
          totpEnabled: true,
          totpSecret: false,
          passwordHash: false,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  const now = new Date();
  if (session.expires < now) {
    // Delete expired session
    await db.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  // Auto-extend session if older than 1 day
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (session.createdAt < oneDayAgo) {
    await db.session
      .update({
        where: { id: session.id },
        data: {
          expires: new Date(now.getTime() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000),
        },
      })
      .catch((err) => logger.warn("Could not extend session expiry", { error: String(err) }));
  }

  return {
    session,
    user: session.user,
  };
}

export async function invalidateSession(sessionToken: string): Promise<void> {
  await db.session.delete({ where: { sessionToken } }).catch(() => {});
}

export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({ where: { userId } }).catch(() => {});
}

