# Plugins

Each `packages/*` is an independent, publishable npm plugin under the `@sb-codex` scope. Within this monorepo they are linked via `workspace:^`; once published they install from npm like any dependency.

The canonical documentation for each plugin lives in its own `README.md` (single source of truth). This page is the index.

| Plugin                    | Description                                     | Docs                                             |
| ------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `@sb-codex/core`          | `cn()` classname utility                        | [README](../../packages/core/README.md)          |
| `@sb-codex/config`        | Zod-validated `createEnv()` env loader          | [README](../../packages/config/README.md)        |
| `@sb-codex/db`            | Drizzle schema, migrations, multi-tenant RLS    | [README](../../packages/db/README.md)            |
| `@sb-codex/auth`          | better-auth server config + client facade       | [README](../../packages/auth/README.md)          |
| `@sb-codex/api-contracts` | tRPC router + shared Zod schemas                | [README](../../packages/api-contracts/README.md) |
| `@sb-codex/jobs`          | BullMQ queues + worker                          | [README](../../packages/jobs/README.md)          |
| `@sb-codex/ui-components` | React primitives + UIProvider + theme.css       | [README](../../packages/ui-components/README.md) |
| `@sb-codex/create-sb-app` | CLI to scaffold a new project from this starter | [README](../../packages/create-sb-app/README.md) |

## Publishing

Publishing is managed by [changesets](https://github.com/changesets/changesets) (`access: public`):

```bash
pnpm changeset          # describe the change + pick semver bump
pnpm changeset version  # apply versions + changelogs
pnpm release            # build + publish to npm (needs NPM_TOKEN)
```

`workspace:^` inter-package ranges are replaced with the real published version automatically at publish time.

## Dependency conventions

Libraries whose instance must be shared with the consumer (`react`, `zod`, `drizzle-orm`, `@trpc/server`, `better-auth`) are declared as **`peerDependencies`** (and mirrored in `devDependencies` for local build/dev). This avoids duplicate copies and version-mismatch bugs in consuming apps.

## Starting a new project

To bootstrap a new app from this starter, see [starting-a-new-project.md](../starting-a-new-project.md) or use the `@sb-codex/create-sb-app` CLI.
