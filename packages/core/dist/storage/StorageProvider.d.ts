import { Readable } from "node:stream";
export type StorageDriverName = "local" | "vercel-blob" | "r2";
export interface StorageUploadResult {
    key: string;
    url: string;
    size: number;
    mimeType?: string;
}
export interface StorageProvider {
    readonly driver: StorageDriverName;
    upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<void>;
    getUrl(key: string): string;
    getStream(key: string): Promise<Readable>;
    exists(key: string): Promise<boolean>;
}
/**
 * Resolves a stored media reference (static path, external URL, or storage key)
 * into a browser-usable URL.
 */
export declare function resolveMediaUrl(keyOrUrl: string | null | undefined, provider?: Pick<StorageProvider, "getUrl">): string;
//# sourceMappingURL=StorageProvider.d.ts.map