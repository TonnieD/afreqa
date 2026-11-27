"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVideoUploadEnabled = isVideoUploadEnabled;
exports.checkDiskSpaceForUpload = checkDiskSpaceForUpload;
exports.cleanAbandonedTusUploads = cleanAbandonedTusUploads;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const logger_js_1 = require("../logger.js");
const uploadBaseDir = process.env.UPLOAD_DIR || path_1.default.join(process.cwd(), "uploads");
const tusDirectory = path_1.default.join(uploadBaseDir, "tus");
function isVideoUploadEnabled() {
    return process.env.VIDEO_UPLOAD_ENABLED === "true";
}
/**
 * Checks if target directory has at least 3x the required file size in available disk space.
 */
async function checkDiskSpaceForUpload(uploadSizeBytes) {
    const requiredBytes = uploadSizeBytes * 3;
    try {
        await promises_1.default.mkdir(tusDirectory, { recursive: true });
        const stats = await promises_1.default.statfs(tusDirectory);
        const availableBytes = stats.bavail * stats.bsize;
        const allowed = availableBytes >= requiredBytes;
        if (!allowed) {
            logger_js_1.logger.warn("Disk space check failed for incoming video upload", {
                availableBytes,
                requiredBytes,
                uploadSizeBytes,
            });
        }
        return { allowed, availableBytes, requiredBytes };
    }
    catch (err) {
        logger_js_1.logger.warn("statfs could not be executed; assuming adequate space", { error: String(err) });
        return { allowed: true, availableBytes: Number.MAX_SAFE_INTEGER, requiredBytes };
    }
}
/**
 * Prunes abandoned Tus uploads older than maxAgeHours (default: 24h).
 */
async function cleanAbandonedTusUploads(maxAgeHours = 24) {
    let cleanedCount = 0;
    try {
        const entries = await promises_1.default.readdir(tusDirectory, { withFileTypes: true });
        const now = Date.now();
        const thresholdMs = maxAgeHours * 60 * 60 * 1000;
        for (const entry of entries) {
            const fullPath = path_1.default.join(tusDirectory, entry.name);
            const stat = await promises_1.default.stat(fullPath);
            const ageMs = now - stat.mtimeMs;
            if (ageMs > thresholdMs) {
                await promises_1.default.rm(fullPath, { recursive: true, force: true });
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            logger_js_1.logger.info(`Cleaned ${cleanedCount} abandoned Tus upload parts older than ${maxAgeHours}h`);
        }
    }
    catch {
        // tusDirectory may not exist when VIDEO_UPLOAD_ENABLED=false
    }
    return cleanedCount;
}
//# sourceMappingURL=tus.js.map