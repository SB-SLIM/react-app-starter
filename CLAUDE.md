# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

pnpm workspace + Turborepo with two layers:

- `packages/` — shared libraries built with `tsup`, consumed by apps
  - `@sb-codex/core` — utilities (exports `cn` classname helper via `clsx`)
  - `@sb-codex/ui-components` — React component library (exports `Button`, `CardUser`)
- `apps/` — end-user applications built with Vite
  - `admin` — React 19 + Vite app

Workspace packages resolve via the pnpm overrides in the root `package.json` and `.npmrc` settings (`linkWorkspacePackages`, `preferWorkspacePackages`). Apps import from `@sb-codex/*` as normal npm imports — pnpm links them to the local `packages/` source.

## Commands

All commands run from the repo root unless noted.

```bash
# Install dependencies
pnpm install

# Development (watch-builds all packages + starts all apps in parallel)
pnpm dev

# Development (watch-builds packages admin depends on + starts admin)
pnpm dev:admin

# Build all packages and apps (respects dependency order)
pnpm build

# Clean all package dist outputs
pnpm clean

# Lint all packages and apps
pnpm lint
```

From within `apps/admin`:

```bash
pnpm lint       # ESLint (TypeScript + react-hooks + react-refresh)
pnpm build      # tsc type-check + vite production build
pnpm preview    # Preview the production build locally
```

> **Important:** Apps depend on the compiled `dist/` output of packages. When iterating on packages and apps together, use `pnpm dev` so tsup watch rebuilds packages automatically alongside the Vite dev server.

## Build Pipeline (Turborepo)

`turbo.json` defines the task graph:

- **`build`** — `dependsOn: ["^build"]`: packages always build before apps. Outputs cached under `dist/**`.
- **`dev`** — persistent, no cache. All `dev` tasks run in parallel (packages run `tsup --watch`, apps run `vite`).
- **`clean`** — no cache, removes `dist/`.
- **`lint`** — `dependsOn: ["^build"]`: packages must be built before linting apps.

Turbo caches build outputs by input hash. A clean rebuild: `pnpm clean && pnpm build`.

## Package Tooling

- **Packages** use a shared tsup config from `scripts/getTsupConfig.js`. Outputs CJS + ESM, generates `.d.ts`, enables sourcemaps, minifies. Entry: `src/index.ts`.
- **Apps** use Vite with `@vitejs/plugin-react`.
- `tsconfig.base.json` is the shared compiler options base (strict settings). Each package extends it and adds `declaration`, `declarationMap`, `noEmit: false`, `outDir`, `rootDir: ./src`. The `ui-components` package also adds `jsx: react-jsx`. The root `tsconfig.json` is a solution config (project references only) for the TypeScript language server.

## Code Style

Prettier config (`prettier.config.js` at root):

- No semicolons
- Single quotes
- Trailing commas everywhere (`all`)

TypeScript is strict with `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedIndexedAccess` enabled.

## Adding a New Package

1. Create `packages/<name>/` with:
   - `package.json` — name `@sb-codex/<name>`, scripts: `build`, `dev`, `clean`
   - `tsconfig.json` — extends `../../tsconfig.base.json`, adds `declaration: true`, `noEmit: false`, `outDir: ./dist`, `rootDir: ./src`
   - `tsup.config.ts` — uses `baseConfig` from `../../scripts/getTsupConfig.js`
2. Add the package name to pnpm `overrides` in root `package.json` with `"workspace:^"`.
3. Apps can then import `@sb-codex/<name>` directly after declaring it as a `workspace:^` dependency.
