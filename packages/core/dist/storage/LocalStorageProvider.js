"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
exports.getStorageProvider = getStorageProvider;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
class LocalStorageProvider {
    baseDir;
    publicPrefix;
    constructor(baseDir, publicPrefix) {
        this.baseDir = node_path_1.default.resolve(baseDir || process.env.STORAGE_UPLOAD_DIR || "./uploads");
        this.publicPrefix = publicPrefix || process.env.STORAGE_PUBLIC_URL_PREFIX || "/uploads";
    }
    resolveSafePath(key) {
        const safeKey = key.replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
        const resolved = node_path_1.default.resolve(this.baseDir, safeKey);
        if (!resolved.startsWith(this.baseDir)) {
            throw new Error(`Security Exception: Access denied outside upload directory for key: ${key}`);
        }
        return resolved;
    }
    async upload(buffer, key, mimeType) {
        const targetPath = this.resolveSafePath(key);
        await promises_1.default.mkdir(node_path_1.default.dirname(targetPath), { recursive: true });
        await promises_1.default.writeFile(targetPath, buffer);
        return {
            key,
            url: this.getUrl(key),
            size: buffer.length,
            mimeType,
        };
    }
    async delete(key) {
        const targetPath = this.resolveSafePath(key);
        if ((0, node_fs_1.existsSync)(targetPath)) {
            await promises_1.default.unlink(targetPath);
        }
    }
    getUrl(key) {
        const cleanKey = key.replace(/\\/g, "/").replace(/^\/+/, "");
        const cleanPrefix = this.publicPrefix.replace(/\/+$/, "");
        return `${cleanPrefix}/${cleanKey}`;
    }
    async getStream(key) {
        const targetPath = this.resolveSafePath(key);
        if (!(0, node_fs_1.existsSync)(targetPath)) {
            throw new Error(`File not found: ${key}`);
        }
        return (0, node_fs_1.createReadStream)(targetPath);
    }
    async exists(key) {
        const targetPath = this.resolveSafePath(key);
        return (0, node_fs_1.existsSync)(targetPath);
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
let storageInstance = null;
function getStorageProvider() {
    if (!storageInstance) {
        storageInstance = new LocalStorageProvider();
    }
    return storageInstance;
}
//# sourceMappingURL=LocalStorageProvider.js.map