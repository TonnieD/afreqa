import { Readable } from "node:stream";
import { StorageProvider, StorageUploadResult } from "./StorageProvider.js";
export declare class LocalStorageProvider implements StorageProvider {
    private baseDir;
    private publicPrefix;
    constructor(baseDir?: string, publicPrefix?: string);
    private resolveSafePath;
    upload(buffer: Buffer, key: string, mimeType?: string): Promise<StorageUploadResult>;
    delete(key: string): Promise<void>;
    getUrl(key: string): string;
    getStream(key: string): Promise<Readable>;
    exists(key: string): Promise<boolean>;
}
export declare function getStorageProvider(): StorageProvider;
//# sourceMappingURL=LocalStorageProvider.d.ts.map