import { Readable } from "node:stream";
export interface StorageUploadResult {
    key: string;
    url: string;
    size: number;
    mimeType?: string;
}
export interface StorageProvider {
    upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<void>;
    getUrl(key: string): string;
    getStream(key: string): Promise<Readable>;
    exists(key: string): Promise<boolean>;
}
//# sourceMappingURL=StorageProvider.d.ts.map