#!/usr/bin/env bash
set -euo pipefail

# ====================================================================
# Afreqa Website — Automated PostgreSQL Restore Script
# ====================================================================

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path_to_backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"
CONTAINER_NAME="${DB_CONTAINER:-afreqa-db}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_NAME="${POSTGRES_DB:-afreqa_db}"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "❌ Error: Backup file '${BACKUP_FILE}' does not exist."
    exit 1
fi

echo "⚠️  WARNING: Restoring will overwrite existing data in '${DB_NAME}'."
read -p "Are you sure you want to proceed? (y/N): " -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Operation aborted."
    exit 0
fi

echo "🔄 Restoring ${BACKUP_FILE} into ${CONTAINER_NAME}:${DB_NAME}..."
gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}"

echo "✅ Database restore completed successfully."

