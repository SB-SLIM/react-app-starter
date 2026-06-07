// EXAMPLE — this file is a template for a tenant-scoped router.
// It is NOT exported from the plugin (see index.ts).
// Copy it into your project's apps/server/src/trpc/routers/ and adapt.
//
// Pattern demonstrated:
//   - workspaceProcedure for automatic RLS enforcement
//   - Zod input/output schemas
//   - CRUD operations on a tenant-scoped table
