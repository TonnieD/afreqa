"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMediaUrl = resolveMediaUrl;
/**
 * Resolves a stored media reference (static path, external URL, or storage key)
 * into a browser-usable URL.
 */
function resolveMediaUrl(keyOrUrl, provider) {
    if (!keyOrUrl)
        return "";
    const trimmed = keyOrUrl.trim();
    if (!trimmed)
        return "";
    if (trimmed.startsWith("static:")) {
        const rest = trimmed.slice("static:".length);
        return rest.startsWith("/") ? rest : `/${rest}`;
    }
    if (trimmed.startsWith("/") || /^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }
    if (provider) {
        return provider.getUrl(trimmed);
    }
    const normalized = trimmed.replace(/^\/+/, "");
    const driver = (process.env.STORAGE_DRIVER || "local").toLowerCase();
    if (driver === "vercel-blob") {
        const base = (process.env.BLOB_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
        return base ? `${base}/${normalized}` : `/${normalized}`;
    }
    if (driver === "r2") {
        const base = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
        return base ? `${base}/${normalized}` : `/${normalized}`;
    }
    const prefix = (process.env.STORAGE_PUBLIC_URL_PREFIX || "/uploads").replace(/\/+$/, "");
    return `${prefix}/${normalized}`;
}
//# sourceMappingURL=StorageProvider.js.map