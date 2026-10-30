import { describe, it, expect } from "vitest";
import { checkDiskSpaceForUpload, cleanAbandonedTusUploads } from "../index.js";

describe("Media Pipeline & Tus Upload Safety", () => {
  describe("Disk Space Check for Large Video Uploads (3x Rule)", () => {
    it("enforces 3x file size safety requirement", async () => {
      const fileSize = 100 * 1024 * 1024; // 100 MB
      const result = await checkDiskSpaceForUpload(fileSize);

      expect(result.requiredBytes).toBe(fileSize * 3);
      expect(typeof result.allowed).toBe("boolean");
      expect(result.availableBytes).toBeGreaterThanOrEqual(0);
    });

    it("calculates 3x for gigabyte scale after-movies", async () => {
      const gigaByteVideo = 1024 * 1024 * 1024; // 1 GB
      const result = await checkDiskSpaceForUpload(gigaByteVideo);

      expect(result.requiredBytes).toBe(3 * 1024 * 1024 * 1024); // 3 GB required
    });
  });

  describe("Abandoned Tus Uploads Cleanup Job", () => {
    it("runs cleanup without error on tus directory", async () => {
      const cleaned = await cleanAbandonedTusUploads(24);
      expect(typeof cleaned).toBe("number");
      expect(cleaned).toBeGreaterThanOrEqual(0);
    });
  });
});

