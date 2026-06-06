-- P0 security fix — make RLS actually enforced.
--
-- Root cause: the app connected as a superuser/owner, which BYPASSES RLS.
-- Fix: the application connects as the non-privileged `app` role (set in compose),
-- migrations keep running as the privileged role. This migration is idempotent and
-- safe to run on both fresh and already-deployed databases.
--
-- The `app` role's LOGIN password is set out-of-band (never in git):
--   - fresh Docker volume : infra/compose/init/01_init.sh (reads $APP_DB_PASSWORD)
--   - existing database    : one-time `ALTER ROLE app WITH LOGIN PASSWORD '<secret>'`
--   - CI / tests           : the RLS test sets a throwaway password before connecting

-- 1. Non-privileged application role (NOLOGIN here; LOGIN+password granted out-of-band).
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app') THEN
    CREATE ROLE app;
  END IF;
END
$$;

--> statement-breakpoint
-- 2. Privileges: app can read/write rows but does not own tables (so RLS always applies).
GRANT USAGE ON SCHEMA public TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app;

-- Future tables created by migrations (run as the privileged role) are auto-granted.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO app;

--> statement-breakpoint
-- 3. Force RLS (defense-in-depth: applies even if `app` ever becomes the table owner)
--    and add a WITH CHECK clause so cross-tenant INSERT/UPDATE are also rejected,
--    not just reads.
ALTER TABLE "client" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation ON "client";
CREATE POLICY tenant_isolation ON "client"
  USING      (workspace_id = current_setting('app.workspace_id', true))
  WITH CHECK (workspace_id = current_setting('app.workspace_id', true));
