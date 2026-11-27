import { PrismaClient } from "@prisma/client";

/**
 * Locks down the AuditLog table for afreqa_app after migrations.
 * Connects as owner (DIRECT_URL || DATABASE_OWNER_URL || DATABASE_URL).
 */
async function main() {
  const url = process.env.DIRECT_URL || process.env.DATABASE_OWNER_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error("Error: DIRECT_URL (or DATABASE_OWNER_URL) is required to lock AuditLog.");
    process.exit(1);
  }

  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_app')
           AND EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'AuditLog') THEN
          REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "AuditLog" FROM afreqa_app;
          GRANT SELECT, INSERT ON TABLE "AuditLog" TO afreqa_app;
        END IF;
      END
      $$;
    `);
    console.log("✅ Locked AuditLog (REVOKED UPDATE, DELETE, TRUNCATE from afreqa_app).");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error("audit:lock failed:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
