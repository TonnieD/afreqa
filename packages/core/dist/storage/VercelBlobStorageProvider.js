"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VercelBlobStorageProvider = void 0;
const node_stream_1 = require("node:stream");
const blob_1 = require("@vercel/blob");
class VercelBlobStorageProvider {
    driver = "vercel-blob";
    token;
    publicBaseUrl;
    constructor(config = {}) {
        this.token = config.token ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";
        this.publicBaseUrl = (config.publicBaseUrl ?? process.env.BLOB_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
        if (!this.token) {
            throw new Error("BLOB_READ_WRITE_TOKEN is required when STORAGE_DRIVER=vercel-blob");
        }
    }
    async upload(buffer, key, mimeType = "application/octet-stream") {
        const normalizedKey = key.replace(/^\/+/, "");
        const blob = await (0, blob_1.put)(normalizedKey, buffer, {
            access: "public",
            contentType: mimeType,
            token: this.token,
            addRandomSuffix: false,
            allowOverwrite: true,
        });
        return {
            key: normalizedKey,
            url: blob.url,
            size: buffer.length,
            mimeType,
        };
    }
    async delete(key) {
        const target = /^https?:\/\//i.test(key) ? key : this.getUrl(key);
        await (0, blob_1.del)(target, { token: this.token });
    }
    getUrl(key) {
        if (/^https?:\/\//i.test(key) || key.startsWith("/")) {
            return key;
        }
        const normalized = key.replace(/^\/+/, "");
        if (!this.publicBaseUrl) {
            throw new Error("BLOB_PUBLIC_BASE_URL is required to resolve Vercel Blob keys to URLs");
        }
        return `${this.publicBaseUrl}/${normalized}`;
    }
    async getStream(key) {
        const url = this.getUrl(key);
        const res = await fetch(url);
        if (!res.ok || !res.body) {
            throw new Error(`Failed to fetch blob stream for ${key}: ${res.status} ${res.statusText}`);
        }
        return node_stream_1.Readable.fromWeb(res.body);
    }
    async exists(key) {
        try {
            const target = /^https?:\/\//i.test(key) ? key : this.getUrl(key);
            await (0, blob_1.head)(target, { token: this.token });
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.VercelBlobStorageProvider = VercelBlobStorageProvider;
//# sourceMappingURL=VercelBlobStorageProvider.js.map