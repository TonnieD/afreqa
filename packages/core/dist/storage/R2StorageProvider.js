"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2StorageProvider = void 0;
const node_crypto_1 = require("node:crypto");
const node_stream_1 = require("node:stream");
function sha256Hex(data) {
    return (0, node_crypto_1.createHash)("sha256").update(data).digest("hex");
}
function hmacSha256(key, data) {
    return (0, node_crypto_1.createHmac)("sha256", key).update(data).digest();
}
/**
 * @experimental UNTESTED optional Cloudflare R2 adapter (S3-compatible SigV4 over fetch).
 * Kept disabled by default (`STORAGE_DRIVER` defaults to `local` or `vercel-blob`).
 * NOTE: If R2 is ever enabled for production, replace this hand-rolled SigV4 adapter
 * with the official `@aws-sdk/client-s3` SDK for full multipart/retry/signing coverage.
 */
class R2StorageProvider {
    driver = "r2";
    accountId;
    accessKeyId;
    secretAccessKey;
    bucket;
    publicBaseUrl;
    constructor(config = {}) {
        this.accountId = config.accountId ?? process.env.R2_ACCOUNT_ID ?? "";
        this.accessKeyId = config.accessKeyId ?? process.env.R2_ACCESS_KEY_ID ?? "";
        this.secretAccessKey = config.secretAccessKey ?? process.env.R2_SECRET_ACCESS_KEY ?? "";
        this.bucket = config.bucket ?? process.env.R2_BUCKET ?? "";
        this.publicBaseUrl = (config.publicBaseUrl ?? process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
        if (!this.accountId || !this.accessKeyId || !this.secretAccessKey || !this.bucket) {
            throw new Error("R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET are required when STORAGE_DRIVER=r2");
        }
    }
    endpointForKey(key) {
        const normalized = key.replace(/^\/+/, "");
        const host = `${this.accountId}.r2.cloudflarestorage.com`;
        const encodedKey = normalized
            .split("/")
            .map((seg) => encodeURIComponent(seg))
            .join("/");
        const canonicalUri = `/${encodeURIComponent(this.bucket)}/${encodedKey}`;
        return {
            url: `https://${host}${canonicalUri}`,
            host,
            canonicalUri,
        };
    }
    signHeaders(method, host, canonicalUri, payloadHash, extraHeaders = {}) {
        const now = new Date();
        const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
        const dateStamp = amzDate.slice(0, 8);
        const region = "auto";
        const service = "s3";
        const headers = {
            host,
            "x-amz-content-sha256": payloadHash,
            "x-amz-date": amzDate,
            ...extraHeaders,
        };
        const sortedKeys = Object.keys(headers).sort();
        const canonicalHeaders = sortedKeys.map((k) => `${k}:${headers[k].trim()}\n`).join("");
        const signedHeaders = sortedKeys.join(";");
        const canonicalRequest = [
            method,
            canonicalUri,
            "",
            canonicalHeaders,
            signedHeaders,
            payloadHash,
        ].join("\n");
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        const stringToSign = [
            "AWS4-HMAC-SHA256",
            amzDate,
            credentialScope,
            sha256Hex(canonicalRequest),
        ].join("\n");
        const kDate = hmacSha256(`AWS4${this.secretAccessKey}`, dateStamp);
        const kRegion = hmacSha256(kDate, region);
        const kService = hmacSha256(kRegion, service);
        const kSigning = hmacSha256(kService, "aws4_request");
        const signature = (0, node_crypto_1.createHmac)("sha256", kSigning).update(stringToSign).digest("hex");
        return {
            ...headers,
            Authorization: `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
        };
    }
    async upload(buffer, key, mimeType = "application/octet-stream") {
        const normalizedKey = key.replace(/^\/+/, "");
        const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
        const payloadHash = sha256Hex(buffer);
        const headers = this.signHeaders("PUT", host, canonicalUri, payloadHash, {
            "content-type": mimeType,
        });
        const res = await fetch(url, {
            method: "PUT",
            headers,
            body: new Uint8Array(buffer),
        });
        if (!res.ok) {
            throw new Error(`R2 upload failed for ${normalizedKey}: ${res.status} ${res.statusText}`);
        }
        return {
            key: normalizedKey,
            url: this.getUrl(normalizedKey),
            size: buffer.length,
            mimeType,
        };
    }
    async delete(key) {
        const normalizedKey = key.replace(/^\/+/, "");
        const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
        const payloadHash = sha256Hex("");
        const headers = this.signHeaders("DELETE", host, canonicalUri, payloadHash);
        const res = await fetch(url, { method: "DELETE", headers });
        if (!res.ok && res.status !== 404) {
            throw new Error(`R2 delete failed for ${normalizedKey}: ${res.status} ${res.statusText}`);
        }
    }
    getUrl(key) {
        if (/^https?:\/\//i.test(key) || key.startsWith("/")) {
            return key;
        }
        const normalized = key.replace(/^\/+/, "");
        if (!this.publicBaseUrl) {
            return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${normalized}`;
        }
        return `${this.publicBaseUrl}/${normalized}`;
    }
    async getStream(key) {
        const normalizedKey = key.replace(/^\/+/, "");
        const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
        const headers = this.signHeaders("GET", host, canonicalUri, sha256Hex(""));
        const res = await fetch(url, { method: "GET", headers });
        if (!res.ok || !res.body) {
            throw new Error(`R2 getStream failed for ${normalizedKey}: ${res.status} ${res.statusText}`);
        }
        return node_stream_1.Readable.fromWeb(res.body);
    }
    async exists(key) {
        const normalizedKey = key.replace(/^\/+/, "");
        const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
        const headers = this.signHeaders("HEAD", host, canonicalUri, sha256Hex(""));
        const res = await fetch(url, { method: "HEAD", headers });
        return res.ok;
    }
}
exports.R2StorageProvider = R2StorageProvider;
//# sourceMappingURL=R2StorageProvider.js.map