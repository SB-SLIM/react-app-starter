# @sb-codex/api-contracts

The shared tRPC contract for the sb-codex SaaS starter: the `appRouter`, its procedures, the request `Context` type, and shared Zod schemas. The server mounts the router; the client imports only the **types** for end-to-end type safety without bundling server code.

## Installation

```bash
pnpm add @sb-codex/api-contracts
# peer dependencies
pnpm add @trpc/server drizzle-orm zod
```

## Usage

### Server

```ts
import { appRouter } from '@sb-codex/api-contracts'
// mount appRouter on your tRPC adapter (Fastify, etc.)
```

### Client (type-only)

```ts
import type { AppRouter } from '@sb-codex/api-contracts'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<AppRouter>()
```

## API

| Export      | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| `appRouter` | The aggregated tRPC router (one sub-router per feature).    |
| `AppRouter` | Type of the router — import as `import type` in clients.    |
| `Context`   | Request context shape `{ requestId, user, workspace, db }`. |

## Procedures

- `publicProcedure` — no auth
- `protectedProcedure` — requires a session
- `workspaceProcedure` — requires session + active workspace; opens a transaction with `SET LOCAL app.workspace_id` so RLS applies automatically.

A new feature = a new router file aggregated in `routers/_app.ts`.

## Peer dependencies

- `@trpc/server` `^11`, `drizzle-orm` `^0.44`, `zod` `^4`

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
