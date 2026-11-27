"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const cron_js_1 = require("../auth/cron.js");
function makeHeaders(map) {
    return {
        get(name) {
            const lower = name.toLowerCase();
            for (const [k, v] of Object.entries(map)) {
                if (k.toLowerCase() === lower)
                    return v;
            }
            return null;
        },
    };
}
(0, vitest_1.describe)("Cron Endpoint Authentication (Fail-Closed & Constant-Time)", () => {
    const VALID_SECRET = "super-secret-cron-token-12345";
    (0, vitest_1.it)("fails closed with 503 when CRON_SECRET is unset or too short", () => {
        (0, vitest_1.expect)((0, cron_js_1.verifyCronSecretHeaders)(makeHeaders({ authorization: `Bearer ${VALID_SECRET}` }), undefined)).toEqual({
            ok: false,
            status: 503,
            error: "CRON_SECRET is not configured on the server.",
        });
        (0, vitest_1.expect)((0, cron_js_1.verifyCronSecretHeaders)(makeHeaders({ authorization: "Bearer short" }), "short")).toEqual({
            ok: false,
            status: 503,
            error: "CRON_SECRET is not configured on the server.",
        });
    });
    (0, vitest_1.it)("rejects missing or invalid secret headers with 401", () => {
        (0, vitest_1.expect)((0, cron_js_1.verifyCronSecretHeaders)(makeHeaders({}), VALID_SECRET)).toEqual({
            ok: false,
            status: 401,
            error: "Missing cron secret header.",
        });
        (0, vitest_1.expect)((0, cron_js_1.verifyCronSecretHeaders)(makeHeaders({ authorization: "Bearer wrong-secret-token" }), VALID_SECRET)).toEqual({
            ok: false,
            status: 401,
            error: "Invalid cron secret.",
        });
    });
    (0, vitest_1.it)("accepts Authorization: Bearer <CRON_SECRET> and x-cron-secret", () => {
        (0, vitest_1.expect)((0, cron_js_1.verifyCronSecretHeaders)(makeHeaders({ authorization: `Bearer ${VALID_SECRET}` }), VALID_SECRET)).toEqual({
            ok: true,
            status: 200,
        });
        (0, vitest_1.expect)((0, cron_js_1.verifyCronSecretHeaders)(makeHeaders({ "x-cron-secret": VALID_SECRET }), VALID_SECRET)).toEqual({
            ok: true,
            status: 200,
        });
    });
});
//# sourceMappingURL=cron.test.js.map