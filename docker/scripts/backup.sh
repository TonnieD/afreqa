#!/usr/bin/env bash
set -euo pipefail

# ====================================================================
# Afreqa Website — Automated PostgreSQL Backup Script
# ====================================================================

BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/afreqa_db_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="${DB_CONTAINER:-afreqa-db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-afreqa_db}"

echo "📦 Creating compressed database backup: ${BACKUP_FILE}..."

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Error: Container '${CONTAINER_NAME}' is not running."
    exit 1
fi

docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists | gzip > "${BACKUP_FILE}"

if [ -s "${BACKUP_FILE}" ]; then
    SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
    echo "✅ Backup successfully created: ${BACKUP_FILE} (${SIZE})"
else
    echo "❌ Backup failed or output file is empty."
    rm -f "${BACKUP_FILE}"
    exit 1
fi

