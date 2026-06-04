# create-sb-app

Scaffold a new multi-tenant SaaS project from the [sb-codex starter](https://github.com/SB-SLIM/react-app-starter). Downloads the full monorepo (apps + packages in `workspace:^`, self-contained) and replaces project-specific values for you.

## Usage

```bash
pnpm create sb-app my-saas
# or: npm create sb-app my-saas
# or: yarn create sb-app my-saas
```

Prompts:

- **Project directory** — where to create the project
- **Project name** — root `package.json` name
- **Production domain** — replaces the reference domain across docs, compose and Traefik config
- **git init** — start with fresh git history

Then:

```bash
cd my-saas
pnpm install
pnpm dev
```

## What it replaces

| Token                               | Replaced with                |
| ----------------------------------- | ---------------------------- |
| `slimbouchoucha.tn`                 | your domain                  |
| `ghcr.io/sb-slim/react-app-starter` | `ghcr.io/your-gh-org/<name>` |
| `SB-SLIM/react-app-starter`         | `your-gh-org/<name>`         |
| `152.53.187.54`                     | `YOUR_VPS_IP`                |
| Notion page id                      | `YOUR_NOTION_PAGE_ID`        |

It also drops its own `packages/create-sb-app` from the generated project and copies `.env.example` → `.env`.

## Local usage (before publish)

```bash
pnpm --filter create-sb-app build
node packages/create-sb-app/dist/index.js ../my-saas
```

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
