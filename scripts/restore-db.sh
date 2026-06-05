#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required."
  exit 1
fi

if [ -z "${1:-}" ]; then
  echo "Usage: ./scripts/restore-db.sh path/to/backup.sql"
  exit 1
fi

psql "$DATABASE_URL" < "$1"
