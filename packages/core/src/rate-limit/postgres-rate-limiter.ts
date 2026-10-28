import { db } from "../db/client.js";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInSeconds: number;
}

export async function checkRateLimit(
  key: string,
  maxPoints: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);

  try {
    // Atomic upsert with Postgres
    const entry = await db.rateLimitEntry.upsert({
      where: { key },
      create: {
        key,
        points: 1,
        resetAt,
      },
      update: {
        // If expired, reset counter and window; otherwise increment points
        points: {
          increment: 1,
        },
      },
    });

    // Check if the entry was expired before the increment
    if (entry.resetAt < now) {
      // Reset the window
      await db.rateLimitEntry.update({
        where: { key },
        data: {
          points: 1,
          resetAt,
        },
      });
      return {
        allowed: true,
        remaining: maxPoints - 1,
        resetInSeconds: windowSeconds,
      };
    }

    const resetInSeconds = Math.max(0, Math.ceil((entry.resetAt.getTime() - now.getTime()) / 1000));
    const allowed = entry.points <= maxPoints;
    const remaining = Math.max(0, maxPoints - entry.points);

    return {
      allowed,
      remaining,
      resetInSeconds,
    };
  } catch {
    // Fallback in case of temporary DB failure: allow request to avoid blocking valid traffic
    return {
      allowed: true,
      remaining: 1,
      resetInSeconds: windowSeconds,
    };
  }
}

