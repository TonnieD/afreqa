import { NextResponse } from "next/server";
import { db, logger } from "@afreqa/core";

export async function GET() {
  const startTime = Date.now();
  let dbStatus = "disconnected";

  try {
    // Quick ping to PostgreSQL
    await db.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (err) {
    logger.error("Health check database ping failed", err);
  }

  const responseTimeMs = Date.now() - startTime;
  const isHealthy = dbStatus === "connected";

  const payload = {
    status: isHealthy ? "ok" : "degraded",
    db: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    responseTimeMs,
    environment: process.env.NODE_ENV || "development",
  };

  return NextResponse.json(payload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

