import path from "path";
import fs from "fs/promises";
import { logger } from "../logger.js";

const uploadBaseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const tusDirectory = path.join(uploadBaseDir, "tus");

export function isVideoUploadEnabled(): boolean {
  return process.env.VIDEO_UPLOAD_ENABLED === "true";
}

/**
 * Checks if target directory has at least 3x the required file size in available disk space.
 */
export async function checkDiskSpaceForUpload(
  uploadSizeBytes: number
): Promise<{ allowed: boolean; availableBytes: number; requiredBytes: number }> {
  const requiredBytes = uploadSizeBytes * 3;
  try {
    await fs.mkdir(tusDirectory, { recursive: true });
    const stats = await fs.statfs(tusDirectory);
    const availableBytes = stats.bavail * stats.bsize;
    const allowed = availableBytes >= requiredBytes;

    if (!allowed) {
      logger.warn("Disk space check failed for incoming video upload", {
        availableBytes,
        requiredBytes,
        uploadSizeBytes,
      });
    }

    return { allowed, availableBytes, requiredBytes };
  } catch (err) {
    logger.warn("statfs could not be executed; assuming adequate space", { error: String(err) });
    return { allowed: true, availableBytes: Number.MAX_SAFE_INTEGER, requiredBytes };
  }
}

/**
 * Prunes abandoned Tus uploads older than maxAgeHours (default: 24h).
 */
export async function cleanAbandonedTusUploads(maxAgeHours: number = 24): Promise<number> {
  let cleanedCount = 0;
  try {
    const entries = await fs.readdir(tusDirectory, { withFileTypes: true });
    const now = Date.now();
    const thresholdMs = maxAgeHours * 60 * 60 * 1000;

    for (const entry of entries) {
      const fullPath = path.join(tusDirectory, entry.name);
      const stat = await fs.stat(fullPath);
      const ageMs = now - stat.mtimeMs;

      if (ageMs > thresholdMs) {
        await fs.rm(fullPath, { recursive: true, force: true });
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.info(`Cleaned ${cleanedCount} abandoned Tus upload parts older than ${maxAgeHours}h`);
    }
  } catch {
    // tusDirectory may not exist when VIDEO_UPLOAD_ENABLED=false
  }
  return cleanedCount;
}
