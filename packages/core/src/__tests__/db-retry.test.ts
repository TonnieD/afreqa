import { describe, it, expect, vi } from "vitest";
import {
  withColdStartRetry,
  isPreQueryConnectionError,
  isTransientReadError,
} from "../db/client.js";

describe("Neon Cold-Start Retry (Read vs Write Safety)", () => {
  it("classifies pre-query connection errors separately from mid-query timeouts", () => {
    expect(isPreQueryConnectionError({ code: "P1001" })).toBe(true);
    expect(isPreQueryConnectionError({ code: "P1002" })).toBe(true);
    expect(isPreQueryConnectionError(new Error("connect ECONNREFUSED"))).toBe(true);

    // Mid-query errors must NOT be treated as pre-query errors
    expect(isPreQueryConnectionError(new Error("connect ETIMEDOUT"))).toBe(false);
    expect(isPreQueryConnectionError({ code: "P1017" })).toBe(false);
    expect(isTransientReadError(new Error("connect ETIMEDOUT"))).toBe(true);
  });

  it("retries once on pre-query P1001 for both reads and writes", async () => {
    const readFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(Object.assign(new Error("Can't reach database server"), { code: "P1001" }))
      .mockResolvedValueOnce("read-ok");
    expect(await withColdStartRetry(readFn, { delayMs: 5, isReadOnly: true })).toBe("read-ok");
    expect(readFn).toHaveBeenCalledTimes(2);

    const writeFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(Object.assign(new Error("Can't reach database server"), { code: "P1001" }))
      .mockResolvedValueOnce("write-ok");
    expect(await withColdStartRetry(writeFn, { delayMs: 5, isReadOnly: false })).toBe("write-ok");
    expect(writeFn).toHaveBeenCalledTimes(2);
  });

  it("does NOT retry mid-query ETIMEDOUT/ECONNRESET on writes, but retries on reads", async () => {
    const writeFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("read ETIMEDOUT"));
    await expect(withColdStartRetry(writeFn, { delayMs: 5, isReadOnly: false })).rejects.toThrow("ETIMEDOUT");
    expect(writeFn).toHaveBeenCalledTimes(1);

    const readFn = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("read ETIMEDOUT"))
      .mockResolvedValueOnce("read-recovered");
    expect(await withColdStartRetry(readFn, { delayMs: 5, isReadOnly: true })).toBe("read-recovered");
    expect(readFn).toHaveBeenCalledTimes(2);
  });
});
