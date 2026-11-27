import { after } from "next/server";
import type { NextRequest } from "next/server";
import { logger, verifyCronSecretHeaders, type CronAuthResult } from "@afreqa/core";

/**
 * Host-agnostic background task execution wrapper.
 * Uses Next.js `after()` when running inside a Next.js request lifecycle,
 * falling back to detached async execution on standalone/container runtimes.
 */
export function runAfterResponse(label: string, task: () => Promise<void>): void {
  const safeTask = async () => {
    try {
      await task();
    } catch (err) {
      logger.error(`Background task failed: ${label}`, err);
    }
  };

  try {
    after(safeTask);
  } catch {
    void safeTask();
  }
}

export function verifyCronSecret(req: NextRequest): CronAuthResult {
  return verifyCronSecretHeaders(req.headers);
}
