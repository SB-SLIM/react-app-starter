-- Prevent duplicate client emails within the same workspace.
ALTER TABLE "client"
  ADD CONSTRAINT "client_workspace_email_unique" UNIQUE ("workspace_id", "email");
