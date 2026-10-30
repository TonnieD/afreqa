"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_js_1 = require("../index.js");
(0, vitest_1.describe)("Media Pipeline & Tus Upload Safety", () => {
    (0, vitest_1.describe)("Disk Space Check for Large Video Uploads (3x Rule)", () => {
        (0, vitest_1.it)("enforces 3x file size safety requirement", async () => {
            const fileSize = 100 * 1024 * 1024; // 100 MB
            const result = await (0, index_js_1.checkDiskSpaceForUpload)(fileSize);
            (0, vitest_1.expect)(result.requiredBytes).toBe(fileSize * 3);
            (0, vitest_1.expect)(typeof result.allowed).toBe("boolean");
            (0, vitest_1.expect)(result.availableBytes).toBeGreaterThanOrEqual(0);
        });
        (0, vitest_1.it)("calculates 3x for gigabyte scale after-movies", async () => {
            const gigaByteVideo = 1024 * 1024 * 1024; // 1 GB
            const result = await (0, index_js_1.checkDiskSpaceForUpload)(gigaByteVideo);
            (0, vitest_1.expect)(result.requiredBytes).toBe(3 * 1024 * 1024 * 1024); // 3 GB required
        });
    });
    (0, vitest_1.describe)("Abandoned Tus Uploads Cleanup Job", () => {
        (0, vitest_1.it)("runs cleanup without error on tus directory", async () => {
            const cleaned = await (0, index_js_1.cleanAbandonedTusUploads)(24);
            (0, vitest_1.expect)(typeof cleaned).toBe("number");
            (0, vitest_1.expect)(cleaned).toBeGreaterThanOrEqual(0);
        });
    });
});
//# sourceMappingURL=media.test.js.map