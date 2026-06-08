-- Prevent duplicate client emails within the same workspace.
-- First remove duplicates, keeping the oldest row (lowest created_at).
DELETE FROM "client"
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY workspace_id, email
             ORDER BY created_at
           ) AS rn
    FROM "client"
    WHERE email IS NOT NULL
  ) ranked
  WHERE rn > 1
);

ALTER TABLE "client"
  ADD CONSTRAINT "client_workspace_email_unique" UNIQUE ("workspace_id", "email");
