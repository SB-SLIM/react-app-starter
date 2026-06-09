# Procedure conventions — inputs, outputs, errors

Read this when shaping a tRPC procedure's input/output schemas or choosing an error code.

## Pagination schemas

Cursor-based is preferred for large datasets; offset is acceptable for small/admin tables.

```ts
// Cursor-based (preferred)
const listInput = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(), // last item's id
})

const listOutput = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  })

// Offset-based (small datasets / admin tables)
const pageInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
})
```

## Zod schema conventions

```ts
// ✅ Good — explicit, no z.any()
const createClientInput = z.object({
  name: z.string().min(1).max(255).trim(),
  email: z.string().email().toLowerCase(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/)
    .optional(),
})

// ❌ Bad — accepts anything, breaks type inference
const createClientInput = z.object({
  name: z.string(),
  extra: z.any(),
})
```

- Strings: always add `.trim()`. Add `.min(1)` to required strings.
- IDs: use `z.string().uuid()` — never `z.string()` alone for IDs.
- Enums: use `z.enum(['a','b'])` not `z.string()` when values are known.
- Dates: use `z.coerce.date()` at API boundaries, store as ISO strings in DB.

## Error codes — domain taxonomy

Use structured `TRPCError` with a `message` that is safe to display to the user.

```ts
import { TRPCError } from '@trpc/server'

// Authentication / authorization
throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in.' })
throw new TRPCError({
  code: 'FORBIDDEN',
  message: 'You do not have permission to delete clients.',
})

// Resource not found
throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' })

// Validation (prefer Zod parse errors, but use this for business rule violations)
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'A client with this email already exists.',
})

// Conflict
throw new TRPCError({
  code: 'CONFLICT',
  message: 'This invitation has already been accepted.',
})

// Server fault
throw new TRPCError({
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Something went wrong. Please try again.',
})
```

Never expose raw Postgres errors (`duplicate key`, `foreign key violation`) to the client — catch them and rethrow with a domain message.

## Router file structure

```ts
// apps/server/src/trpc/routers/clients.ts
import { z } from 'zod'
import { router } from '@sb-codex/api-contracts'
import { requirePermission } from '@sb-codex/acl'
import { workspaceProcedure } from '@sb-codex/api-contracts'
import { clients } from '@sb-codex/db'
import { TRPCError } from '@trpc/server'
import { eq, and } from 'drizzle-orm'

export const clientsRouter = router({
  list: workspaceProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // RLS already filters to ctx.workspace.id — no WHERE workspace_id needed
      const rows = await ctx.db
        .select()
        .from(clients)
        .limit(input.limit + 1)
      const hasMore = rows.length > input.limit
      return {
        items: rows.slice(0, input.limit),
        nextCursor: hasMore ? rows[input.limit - 1].id : null,
      }
    }),

  delete: requirePermission('clients:delete')(workspaceProcedure)
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(clients)
        .where(eq(clients.id, input.id))
        .returning()
      if (!deleted)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' })
      return deleted
    }),
})
```
