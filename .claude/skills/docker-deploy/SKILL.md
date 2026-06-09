---
name: docker-deploy
description: >
  Understand and operate the CI/CD pipeline, Docker images, and production
  deployment for this repository. Use when asked to deploy, roll back, build
  images, understand the pipeline, or troubleshoot a failed deploy.
---

# Docker & Deploy — sb-codex monorepo

## CI/CD trust chain

```
push → main
  └─ CI (.github/workflows/ci.yml)
       ├─ pnpm install --frozen-lockfile
       ├─ turbo build (packages only — no admin/web/server)
       ├─ pnpm lint
       ├─ pnpm typecheck
       ├─ pnpm test
       └─ job: rls-isolation (Postgres 16 service, runs @sb-codex/db test)
            └─ if ALL green →
                 Build & Push Images (.github/workflows/build-images.yml)
                   ├─ dorny/paths-filter detects which apps changed
                   ├─ arm64 runner builds changed images only
                   ├─ pushes to GHCR: ghcr.io/sb-slim/react-app-starter/<app>:<sha>
                   └─ if all images pushed →
                        Deploy (.github/workflows/deploy.yml)
                          ├─ SSH to VPS
                          ├─ git pull (infra files only — not needed for images)
                          ├─ docker compose -f infra/compose/docker-compose.prod.yml pull
                          ├─ docker compose up -d
                          └─ docker compose run --rm migrate
```

**Never run `docker compose up --build` on the VPS.** Images are built in CI on the arm64 runner and pulled from GHCR. Running `--build` on the VPS re-builds images without CI validation.

---

## Image naming

```
ghcr.io/sb-slim/react-app-starter/<service>:<IMAGE_TAG>
```

`IMAGE_TAG` is the git SHA of the triggering commit. The `latest` tag is never used in production — always a pinned SHA.

Services: `app` (server), `admin`, `web`, `superadmin`, `worker`.

---

## Dockerfiles location

```
infra/docker/
├── Dockerfile.server      # Fastify API (multi-stage: prune → deps → build → run)
├── Dockerfile.admin       # Vite SPA → Nginx (VITE_TRPC_URL, VITE_BETTER_AUTH_URL build args)
├── Dockerfile.web         # Next.js 16 (multi-stage)
├── Dockerfile.superadmin  # Vite SPA → Nginx
├── Dockerfile.worker      # BullMQ worker (prunes @sb-codex/jobs)
└── nginx.conf             # SPA fallback + 1y cache for /assets/*
```

All Dockerfiles use `turbo prune --scope=<app>` to create a minimal workspace before `pnpm install`. This keeps images small by excluding unrelated packages.

---

## Local image build (testing only)

```bash
# Build server image locally
docker build -f infra/docker/Dockerfile.server \
  --build-arg TURBO_TEAM=local \
  -t sb-codex/server:dev .

# Build admin SPA image (bakes URLs at build time)
docker build -f infra/docker/Dockerfile.admin \
  --build-arg VITE_TRPC_URL=http://localhost:3001 \
  --build-arg VITE_BETTER_AUTH_URL=http://localhost:3001 \
  -t sb-codex/admin:dev .
```

---

## Triggering a deploy manually

Only CI should deploy. If you must redeploy without a code change:

1. Retrigger the `Build & Push Images` workflow manually via GitHub Actions UI.
2. The `Deploy` workflow runs automatically after images are pushed.

Do **not** SSH to the VPS and run `docker compose` commands manually unless it is an emergency.

---

## Emergency rollback

If a deploy breaks production:

```bash
# On the VPS — roll back to the previous IMAGE_TAG
ssh user@vps

# Find the last known-good SHA from GitHub Actions run history
export PREV_TAG=<previous-sha>

# Pull and restart with previous images
IMAGE_TAG=$PREV_TAG docker compose -f infra/compose/docker-compose.prod.yml pull
IMAGE_TAG=$PREV_TAG docker compose -f infra/compose/docker-compose.prod.yml up -d

# If the migration was also bad, you need a DB restore — see runbook
```

---

## Environment variable reference

Variables baked at **image build time** (Vite build args — cannot change without rebuild):
- `VITE_TRPC_URL` — full URL to `apps/server` API (e.g. `https://hub.domain.tn/api`)
- `VITE_BETTER_AUTH_URL` — same as `VITE_TRPC_URL` for auth endpoints

Variables loaded at **container runtime** from `.env.production`:
- All vars in `apps/server/src/env.ts` — validated by Zod on startup
- `DATABASE_URL` — superuser URL (used by `migrate` profile only)
- `APP_DB_PASSWORD` — non-privileged `app` role password (used by `server`)
- See `CLAUDE.md` § Production Deployment for the full list

---

## Adding a new service

1. Create `infra/docker/Dockerfile.<name>`.
2. Add service to `infra/compose/docker-compose.prod.yml` with image `${GHCR_IMAGE_PREFIX}/<name>:${IMAGE_TAG}`.
3. Add service to `infra/traefik/dynamic.prod.yml` routing if it needs an HTTP endpoint.
4. Add the service name to the `build-images.yml` matrix.
5. Add a `HEALTHCHECK` and non-root `USER` directive to the Dockerfile.
6. Document new required env vars in `.env.production` section of `CLAUDE.md`.
