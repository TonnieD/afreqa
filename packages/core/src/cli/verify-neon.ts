import { Prisma, PrismaClient } from "@prisma/client";
import { withColdStartRetry } from "../db/client.js";
import { getStartedBoss } from "../queue/client.js";
import { QUEUE_NAMES } from "../queue/jobs.js";

/**
 * Runnable Neon Verification Checklist Script:
 *   DATABASE_URL="<pooled afreqa_app>" pnpm --filter @afreqa/core neon:verify
 */
async function main() {
  const appUrl = process.env.DATABASE_URL;
  if (!appUrl) {
    console.error("Error: DATABASE_URL (pooled afreqa_app connection) is required.");
    process.exit(1);
  }

  console.log("🔍 Running Neon Database & Dual-Role Verification Checklist...\n");
  const appDb = new PrismaClient({ datasources: { db: { url: appUrl } } });

  try {
    // 1. Cold-start & connectivity check
    await withColdStartRetry(async () => {
      await appDb.$queryRaw`SELECT 1`;
    }, { isReadOnly: true });
    console.log("✅ [1/4] Connected via pooled DATABASE_URL (cold-start retry ready).");

    // 2. Dynamically enumerate tables from information_schema (public + pgboss)
    //    and compare against Prisma DMMF models.
    const schemaTables = await appDb.$queryRaw<Array<{ table_schema: string; table_name: string }>>`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema IN ('public', 'pgboss')
        AND table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name
    `;

    const publicTables = new Set(
      schemaTables
        .filter((t) => t.table_schema === "public" && t.table_name !== "_prisma_migrations")
        .map((t) => t.table_name),
    );
    const pgbossTables = new Set(
      schemaTables.filter((t) => t.table_schema === "pgboss").map((t) => t.table_name),
    );

    const prismaModelTables = new Set(
      Prisma.dmmf.datamodel.models.map((m) => m.dbName || m.name),
    );

    const missingInDb = [...prismaModelTables].filter((t) => !publicTables.has(t));
    const extraInDb = [...publicTables].filter((t) => !prismaModelTables.has(t));

    if (missingInDb.length > 0 || extraInDb.length > 0) {
      throw new Error(
        `Prisma/DB schema mismatch! Missing in DB: [${missingInDb.join(", ")}]; Extra in DB: [${extraInDb.join(", ")}]`,
      );
    }

    if (pgbossTables.size === 0) {
      throw new Error("No tables found in pgboss schema. Run `pnpm --filter @afreqa/core queue:init`.");
    }

    // Verify afreqa_app can SELECT from every enumerated public and pgboss table
    for (const table of publicTables) {
      await appDb.$queryRawUnsafe(`SELECT 1 FROM "public"."${table}" LIMIT 1`);
    }
    for (const table of pgbossTables) {
      await appDb.$queryRawUnsafe(`SELECT 1 FROM "pgboss"."${table}" LIMIT 1`);
    }

    console.log(
      `✅ [2/4] afreqa_app verified SELECT access across all ${publicTables.size} Prisma public tables and ${pgbossTables.size} pgboss tables.`,
    );

    // 3. Append-only AuditLog enforcement check (must DENY UPDATE, DELETE, TRUNCATE)
    const inserted = await appDb.auditLog.create({
      data: {
        action: "NEON_VERIFY_CHECK",
        resource: "AuditLog",
        payloadJson: JSON.stringify({ check: "append-only" }),
      },
    });

    let updateBlocked = false;
    try {
      await appDb.$executeRawUnsafe(
        `UPDATE "AuditLog" SET "action" = 'TAMPERED' WHERE "id" = $1`,
        inserted.id,
      );
    } catch {
      updateBlocked = true;
    }

    let deleteBlocked = false;
    try {
      await appDb.$executeRawUnsafe(`DELETE FROM "AuditLog" WHERE "id" = $1`, inserted.id);
    } catch {
      deleteBlocked = true;
    }

    let truncateBlocked = false;
    try {
      await appDb.$executeRawUnsafe(`TRUNCATE TABLE "AuditLog"`);
    } catch {
      truncateBlocked = true;
    }

    if (!updateBlocked || !deleteBlocked || !truncateBlocked) {
      throw new Error(
        `AuditLog append-only check FAILED (updateBlocked=${updateBlocked}, deleteBlocked=${deleteBlocked}, truncateBlocked=${truncateBlocked}). Run \`pnpm --filter @afreqa/core audit:lock\`.`,
      );
    }
    console.log("✅ [3/4] afreqa_app can INSERT into AuditLog and is DENIED UPDATE, DELETE, and TRUNCATE.");

    // 4. Legacy [VENDOR APPLICATION] migration & pg-boss roundtrip check
    const legacyRows = await appDb.contactMessage.count({
      where: { message: { startsWith: "[VENDOR APPLICATION]" } },
    });
    if (legacyRows > 0) {
      throw new Error(`Found ${legacyRows} unmigrated [VENDOR APPLICATION] rows.`);
    }

    const boss = await getStartedBoss();
    const jobId = await boss.send(QUEUE_NAMES.EMAIL_VERIFICATION, {
      subscriberId: "neon-verify-dry-run",
      email: "verify@example.invalid",
      verifyUrl: "https://example.invalid/verify",
      tokenExpiresHours: 24,
    });
    if (jobId) {
      await boss.cancel(QUEUE_NAMES.EMAIL_VERIFICATION, jobId);
    }
    await boss.stop();
    console.log("✅ [4/4] ContactMessage VENDOR migration & pg-boss enqueue/cancel roundtrip verified.");

    console.log("\n🎉 All Neon verification checks passed!");
  } finally {
    await appDb.$disconnect();
  }
}

main().catch((err) => {
  console.error("❌ Neon verification failed:", err);
  process.exit(1);
});
