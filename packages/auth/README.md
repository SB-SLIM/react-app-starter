# @sb-codex/auth

Authentication for the sb-codex SaaS starter, built on [better-auth](https://better-auth.com) with the organization (workspace) plugin. Exposes a server config factory and a **library-agnostic client facade** — apps never import `better-auth` directly, so the underlying library can be swapped by rewriting one file.

## Installation

```bash
pnpm add @sb-codex/auth
```

`better-auth` is a regular dependency of this package — it's the internal engine
behind the facade, so consumers never install or import it directly.

## Usage

### Server (`@sb-codex/auth`)

```ts
import { createAuth } from '@sb-codex/auth'
import { createDb } from '@sb-codex/db'

export const auth = createAuth(createDb(process.env.DATABASE_URL!), {
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: ['http://localhost:5173'],
})
```

### Client (`@sb-codex/auth/client`)

```ts
import { createSbAuthClient } from '@sb-codex/auth/client'

export const authClient = createSbAuthClient('http://localhost:3001')

await authClient.signUp(name, email, password)
await authClient.signIn(email, password)
await authClient.createWorkspace(name)
const { session } = authClient.useSession() // React hook
```

## API

### `@sb-codex/auth`

| Export                       | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `createAuth(db, config)`     | Build a configured better-auth server instance. |
| `AuthConfig`, `AuthInstance` | Types.                                          |

### `@sb-codex/auth/client`

| Export                        | Description                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `createSbAuthClient(baseURL)` | Library-agnostic client: `signIn`, `signUp`, `signOut`, `getSession`, `useSession`, `createWorkspace`, `listWorkspaces`. |

## Swapping the auth library

All better-auth usage is contained in `src/index.ts` (server) and `src/client.ts` (client). To move to another provider, rewrite those two files — no consuming app code changes.

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
