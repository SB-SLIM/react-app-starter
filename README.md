# react-app-starter

A monorepo starter using **pnpm workspaces** + **Turborepo**, with shared packages, a React 19 backoffice, and a Next.js front office.

## Structure

```
.
├── apps/
│   ├── admin/          # React 19 + Vite — backoffice
│   └── web/            # Next.js 15 App Router — front office
└── packages/
    ├── core/           # @sb-codex/core — utilities (cn classname helper)
    └── ui-components/  # @sb-codex/ui-components — React component library (Button, CardUser)
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) 10+

## Getting Started

```bash
# Install dependencies
pnpm install

# Start all packages in watch mode + all apps
pnpm dev

# Or start only one app (with its package dependencies)
pnpm dev:admin
pnpm dev:web
```

| App     | URL                     |
| ------- | ----------------------- |
| `admin` | <http://localhost:5173>   |
| `web`   | <http://localhost:3000>   |

## Commands

| Command          | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `pnpm dev`       | Watch-build all packages and start all apps          |
| `pnpm dev:admin` | Watch-build packages admin depends on + start admin  |
| `pnpm dev:web`   | Watch-build packages web depends on + start web      |
| `pnpm build`     | Build all packages and apps (respects dep order)     |
| `pnpm lint`      | Lint all packages and apps                           |
| `pnpm clean`     | Remove all `dist/` outputs                           |

## Packages

### `@sb-codex/core`

General utilities.

```ts
import { cn } from '@sb-codex/core'

cn('base-class', condition && 'conditional-class')
```

### `@sb-codex/ui-components`

React component library built on top of `@sb-codex/core`. Compatible with both Vite and Next.js (interactive components are marked `'use client'`).

```tsx
import { Button, CardUser } from '@sb-codex/ui-components'
```

## Publishing Packages

Versioning is managed with [Changesets](https://github.com/changesets/changesets).

```bash
# 1. Describe what changed (run after each meaningful change)
pnpm changeset

# 2. Bump versions + generate changelogs
pnpm version

# 3. Build and publish to npm
pnpm release
```

> Packages are published under the `@sb-codex` scope with public access. Make sure you are logged in (`npm login`) before running `pnpm release`.

## Adding a New Package

1. Create `packages/<name>/` with a `package.json` (name `@sb-codex/<name>`), `tsconfig.json`, and `tsup.config.ts`.
2. Add `"@sb-codex/<name>": "workspace:^"` to `pnpm.overrides` in the root `package.json`.
3. Import `@sb-codex/<name>` from any app after declaring it as a `workspace:^` dependency.

See [CLAUDE.md](CLAUDE.md) for the full setup checklist.

## Tech Stack

- [React 19](https://react.dev/)
- [Next.js 15](https://nextjs.org/) — front office (App Router)
- [Vite 7](https://vite.dev/) — backoffice
- [TypeScript 5](https://www.typescriptlang.org/)
- [tsup](https://tsup.egoist.dev/) — package bundler (CJS + ESM + `.d.ts`)
- [Turborepo](https://turbo.build/) — task orchestration and caching
- [pnpm](https://pnpm.io/) — package manager with workspaces
- [Changesets](https://github.com/changesets/changesets) — versioning and npm publishing
- [ESLint 9](https://eslint.org/) + [Prettier 3](https://prettier.io/)
