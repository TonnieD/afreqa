-- ====================================================================
-- Afreqa Website — Local Docker Dual-Role & Append-Only Audit Log Setup
-- Aligned with docker/neon-init-roles.sql (afreqa_owner & afreqa_app)
-- ====================================================================

-- 1. Create afreqa_owner (Migrations & DDL)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_owner') THEN
        CREATE ROLE afreqa_owner WITH LOGIN PASSWORD 'afreqa_owner_dev_password';
    END IF;
END
$$;

-- 2. Create afreqa_app (Runtime application role)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'afreqa_app') THEN
        CREATE ROLE afreqa_app WITH LOGIN PASSWORD 'afreqa_app_dev_password';
    END IF;
END
$$;

-- 3. Grant database & schema privileges
GRANT CONNECT, CREATE ON DATABASE afreqa_db TO afreqa_owner;
GRANT USAGE, CREATE ON SCHEMA public TO afreqa_owner;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO afreqa_owner;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO afreqa_owner;

GRANT CONNECT ON DATABASE afreqa_db TO afreqa_app;
GRANT USAGE ON SCHEMA public TO afreqa_app;

-- 4. Configure default privileges for tables/sequences created by afreqa_owner or postgres
ALTER DEFAULT PRIVILEGES FOR ROLE afreqa_owner IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO afreqa_app;
ALTER DEFAULT PRIVILEGES FOR ROLE afreqa_owner IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO afreqa_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO afreqa_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO afreqa_app;

-- 5. Apply permissions to any existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO afreqa_app;
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO afreqa_app;

-- 6. pg-boss schema privileges (no DDL required by afreqa_app)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.schemata WHERE schema_name = 'pgboss') THEN
        GRANT USAGE ON SCHEMA pgboss TO afreqa_app;
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA pgboss TO afreqa_app;
        GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA pgboss TO afreqa_app;
    END IF;
END
$$;

-- 7. APPEND-ONLY ENFORCEMENT ON AUDIT LOG
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'AuditLog') THEN
        REVOKE UPDATE, DELETE, TRUNCATE ON TABLE "AuditLog" FROM afreqa_app;
        GRANT SELECT, INSERT ON TABLE "AuditLog" TO afreqa_app;
    END IF;
END
$$;
