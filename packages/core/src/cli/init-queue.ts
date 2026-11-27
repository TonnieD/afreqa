import PgBoss from "pg-boss";
import { PrismaClient } from "@prisma/client";
import { QUEUE_NAMES } from "../queue/jobs.js";

/**
 * Initializes the pg-boss schema and queues using the owner connection
 * (DIRECT_URL / DATABASE_OWNER_URL), and grants runtime DML privileges to afreqa_app.
 */
async function main() {
  const connectionString =
    process.env.DIRECT_URL || process.env.DATABASE_OWNER_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("Error: DIRECT_URL (or DATABASE_OWNER_URL / DATABASE_URL) is required.");
    process.exit(1);
  }

  console.log("🔧 Initializing pg-boss schema and queues as owner...");
  const boss = new PgBoss({
    connectionString,
    max: 2,
    migrate: true,
    supervise: false,
    schedule: false,
    application_name: "afreqa-queue-init",
  });

  await boss.start();

  for (const queueName of Object.values(QUEUE_NAMES)) {
    try {
      await boss.createQueue(queueName);
      console.log(`✅ Ensured queue: ${queueName}`);
    } catch (err) {
      console.warn(`⚠️ Queue ${queueName}:`, err instanceof Error ? err.message : String(err));
    }
  }

  await boss.stop();

  // Grant minimal runtime DML privileges on pgboss schema to afreqa_app if role exists
  const prisma = new PrismaClient({ datasources: { db: { url: connectionString } } });
  try {
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_app') THEN
          GRANT USAGE ON SCHEMA pgboss TO afreqa_app;
          GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA pgboss TO afreqa_app;
          GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA pgboss TO afreqa_app;
        END IF;
      END
      $$;
    `);
    console.log("✅ Granted runtime pgboss privileges to afreqa_app.");
  } finally {
    await prisma.$disconnect();
  }

  console.log("✨ pg-boss initialization complete.");
}

main().catch((err) => {
  console.error("queue:init failed:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
