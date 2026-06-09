# Agent: Frontend

Specialized context for working in `apps/admin`, `apps/superadmin`, and `apps/web`.
Read `CLAUDE.md` for global rules. This file adds frontend-specific guardrails.

---

## Scope

- `apps/admin` — React 19 + Vite + TanStack Router + TanStack Query + Tailwind v4
- `apps/superadmin` — same stack, platform-level admin
- `apps/web` — Next.js 16 marketing site (minimal, read AGENTS.md before touching Next.js code)

---

## Directory rules (admin / superadmin)

```
src/
  app/        router, queryClient, trpcClient setup — touch only when wiring a new app-level concern
  shared/     cross-feature: hooks, ui wrappers, lib helpers
  features/   one folder per domain
    <name>/
      components/   React components for this feature
      hooks/        data hooks (usually wrap a tRPC query/mutation)
      api/          typed client calls
  routes/     TanStack file-based routes — THIN, only wiring
```

**Features must not import each other.** If two features share something, it moves to `shared/`.
**Routes must not contain business logic.** A route file imports a feature component and wires router params. Nothing else.

---

## TanStack Router patterns

```ts
// routes/dashboard/clients.tsx  ← thin
import { createFileRoute } from '@tanstack/react-router'
import { ClientsPage } from '../../features/clients/components/ClientsPage'

export const Route = createFileRoute('/dashboard/clients')({
  component: ClientsPage,
})
```

```ts
// features/clients/hooks/useClients.ts  ← data logic lives here
import { trpc } from '../../app/trpcClient'

export function useClients() {
  return trpc.clients.list.useQuery({ limit: 20 })
}
```

---

## TanStack Query conventions

- Always set `staleTime` — the default (0) causes every mount to refetch.
  - User session: `staleTime: Infinity` (invalidated on sign-out)
  - Reference data (workspace, members): `staleTime: 5 * 60 * 1000` (5 min)
  - Live lists: `staleTime: 30 * 1000` (30 s)
- Mutations must call `queryClient.invalidateQueries` with the correct key after success.
- Use `useIsMutating` / `isPending` for loading states — never local `useState` for async state.

---

## Auth (display-only) — critical

The `AclProvider` and `Can` component from `@sb-codex/acl/client` are **display helpers only**.
They show/hide UI based on the permissions resolved by `members.me`.

```tsx
// ✅ correct — hides the button for users without permission
<Can do="clients:delete">
  <DeleteButton />
</Can>

// ❌ wrong — never use as a security gate; the server enforces permissions
if (can('clients:delete')) {
  await deleteClient(id) // the server will reject this anyway if unauthorized
}
```

Always import auth helpers from `@sb-codex/auth/client`, never from `better-auth` directly:
```ts
import { authClient } from '../app/authClient' // which wraps createSbAuthClient()
```

---

## Tailwind v4 theme

The design system uses semantic `primary-*` tokens defined in `@sb-codex/ui-components/theme.css`.
Each app overrides these in its own entry CSS file under `@theme`.

```css
/* apps/admin/src/app/global.css */
@import '@sb-codex/ui-components/theme.css';

@theme {
  --color-primary-500: oklch(55% 0.2 250);  /* override for this app */
  --color-secondary-500: oklch(60% 0.15 30);
}
```

Never hardcode hex or hsl colors in component className strings — always use semantic tokens.

---

## Component library

All primitives come from `@sb-codex/ui-components`. Do not re-implement:
- `DataTable` — wraps `@tanstack/react-table`
- `Select` — wraps `react-select` v5
- `DatePicker` — wraps `react-datepicker` (import its CSS in the app entry)
- `Dialog`, `Popover`, `DropdownMenu`, `RadioGroup` — wrap Radix UI
- `Toaster` — wraps `sonner`

For icons use `lucide-react` only.

---

## Error boundaries

Every top-level route should be wrapped in an error boundary that reports to Sentry (once integrated):

```tsx
import { ErrorBoundary } from 'react-error-boundary'

function RouteErrorFallback({ error }: { error: Error }) {
  return <div>Something went wrong: {error.message}</div>
}

// In the route component
<ErrorBoundary FallbackComponent={RouteErrorFallback}>
  <ClientsPage />
</ErrorBoundary>
```

---

## Next.js (apps/web)

Before editing any file in `apps/web`, read `AGENTS.md` at the repo root — it instructs you to read the relevant doc in `node_modules/next/dist/docs/` first. Training data for Next.js is outdated.
