#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required."
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/cynthiamakes-$TIMESTAMP.sql"

echo "Backup created at $BACKUP_DIR/cynthiamakes-$TIMESTAMP.sql"
