## Summary

<!-- What does this PR do? One paragraph. -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor (no behaviour change)
- [ ] Performance improvement
- [ ] Documentation update
- [ ] CI / tooling / deps

## Breaking changes

- [ ] This PR contains breaking changes

<!-- If yes, describe what breaks and the migration path. -->

## Checklist

### Code
- [ ] Follows the architecture rules in `CLAUDE.md`
- [ ] New business tables have `workspace_id` + RLS policies
- [ ] Mutating procedures use `workspaceProcedure` (not `protectedProcedure`)
- [ ] No `as any`, no `@ts-ignore` without explanation
- [ ] No unhandled promises (no `.then()` without `.catch()`, no `forEach` with async)
- [ ] List procedures have pagination input

### Tests
- [ ] Unit / integration tests added or updated
- [ ] E2E test added for new user-facing flows (if applicable)
- [ ] `pnpm test` passes locally

### Quality
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] New env vars added to `apps/server/src/env.ts` and `.env.example`
- [ ] New packages have `README.md` and `publishConfig.access: public`

### Docs
- [ ] Docs updated if architecture, routing, auth, theme, or scaling changed
  (5 places: `CLAUDE.md`, `docs/architecture.md`, `docs/roadmap.md`, `README.md`, Notion)

## Test plan

<!-- How did you verify this works? Describe manual steps or point to tests. -->

## Screenshots (if UI change)

<!-- Before / after or a short screen recording -->
