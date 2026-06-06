#!/bin/sh
# Postgres initialisation (runs once, on first container start with an empty volume).
#
# Creates the non-privileged `app` role the SERVER connects as. The app role does NOT
# own tables and is NOT a superuser, so Postgres RLS policies always apply to it — this
# is what makes multi-tenant isolation effective. Migrations keep running as
# ${POSTGRES_USER} (privileged), so they bypass RLS and can manage every workspace.
#
# The password comes from $APP_DB_PASSWORD (set in docker-compose, sourced from
# .env / .env.production). It is never committed.
#
# For an ALREADY-running database (volume already initialised, so this script won't
# re-run), apply the equivalent once by hand:
#   psql ... -c "ALTER ROLE app WITH LOGIN PASSWORD '<secret>';"
set -e

if [ -z "${APP_DB_PASSWORD}" ]; then
  echo "FATAL: APP_DB_PASSWORD is not set — refusing to create a passwordless app role." >&2
  exit 1
fi

psql -v ON_ERROR_STOP=1 \
  -v app_pw="${APP_DB_PASSWORD}" \
  --username "${POSTGRES_USER}" \
  --dbname "${POSTGRES_DB}" <<'EOSQL'
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app') THEN
    CREATE ROLE app;
  END IF;
END
$$;
EOSQL

# Set LOGIN + password outside the DO block so psql can quote it safely (no SQL injection).
psql -v ON_ERROR_STOP=1 \
  -v app_pw="${APP_DB_PASSWORD}" \
  --username "${POSTGRES_USER}" \
  --dbname "${POSTGRES_DB}" \
  -c "ALTER ROLE app WITH LOGIN PASSWORD :'app_pw';"

# Base privileges. RLS still applies because `app` does not own the tables.
psql -v ON_ERROR_STOP=1 \
  --username "${POSTGRES_USER}" \
  --dbname "${POSTGRES_DB}" <<'EOSQL'
GRANT USAGE ON SCHEMA public TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO app;
EOSQL

echo "init: app role ready (LOGIN, non-owner — RLS enforced)"
