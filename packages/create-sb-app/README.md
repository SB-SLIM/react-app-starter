# @sb-codex/create-sb-app

Scaffold a new multi-tenant SaaS project from the [sb-codex starter](https://github.com/SB-SLIM/react-app-starter).

It generates an **apps-only** project: you get `apps/` (admin, server, web, e2e) and the `@sb-codex/*` plugins are pulled from **npm** at their published versions — there is **no `packages/` folder** to maintain. The CLI also injects each plugin's peer dependencies into the consuming apps so the project installs cleanly.

## Usage

```bash
pnpm create @sb-codex/sb-app@latest my-saas
# or: npm create @sb-codex/sb-app@latest my-saas
```

> The `@latest` tag forces the newest version and avoids npx serving a cached older release.

Prompts:

- **Project directory** — where to create the project
- **Project name** — root `package.json` name
- **Production domain** — replaces the reference domain. **Defaults to `localhost`** for local dev (e.g. `hub.localhost`)
- **git init** — start with fresh git history

Then:

```bash
cd my-saas
pnpm install     # plugins resolved from npm — no local build
pnpm dev
```

## What it does

- Pulls `apps/` from the starter; rewrites each `@sb-codex/*` dependency from `workspace:^` to the **published npm version** and injects that plugin's peer dependencies
- Removes the `packages/` source, trims `pnpm-workspace.yaml` to `apps/*`, strips `@sb-codex/*` from `pnpm.overrides`, drops the changeset config
- Copies `.env.example` → `.env`
- Replaces project-specific tokens:

| Token                               | Replaced with                     |
| ----------------------------------- | --------------------------------- |
| `slimbouchoucha.tn`                 | your domain (default `localhost`) |
| `ghcr.io/sb-slim/react-app-starter` | `ghcr.io/your-gh-org/<name>`      |
| `SB-SLIM/react-app-starter`         | `your-gh-org/<name>`              |
| Notion page id                      | `YOUR_NOTION_PAGE_ID`             |

## Non-interactive flags

```bash
npx @sb-codex/create-sb-app my-saas --name my-saas --domain localhost --no-git
```

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
