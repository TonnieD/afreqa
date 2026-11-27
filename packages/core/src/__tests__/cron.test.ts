import { describe, it, expect } from "vitest";
import { verifyCronSecretHeaders } from "../auth/cron.js";

function makeHeaders(map: Record<string, string>) {
  return {
    get(name: string) {
      const lower = name.toLowerCase();
      for (const [k, v] of Object.entries(map)) {
        if (k.toLowerCase() === lower) return v;
      }
      return null;
    },
  };
}

describe("Cron Endpoint Authentication (Fail-Closed & Constant-Time)", () => {
  const VALID_SECRET = "super-secret-cron-token-12345";

  it("fails closed with 503 when CRON_SECRET is unset or too short", () => {
    expect(verifyCronSecretHeaders(makeHeaders({ authorization: `Bearer ${VALID_SECRET}` }), undefined)).toEqual({
      ok: false,
      status: 503,
      error: "CRON_SECRET is not configured on the server.",
    });
    expect(verifyCronSecretHeaders(makeHeaders({ authorization: "Bearer short" }), "short")).toEqual({
      ok: false,
      status: 503,
      error: "CRON_SECRET is not configured on the server.",
    });
  });

  it("rejects missing or invalid secret headers with 401", () => {
    expect(verifyCronSecretHeaders(makeHeaders({}), VALID_SECRET)).toEqual({
      ok: false,
      status: 401,
      error: "Missing cron secret header.",
    });
    expect(verifyCronSecretHeaders(makeHeaders({ authorization: "Bearer wrong-secret-token" }), VALID_SECRET)).toEqual({
      ok: false,
      status: 401,
      error: "Invalid cron secret.",
    });
  });

  it("accepts Authorization: Bearer <CRON_SECRET> and x-cron-secret", () => {
    expect(verifyCronSecretHeaders(makeHeaders({ authorization: `Bearer ${VALID_SECRET}` }), VALID_SECRET)).toEqual({
      ok: true,
      status: 200,
    });
    expect(verifyCronSecretHeaders(makeHeaders({ "x-cron-secret": VALID_SECRET }), VALID_SECRET)).toEqual({
      ok: true,
      status: 200,
    });
  });
});
