# Starting a new project

Two ways to start a new product from this starter.

## Option A — `@sb-codex/create-sb-app` CLI (recommended)

Scaffolds a full, self-contained copy of the monorepo (apps + packages in `workspace:^`) and replaces project-specific values for you.

```bash
pnpm create @sb-codex/sb-app my-project
```

It prompts for:

- **Project name** — sets the root `package.json` name
- **Domain** — replaces `slimbouchoucha.tn` across docs, compose and Traefik config
- **git init** — fresh git history

Then:

```bash
cd my-project
pnpm install
pnpm dev
```

The generated project keeps the packages in `workspace:^`, so you can modify the plugins freely. No npm publish required.

> Before publication of the CLI, run it locally from this repo:
> `node packages/create-sb-app/dist/index.js my-project`

## Option B — apps-only, plugins from npm

Once the `@sb-codex/*` plugins are published to npm, a new project can consume only the apps and pull the plugins as normal dependencies:

1. Copy the `apps/<app>` you need into the new repo.
2. In each app's `package.json`, replace `"@sb-codex/*": "workspace:^"` with the published version (e.g. `"^1.0.0"`).
3. Remove the `pnpm.overrides` for `@sb-codex/*` from the root `package.json`.
4. `pnpm install` — plugins are fetched from npm, no local build.
5. `cp .env.example .env` and fill the values.

This keeps the new project lean (no `packages/` folder) but requires the plugins to be published first. See [plugins/README.md](plugins/README.md#publishing).
