"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMP_UPLOAD_KEY_REGEX = exports.MAX_PHOTO_INPUT_PIXELS = exports.MAX_PHOTO_UPLOAD_BYTES = exports.ALLOWED_PHOTO_MIME_TYPES = void 0;
exports.isValidTempUploadKey = isValidTempUploadKey;
exports.getGalleryMaxPhotos = getGalleryMaxPhotos;
exports.getGalleryCapStatus = getGalleryCapStatus;
exports.processPhoto = processPhoto;
const sharp_1 = __importDefault(require("sharp"));
exports.ALLOWED_PHOTO_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
];
exports.MAX_PHOTO_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
exports.MAX_PHOTO_INPUT_PIXELS = 40_000_000; // 40 MP decompression-bomb guard
exports.TEMP_UPLOAD_KEY_REGEX = /^temp\/originals\/[a-zA-Z0-9._-]+$/;
function isValidTempUploadKey(key) {
    return exports.TEMP_UPLOAD_KEY_REGEX.test(key) && !key.includes("..");
}
function getGalleryMaxPhotos(env = process.env) {
    const raw = env.GALLERY_MAX_PHOTOS;
    if (!raw)
        return 100;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 100;
}
function getGalleryCapStatus(currentCount, maxPhotos = getGalleryMaxPhotos()) {
    const safeMax = Math.max(1, maxPhotos);
    const ratio = currentCount / safeMax;
    return {
        currentCount,
        maxPhotos: safeMax,
        ratio,
        isNearCap: ratio >= 0.8 && currentCount < safeMax,
        isAtCap: currentCount >= safeMax,
    };
}
/**
 * Processes an uploaded photo buffer into 3 WebP variants (400w, 1200w, 2400w)
 * plus an inline LQIP blurDataUrl. Does NOT store the original buffer to stay
 * within Vercel Blob Hobby storage and operation limits.
 */
async function processPhoto(buffer, slugPrefix, storage) {
    const baseImage = (0, sharp_1.default)(buffer, { limitInputPixels: exports.MAX_PHOTO_INPUT_PIXELS }).rotate();
    const metadata = await baseImage.metadata();
    const width = metadata.width || 1200;
    const height = metadata.height || 800;
    const lqipBuffer = await baseImage
        .clone()
        .resize(20, 20, { fit: "inside" })
        .webp({ quality: 20 })
        .toBuffer();
    const blurDataUrl = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;
    const [thumbBuffer, mediumBuffer, fullBuffer] = await Promise.all([
        baseImage.clone().resize(400, null, { withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
        baseImage.clone().resize(1200, null, { withoutEnlargement: true }).webp({ quality: 85 }).toBuffer(),
        baseImage.clone().resize(2400, null, { withoutEnlargement: true }).webp({ quality: 88 }).toBuffer(),
    ]);
    const thumbKey = `photos/${slugPrefix}-400w.webp`;
    const mediumKey = `photos/${slugPrefix}-1200w.webp`;
    const fullKey = `photos/${slugPrefix}-2400w.webp`;
    const uploadedKeys = [];
    try {
        const [thumbRes, mediumRes, fullRes] = await Promise.all([
            storage.upload(thumbBuffer, thumbKey, "image/webp").then((r) => {
                uploadedKeys.push(r.key);
                return r;
            }),
            storage.upload(mediumBuffer, mediumKey, "image/webp").then((r) => {
                uploadedKeys.push(r.key);
                return r;
            }),
            storage.upload(fullBuffer, fullKey, "image/webp").then((r) => {
                uploadedKeys.push(r.key);
                return r;
            }),
        ]);
        return {
            thumbKey: thumbRes.key,
            mediumKey: mediumRes.key,
            fullKey: fullRes.key,
            thumbUrl: thumbRes.url,
            mediumUrl: mediumRes.url,
            fullUrl: fullRes.url,
            blurDataUrl,
            width,
            height,
        };
    }
    catch (err) {
        await Promise.allSettled(uploadedKeys.map((k) => storage.delete(k)));
        throw err;
    }
}
//# sourceMappingURL=photo.js.map