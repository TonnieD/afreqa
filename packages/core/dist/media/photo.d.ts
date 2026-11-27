import type { StorageProvider } from "../storage/StorageProvider.js";
export interface ProcessedPhotoResult {
    thumbKey: string;
    mediumKey: string;
    fullKey: string;
    thumbUrl: string;
    mediumUrl: string;
    fullUrl: string;
    blurDataUrl: string;
    width: number;
    height: number;
}
export declare const ALLOWED_PHOTO_MIME_TYPES: readonly ["image/jpeg", "image/png", "image/webp", "image/avif"];
export declare const MAX_PHOTO_UPLOAD_BYTES: number;
export declare const MAX_PHOTO_INPUT_PIXELS = 40000000;
export declare const TEMP_UPLOAD_KEY_REGEX: RegExp;
export declare function isValidTempUploadKey(key: string): boolean;
export interface GalleryCapStatus {
    currentCount: number;
    maxPhotos: number;
    ratio: number;
    isNearCap: boolean;
    isAtCap: boolean;
}
export declare function getGalleryMaxPhotos(env?: NodeJS.ProcessEnv): number;
export declare function getGalleryCapStatus(currentCount: number, maxPhotos?: number): GalleryCapStatus;
/**
 * Processes an uploaded photo buffer into 3 WebP variants (400w, 1200w, 2400w)
 * plus an inline LQIP blurDataUrl. Does NOT store the original buffer to stay
 * within Vercel Blob Hobby storage and operation limits.
 */
export declare function processPhoto(buffer: Buffer, slugPrefix: string, storage: StorageProvider): Promise<ProcessedPhotoResult>;
//# sourceMappingURL=photo.d.ts.map