"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageDriverName = getStorageDriverName;
exports.getStorageProvider = getStorageProvider;
const LocalStorageProvider_js_1 = require("./LocalStorageProvider.js");
const R2StorageProvider_js_1 = require("./R2StorageProvider.js");
const VercelBlobStorageProvider_js_1 = require("./VercelBlobStorageProvider.js");
function getStorageDriverName(env = process.env) {
    const raw = (env.STORAGE_DRIVER || "local").trim().toLowerCase();
    if (raw === "vercel-blob" || raw === "r2" || raw === "local") {
        return raw;
    }
    throw new Error(`Unsupported STORAGE_DRIVER="${raw}". Expected "local", "vercel-blob", or "r2".`);
}
let cachedProvider = null;
let cachedDriverKey = null;
function getStorageProvider() {
    const driver = getStorageDriverName();
    const cacheKey = `${driver}:${process.env.STORAGE_UPLOAD_DIR || ""}:${process.env.BLOB_PUBLIC_BASE_URL || ""}:${process.env.R2_BUCKET || ""}`;
    if (cachedProvider && cachedDriverKey === cacheKey) {
        return cachedProvider;
    }
    if (driver === "vercel-blob") {
        cachedProvider = new VercelBlobStorageProvider_js_1.VercelBlobStorageProvider();
    }
    else if (driver === "r2") {
        cachedProvider = new R2StorageProvider_js_1.R2StorageProvider();
    }
    else {
        cachedProvider = new LocalStorageProvider_js_1.LocalStorageProvider();
    }
    cachedDriverKey = cacheKey;
    return cachedProvider;
}
//# sourceMappingURL=factory.js.map