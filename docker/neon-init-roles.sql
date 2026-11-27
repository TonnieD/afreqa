-- ============================================================================
-- Afreqa Website — Neon Serverless PostgreSQL Dual-Role Initialization Script
-- ============================================================================
-- Run this script in the Neon SQL Editor (as your Neon admin role, e.g. neondb_owner)
-- BEFORE and AFTER `prisma migrate deploy` + `queue:init`.
--
-- IMPORTANT: Replace <REPLACE_WITH_STRONG_OWNER_PASSWORD> and
--            <REPLACE_WITH_STRONG_APP_PASSWORD> before executing.
-- ============================================================================

-- 1. Create afreqa_owner (Migrations, DDL, pg-boss schema creation)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_owner') THEN
        CREATE ROLE afreqa_owner WITH LOGIN PASSWORD '<REPLACE_WITH_STRONG_OWNER_PASSWORD>';
    END IF;
END
$$;

-- 2. Create afreqa_app (Restricted serverless runtime role)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_app') THEN
        CREATE ROLE afreqa_app WITH LOGIN PASSWORD '<REPLACE_WITH_STRONG_APP_PASSWORD>';
    END IF;
END
$$;

-- 3. Grant schema/database permissions to afreqa_owner (DDL & migrations)
GRANT USAGE, CREATE ON SCHEMA public TO afreqa_owner;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO afreqa_owner;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO afreqa_owner;

-- 4. Grant minimal schema usage to afreqa_app (NO CREATE on public or pgboss)
GRANT USAGE ON SCHEMA public TO afreqa_app;

-- 5. Default privileges so future tables/sequences created by afreqa_owner are usable by afreqa_app
ALTER DEFAULT PRIVILEGES FOR ROLE afreqa_owner IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO afreqa_app;
ALTER DEFAULT PRIVILEGES FOR ROLE afreqa_owner IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO afreqa_app;

-- 6. Apply permissions to any existing public tables & sequences
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO afreqa_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO afreqa_app;

-- 7. pg-boss schema privileges (created by afreqa_owner during `queue:init`)
-- afreqa_app gets only runtime DML privileges on pgboss (no DDL / CREATE)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'pgboss') THEN
        GRANT USAGE ON SCHEMA pgboss TO afreqa_app;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA pgboss TO afreqa_app;
        GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA pgboss TO afreqa_app;
    END IF;
END
$$;

ALTER DEFAULT PRIVILEGES FOR ROLE afreqa_owner IN SCHEMA pgboss
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO afreqa_app;
ALTER DEFAULT PRIVILEGES FOR ROLE afreqa_owner IN SCHEMA pgboss
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO afreqa_app;

-- 8. APPEND-ONLY ENFORCEMENT ON AUDIT LOG
-- Re-run this block after initial `prisma migrate deploy` to lock down "AuditLog".
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'AuditLog') THEN
        REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "AuditLog" FROM afreqa_app;
        GRANT SELECT, INSERT ON TABLE "AuditLog" TO afreqa_app;
    END IF;
END
$$;
