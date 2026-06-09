---
name: frontend-patterns
description: >
  Work on the frontend apps in this repository. Use when editing or creating
  React components, routes, hooks, or styles in apps/admin, apps/superadmin, or
  apps/web. Covers TanStack Router/Query conventions, the ACL display helpers,
  Tailwind v4 theme tokens, the ui-components primitive library, the
  error-boundary pattern, and the Next.js reading requirement for apps/web.
---

# Frontend Patterns — sb-codex admin / superadmin / web

Read only the section relevant to the task at hand.

---

## 1. Directory layout (admin / superadmin)

```
src/
  app/        router, queryClient, trpcClient setup — touch only when wiring a new app-level concern
  shared/     cross-feature: hooks, ui wrappers, lib helpers (e.g. useZodForm)
  features/   one folder per domain
    <name>/
      components/   React components for this feature
      hooks/        data hooks (usually wrap a tRPC query/mutation)
      api/          typed client calls
  routes/     TanStack file-based routes — THIN, only wiring
```

Rules:

- **Features must not import each other.** If two features share something, move it to `shared/`.
- **Routes must not contain business logic.** A route file imports a feature component and wires router params — nothing else.

---

## 2. TanStack Router — thin route pattern

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

## 3. TanStack Query conventions

Always set `staleTime` — the default (0) causes every mount to refetch:

| Data type                           | staleTime                                 |
| ----------------------------------- | ----------------------------------------- |
| User session                        | `Infinity` (invalidated on sign-out only) |
| Reference data (workspace, members) | `5 * 60 * 1000` (5 min)                   |
| Live lists                          | `30 * 1000` (30 s)                        |

- Mutations must call `queryClient.invalidateQueries` with the correct key after success.
- Use `useIsMutating` / `isPending` for loading states — never local `useState` for async state.

---

## 4. ACL display helpers — display-only, never a security gate

The `AclProvider` and `Can` component from `@sb-codex/acl/client` show or hide UI
based on the permissions resolved server-side by `members.me`. They are **display helpers only**.

```tsx
// ✅ correct — hides the button for users without permission
;<Can do="clients:delete">
  <DeleteButton />
</Can>

// ❌ wrong — the Can check is client-side only; the server will reject the call
// regardless, but this pattern gives a false sense of security
if (can('clients:delete')) {
  await deleteClient(id)
}
```

Always import auth helpers from `@sb-codex/auth/client`, never from `better-auth` directly:

```ts
import { authClient } from '../app/authClient' // wraps createSbAuthClient()
```

---

## 5. Tailwind v4 theme

The design system uses semantic `primary-*` tokens shipped by `@sb-codex/ui-components/theme.css`.
Each app overrides these in its own entry CSS file under `@theme`:

```css
/* apps/admin/src/app/global.css */
@import '@sb-codex/ui-components/theme.css';

@theme {
  --color-primary-500: oklch(55% 0.2 250); /* app-specific override */
  --color-secondary-500: oklch(60% 0.15 30);
}
```

Never hardcode hex or hsl colors in component `className` strings — always use semantic tokens.

---

## 6. Component library — do not re-implement

All primitives come from `@sb-codex/ui-components`. Do not re-implement:

| Component      | Wraps                                                |
| -------------- | ---------------------------------------------------- |
| `DataTable`    | `@tanstack/react-table`                              |
| `Select`       | `react-select` v5                                    |
| `DatePicker`   | `react-datepicker` (import its CSS in the app entry) |
| `Dialog`       | Radix UI                                             |
| `Popover`      | Radix UI                                             |
| `DropdownMenu` | Radix UI                                             |
| `RadioGroup`   | Radix UI                                             |
| `Toaster`      | sonner                                               |

For icons use `lucide-react` only.

---

## 7. Error boundaries

Every top-level route should be wrapped in an error boundary (Sentry integration pending):

```tsx
import { ErrorBoundary } from 'react-error-boundary'

function RouteErrorFallback({ error }: { error: Error }) {
  return <div>Something went wrong: {error.message}</div>
}

// In the route component:
;<ErrorBoundary FallbackComponent={RouteErrorFallback}>
  <ClientsPage />
</ErrorBoundary>
```

---

## 8. Next.js (apps/web)

Before editing **any** file in `apps/web`, read `AGENTS.md` at the repo root — it instructs you to read the relevant doc in `node_modules/next/dist/docs/` first. Next.js training data is outdated; the docs are the source of truth.
