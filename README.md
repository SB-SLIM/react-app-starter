# react-app-starter

A monorepo starter using **pnpm workspaces** + **Turborepo**, with shared packages and a React 19 admin app.

## Structure

```
.
├── apps/
│   └── admin/          # React 19 + Vite application
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

# Or start only the admin app (with its package dependencies)
pnpm dev:admin
```

The admin app runs at `http://localhost:5173` by default.

## Commands

| Command         | Description                                          |
| --------------- | ---------------------------------------------------- |
| `pnpm dev`      | Watch-build all packages and start all apps          |
| `pnpm dev:admin`| Watch-build packages admin depends on + start admin  |
| `pnpm build`    | Build all packages and apps (respects dep order)     |
| `pnpm lint`     | Lint all packages and apps                           |
| `pnpm clean`    | Remove all `dist/` outputs                           |

## Packages

### `@sb-codex/core`

General utilities.

```ts
import { cn } from '@sb-codex/core'

cn('base-class', condition && 'conditional-class')
```

### `@sb-codex/ui-components`

React component library built on top of `@sb-codex/core`.

```tsx
import { Button, CardUser } from '@sb-codex/ui-components'
```

## Adding a New Package

1. Create `packages/<name>/` with a `package.json` (name `@sb-codex/<name>`), `tsconfig.json`, and `tsup.config.ts`.
2. Add `"@sb-codex/<name>": "workspace:^"` to `pnpm.overrides` in the root `package.json`.
3. Import `@sb-codex/<name>` from any app after declaring it as a `workspace:^` dependency.

See [CLAUDE.md](CLAUDE.md) for the full setup checklist.

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 7](https://vite.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [tsup](https://tsup.egoist.dev/) — package bundler (CJS + ESM + `.d.ts`)
- [Turborepo](https://turbo.build/) — task orchestration and caching
- [pnpm](https://pnpm.io/) — package manager with workspaces
- [ESLint 9](https://eslint.org/) + [Prettier 3](https://prettier.io/)
