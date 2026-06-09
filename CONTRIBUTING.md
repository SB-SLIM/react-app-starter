# Contributing

## Prerequisites

- Node.js 22+ (see `.node-version`)
- pnpm 10+ — `corepack enable && corepack prepare pnpm@latest --activate`
- Docker + Docker Compose (for local services)

## Setup

```bash
git clone https://github.com/sb-slim/react-app-starter.git
cd react-app-starter
cp .env.example .env          # fill in values (defaults work for local dev)
pnpm install
docker compose -f infra/compose/docker-compose.yml up -d
pnpm db:migrate
pnpm dev
```

## Branch naming

```
feat/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
```

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/).
Enforced by commitlint on every commit.

```
feat(admin): add client export button
fix(server): handle null workspace in enforceWorkspace middleware
chore(deps): upgrade drizzle-orm to 0.44.1
```

See `.claude/skills/commit-messages/SKILL.md` for the full scope reference.

## Pull requests

- Open a PR against `main`.
- Fill in the PR template — especially the test plan and breaking changes sections.
- CI must be green before merge (lint, typecheck, test, RLS isolation).
- One approval required from a CODEOWNER.

## Architecture rules

Before adding a feature, read `CLAUDE.md`. The non-negotiable rules:

1. Every business table needs `workspace_id TEXT NOT NULL` + RLS policies.
2. Use `workspaceProcedure` (not `protectedProcedure`) for tenant-scoped data.
3. Use `requirePermission('resource:action')` for privileged mutations.
4. Apps import from `@sb-codex/auth/client` — never from `better-auth` directly.
5. Features don't import each other — shared code goes to `shared/`.
6. Packages contain no business/domain logic specific to one product.

## Testing

```bash
pnpm test                   # unit tests across all packages
pnpm --filter @sb-codex/db test  # RLS integration tests (needs Postgres)
pnpm --filter e2e test      # Playwright E2E (needs full stack running)
```

New features must ship with tests. See `.claude/skills/testing-patterns/SKILL.md`.

## Docs update

Update docs **after** a feature is working and deployed — not mid-feature.
Five places to keep in sync: `CLAUDE.md`, `docs/architecture.md`, `docs/roadmap.md`,
`README.md`, and the Notion page. See `.claude/workflow.md`.

## Reporting security issues

See `SECURITY.md`.
