import { StorageProvider } from "../storage/StorageProvider.js";
export interface ProcessedPhotoResult {
    width: number;
    height: number;
    format: string;
    blurDataUrl: string;
    originalKey: string;
    originalUrl: string;
    responsiveUrls: {
        thumb: string;
        medium: string;
        full: string;
    };
}
export declare function processPhoto(buffer: Buffer, slugPrefix: string, storage?: StorageProvider): Promise<ProcessedPhotoResult>;
//# sourceMappingURL=photo.d.ts.map