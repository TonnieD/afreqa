import { createHash, createHmac } from "node:crypto";
import { Readable } from "node:stream";
import type { StorageDriverName, StorageProvider, StorageUploadResult } from "./StorageProvider.js";

export interface R2StorageConfig {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  publicBaseUrl?: string;
}

function sha256Hex(data: Buffer | string): string {
  return createHash("sha256").update(data).digest("hex");
}

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

/**
 * @experimental UNTESTED optional Cloudflare R2 adapter (S3-compatible SigV4 over fetch).
 * Kept disabled by default (`STORAGE_DRIVER` defaults to `local` or `vercel-blob`).
 * NOTE: If R2 is ever enabled for production, replace this hand-rolled SigV4 adapter
 * with the official `@aws-sdk/client-s3` SDK for full multipart/retry/signing coverage.
 */
export class R2StorageProvider implements StorageProvider {
  readonly driver: StorageDriverName = "r2";
  private readonly accountId: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(config: R2StorageConfig = {}) {
    this.accountId = config.accountId ?? process.env.R2_ACCOUNT_ID ?? "";
    this.accessKeyId = config.accessKeyId ?? process.env.R2_ACCESS_KEY_ID ?? "";
    this.secretAccessKey = config.secretAccessKey ?? process.env.R2_SECRET_ACCESS_KEY ?? "";
    this.bucket = config.bucket ?? process.env.R2_BUCKET ?? "";
    this.publicBaseUrl = (config.publicBaseUrl ?? process.env.R2_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");

    if (!this.accountId || !this.accessKeyId || !this.secretAccessKey || !this.bucket) {
      throw new Error(
        "R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET are required when STORAGE_DRIVER=r2",
      );
    }
  }

  private endpointForKey(key: string): { url: string; host: string; canonicalUri: string } {
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

  private signHeaders(
    method: string,
    host: string,
    canonicalUri: string,
    payloadHash: string,
    extraHeaders: Record<string, string> = {},
  ): Record<string, string> {
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);
    const region = "auto";
    const service = "s3";

    const headers: Record<string, string> = {
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
    const signature = createHmac("sha256", kSigning).update(stringToSign).digest("hex");

    return {
      ...headers,
      Authorization: `AWS4-HMAC-SHA256 Credential=${this.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
    };
  }

  async upload(buffer: Buffer, key: string, mimeType = "application/octet-stream"): Promise<StorageUploadResult> {
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

  async delete(key: string): Promise<void> {
    const normalizedKey = key.replace(/^\/+/, "");
    const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
    const payloadHash = sha256Hex("");
    const headers = this.signHeaders("DELETE", host, canonicalUri, payloadHash);

    const res = await fetch(url, { method: "DELETE", headers });
    if (!res.ok && res.status !== 404) {
      throw new Error(`R2 delete failed for ${normalizedKey}: ${res.status} ${res.statusText}`);
    }
  }

  getUrl(key: string): string {
    if (/^https?:\/\//i.test(key) || key.startsWith("/")) {
      return key;
    }
    const normalized = key.replace(/^\/+/, "");
    if (!this.publicBaseUrl) {
      return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${normalized}`;
    }
    return `${this.publicBaseUrl}/${normalized}`;
  }

  async getStream(key: string): Promise<Readable> {
    const normalizedKey = key.replace(/^\/+/, "");
    const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
    const headers = this.signHeaders("GET", host, canonicalUri, sha256Hex(""));
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok || !res.body) {
      throw new Error(`R2 getStream failed for ${normalizedKey}: ${res.status} ${res.statusText}`);
    }
    return Readable.fromWeb(res.body as unknown as import("node:stream/web").ReadableStream);
  }

  async exists(key: string): Promise<boolean> {
    const normalizedKey = key.replace(/^\/+/, "");
    const { url, host, canonicalUri } = this.endpointForKey(normalizedKey);
    const headers = this.signHeaders("HEAD", host, canonicalUri, sha256Hex(""));
    const res = await fetch(url, { method: "HEAD", headers });
    return res.ok;
  }
}
