-- Replace the boolean is_super_admin flag with a nullable platform_role text column.
-- Existing super admins are backfilled to 'owner' (highest platform role).
ALTER TABLE "user" ADD COLUMN "platform_role" TEXT;

UPDATE "user" SET "platform_role" = 'owner' WHERE "is_super_admin" = true;

ALTER TABLE "user" DROP COLUMN "is_super_admin";
