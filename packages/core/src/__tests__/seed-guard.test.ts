import { describe, it, expect } from "vitest";
import { isLocalDemoSeedAllowed } from "../db/seed-guard.js";

describe("Local Demo Admin Seed Guard", () => {
  it("refuses demo admin seeding in production even with localhost DATABASE_URL", () => {
    expect(
      isLocalDemoSeedAllowed({
        NODE_ENV: "production",
        DATABASE_URL: "postgresql://postgres:pass@localhost:5433/afreqa_db",
      })
    ).toBe(false);
  });

  it("refuses demo admin seeding when DATABASE_URL points to Neon or any remote host", () => {
    expect(
      isLocalDemoSeedAllowed({
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://user:pass@ep-cool-wave-1234.eu-central-1.aws.neon.tech/neondb?sslmode=require",
      })
    ).toBe(false);
    expect(
      isLocalDemoSeedAllowed({
        NODE_ENV: "development",
        DATABASE_URL: undefined,
      })
    ).toBe(false);
  });

  it("allows demo admin seeding only in non-production with localhost or Docker DB", () => {
    expect(
      isLocalDemoSeedAllowed({
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://postgres:pass@localhost:5433/afreqa_db",
      })
    ).toBe(true);
    expect(
      isLocalDemoSeedAllowed({
        NODE_ENV: "development",
        DATABASE_URL: "postgresql://postgres:pass@db:5432/afreqa_db",
      })
    ).toBe(true);
  });
});
