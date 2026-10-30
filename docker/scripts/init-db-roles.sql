-- ====================================================================
-- Afreqa Website — Database Roles & Append-Only Audit Log Security
-- ====================================================================

-- 1. Create the application role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_app') THEN
        CREATE ROLE afreqa_app WITH LOGIN PASSWORD 'afreqa_app_dev_password';
    END IF;
END
$$;

-- 2. Grant connection, database creation (for pg-boss queues), and schema usage
GRANT CONNECT, CREATE ON DATABASE afreqa_db TO afreqa_app;
GRANT USAGE, CREATE ON SCHEMA public TO afreqa_app;

-- 3. Configure default table privileges for new tables created by owner/postgres
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO afreqa_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO afreqa_app;

-- 4. Apply permissions to any existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO afreqa_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO afreqa_app;

-- 5. APPEND-ONLY ENFORCEMENT ON AUDIT LOG
-- Specifically revoke UPDATE and DELETE permissions from the application user on AuditLog.
-- Even if an attacker or rogue query attempts to alter the audit trail, Postgres will reject it.
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'AuditLog') THEN
        REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "AuditLog" FROM afreqa_app;
        GRANT SELECT, INSERT ON TABLE "AuditLog" TO afreqa_app;
    END IF;
END
$$;

