"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const client_js_1 = require("../db/client.js");
(0, vitest_1.describe)("Neon Cold-Start Retry (Read vs Write Safety)", () => {
    (0, vitest_1.it)("classifies pre-query connection errors separately from mid-query timeouts", () => {
        (0, vitest_1.expect)((0, client_js_1.isPreQueryConnectionError)({ code: "P1001" })).toBe(true);
        (0, vitest_1.expect)((0, client_js_1.isPreQueryConnectionError)({ code: "P1002" })).toBe(true);
        (0, vitest_1.expect)((0, client_js_1.isPreQueryConnectionError)(new Error("connect ECONNREFUSED"))).toBe(true);
        // Mid-query errors must NOT be treated as pre-query errors
        (0, vitest_1.expect)((0, client_js_1.isPreQueryConnectionError)(new Error("connect ETIMEDOUT"))).toBe(false);
        (0, vitest_1.expect)((0, client_js_1.isPreQueryConnectionError)({ code: "P1017" })).toBe(false);
        (0, vitest_1.expect)((0, client_js_1.isTransientReadError)(new Error("connect ETIMEDOUT"))).toBe(true);
    });
    (0, vitest_1.it)("retries once on pre-query P1001 for both reads and writes", async () => {
        const readFn = vitest_1.vi
            .fn()
            .mockRejectedValueOnce(Object.assign(new Error("Can't reach database server"), { code: "P1001" }))
            .mockResolvedValueOnce("read-ok");
        (0, vitest_1.expect)(await (0, client_js_1.withColdStartRetry)(readFn, { delayMs: 5, isReadOnly: true })).toBe("read-ok");
        (0, vitest_1.expect)(readFn).toHaveBeenCalledTimes(2);
        const writeFn = vitest_1.vi
            .fn()
            .mockRejectedValueOnce(Object.assign(new Error("Can't reach database server"), { code: "P1001" }))
            .mockResolvedValueOnce("write-ok");
        (0, vitest_1.expect)(await (0, client_js_1.withColdStartRetry)(writeFn, { delayMs: 5, isReadOnly: false })).toBe("write-ok");
        (0, vitest_1.expect)(writeFn).toHaveBeenCalledTimes(2);
    });
    (0, vitest_1.it)("does NOT retry mid-query ETIMEDOUT/ECONNRESET on writes, but retries on reads", async () => {
        const writeFn = vitest_1.vi
            .fn()
            .mockRejectedValueOnce(new Error("read ETIMEDOUT"));
        await (0, vitest_1.expect)((0, client_js_1.withColdStartRetry)(writeFn, { delayMs: 5, isReadOnly: false })).rejects.toThrow("ETIMEDOUT");
        (0, vitest_1.expect)(writeFn).toHaveBeenCalledTimes(1);
        const readFn = vitest_1.vi
            .fn()
            .mockRejectedValueOnce(new Error("read ETIMEDOUT"))
            .mockResolvedValueOnce("read-recovered");
        (0, vitest_1.expect)(await (0, client_js_1.withColdStartRetry)(readFn, { delayMs: 5, isReadOnly: true })).toBe("read-recovered");
        (0, vitest_1.expect)(readFn).toHaveBeenCalledTimes(2);
    });
});
//# sourceMappingURL=db-retry.test.js.map