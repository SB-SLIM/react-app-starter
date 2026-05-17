-- Enable Row-Level Security on tenant-scoped tables.
-- app.workspace_id is SET LOCAL per transaction by the tenant plugin.
-- Superusers and table owners bypass RLS by default (safe for migrations).

ALTER TABLE "client" ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON "client"
  USING (workspace_id = current_setting('app.workspace_id', true));
