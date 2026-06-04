# Workflow rules for this repo

## Documentation update rule

**When to update docs:** At the end of a session, once a feature or change is:

- Working correctly in production (or verified locally)
- Code reviewed / validated
- No pending bugs or regressions

**What to update (always in sync, in one pass):**

1. `CLAUDE.md` — if architectural rules, conventions, or infra changed
2. `docs/architecture.md` — if tenant model, routing, auth, theme, or scaling changed
3. `docs/roadmap.md` — if a phase status changed or new phases added
4. `README.md` — if quick start, stack, or env vars changed
5. **Notion page** `3741c921-e61d-815f-8b78-e896fe1b65f3` — mirror of docs/architecture.md + roadmap

**Trigger phrase:** User says "mets à jour les docs" or "update the docs" — update all 5 above.

**Do NOT update docs:**

- Mid-feature when things are still broken
- When a bug fix is still in progress
- When a deploy hasn't been validated yet

## Commit convention

Follow Conventional Commits: `feat:`, `fix:`, `perf:`, `docs:`, `chore:`, `refactor:`

## Never do

- Never commit `.env`, `.env.production`, `infra/traefik/acme.json`
- Never push with `--force` to main
- Never run `docker compose up --build` on VPS (use CI/CD pipeline)
- Never import from `better-auth` directly in apps — use `@sb-codex/auth/client`
