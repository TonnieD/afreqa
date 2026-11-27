"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const node_stream_1 = require("node:stream");
const sharp_1 = __importDefault(require("sharp"));
const index_js_1 = require("../index.js");
class MockStorageProvider {
    driver = "vercel-blob";
    store = new Map();
    failOnKeyPattern;
    async upload(buffer, key, mimeType = "application/octet-stream") {
        if (this.failOnKeyPattern && key.includes(this.failOnKeyPattern)) {
            throw new Error(`Simulated upload failure for ${key}`);
        }
        this.store.set(key, { buffer, mimeType });
        return {
            key,
            url: this.getUrl(key),
            size: buffer.length,
            mimeType,
        };
    }
    async delete(key) {
        this.store.delete(key);
    }
    getUrl(key) {
        return `https://mock.public.blob.vercel-storage.com/${key.replace(/^\/+/, "")}`;
    }
    async getStream(key) {
        const item = this.store.get(key);
        if (!item)
            throw new Error(`Missing key: ${key}`);
        return node_stream_1.Readable.from(item.buffer);
    }
    async exists(key) {
        return this.store.has(key);
    }
}
(0, vitest_1.describe)("StorageProvider & Photo Pipeline", () => {
    (0, vitest_1.it)("processPhoto stores only 3 WebP variants (no original) and returns keys + URLs", async () => {
        const storage = new MockStorageProvider();
        const sampleJpg = await (0, sharp_1.default)({
            create: { width: 64, height: 64, channels: 3, background: { r: 235, g: 37, b: 144 } },
        })
            .jpeg()
            .toBuffer();
        const res = await (0, index_js_1.processPhoto)(sampleJpg, "test-slug", storage);
        (0, vitest_1.expect)(res.thumbKey).toBe("photos/test-slug-400w.webp");
        (0, vitest_1.expect)(res.mediumKey).toBe("photos/test-slug-1200w.webp");
        (0, vitest_1.expect)(res.fullKey).toBe("photos/test-slug-2400w.webp");
        (0, vitest_1.expect)(res.blurDataUrl.startsWith("data:image/webp;base64,")).toBe(true);
        (0, vitest_1.expect)(storage.store.size).toBe(3);
        (0, vitest_1.expect)(storage.store.has("photos/test-slug-original.webp")).toBe(false);
    });
    (0, vitest_1.it)("processPhoto cleans up partial uploads if one variant upload fails", async () => {
        const storage = new MockStorageProvider();
        storage.failOnKeyPattern = "2400w";
        const sampleJpg = await (0, sharp_1.default)({
            create: { width: 32, height: 32, channels: 3, background: { r: 10, g: 20, b: 30 } },
        })
            .jpeg()
            .toBuffer();
        await (0, vitest_1.expect)((0, index_js_1.processPhoto)(sampleJpg, "fail-slug", storage)).rejects.toThrow(/Simulated upload failure/);
        (0, vitest_1.expect)(storage.store.size).toBe(0);
    });
    (0, vitest_1.it)("resolveMediaUrl handles static paths, external URLs, and driver keys", () => {
        const mock = new MockStorageProvider();
        (0, vitest_1.expect)((0, index_js_1.resolveMediaUrl)("static:/images/afreqa-live-crowd.jpg", mock)).toBe("/images/afreqa-live-crowd.jpg");
        (0, vitest_1.expect)((0, index_js_1.resolveMediaUrl)("/images/hero.jpg", mock)).toBe("/images/hero.jpg");
        (0, vitest_1.expect)((0, index_js_1.resolveMediaUrl)("https://cdn.example.com/a.webp", mock)).toBe("https://cdn.example.com/a.webp");
        (0, vitest_1.expect)((0, index_js_1.resolveMediaUrl)("photos/abc-1200w.webp", mock)).toBe("https://mock.public.blob.vercel-storage.com/photos/abc-1200w.webp");
        const local = new index_js_1.LocalStorageProvider("./uploads", "/uploads");
        (0, vitest_1.expect)((0, index_js_1.resolveMediaUrl)("photos/abc-1200w.webp", local)).toBe("/uploads/photos/abc-1200w.webp");
    });
    (0, vitest_1.it)("getGalleryCapStatus computes normal, warning (>=80%), and blocked (>=100%) states", () => {
        (0, vitest_1.expect)((0, index_js_1.getGalleryMaxPhotos)({ GALLERY_MAX_PHOTOS: "100" })).toBe(100);
        (0, vitest_1.expect)((0, index_js_1.getGalleryMaxPhotos)({})).toBe(100);
        const normal = (0, index_js_1.getGalleryCapStatus)(50, 100);
        (0, vitest_1.expect)(normal.isNearCap).toBe(false);
        (0, vitest_1.expect)(normal.isAtCap).toBe(false);
        const warning = (0, index_js_1.getGalleryCapStatus)(80, 100);
        (0, vitest_1.expect)(warning.isNearCap).toBe(true);
        (0, vitest_1.expect)(warning.isAtCap).toBe(false);
        const blocked = (0, index_js_1.getGalleryCapStatus)(100, 100);
        (0, vitest_1.expect)(blocked.isNearCap).toBe(false);
        (0, vitest_1.expect)(blocked.isAtCap).toBe(true);
    });
    (0, vitest_1.it)("storage driver selection and provider config validation fail clearly when misconfigured", () => {
        (0, vitest_1.expect)((0, index_js_1.getStorageDriverName)({})).toBe("local");
        (0, vitest_1.expect)((0, index_js_1.getStorageDriverName)({ STORAGE_DRIVER: "vercel-blob" })).toBe("vercel-blob");
        (0, vitest_1.expect)((0, index_js_1.getStorageDriverName)({ STORAGE_DRIVER: "r2" })).toBe("r2");
        (0, vitest_1.expect)(() => (0, index_js_1.getStorageDriverName)({ STORAGE_DRIVER: "s3" })).toThrow(/Unsupported STORAGE_DRIVER/);
        (0, vitest_1.expect)(() => new index_js_1.VercelBlobStorageProvider({ token: "" })).toThrow(/BLOB_READ_WRITE_TOKEN/);
        (0, vitest_1.expect)(() => new index_js_1.R2StorageProvider({ accountId: "" })).toThrow(/R2_ACCOUNT_ID/);
    });
    (0, vitest_1.it)("isValidTempUploadKey accepts only temp/originals/<filename> without traversal", () => {
        (0, vitest_1.expect)((0, index_js_1.isValidTempUploadKey)("temp/originals/179577-uuid-photo.jpg")).toBe(true);
        (0, vitest_1.expect)((0, index_js_1.isValidTempUploadKey)("temp/originals/../secret.jpg")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.isValidTempUploadKey)("photos/abc.jpg")).toBe(false);
        (0, vitest_1.expect)((0, index_js_1.isValidTempUploadKey)("https://example.com/temp/originals/a.jpg")).toBe(false);
    });
});
//# sourceMappingURL=storage.test.js.map