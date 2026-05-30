# Naming & label conventions

These apply at any scale. Consistency here is what makes a repo's tracking _scannable_ months later.

## Milestone titles

Pattern: `[scope]: outcome`

- `Auth: SSO login flow`
- `Billing: subscription upgrade UX`
- `API: rate limiting`
- `v2.0: public launch` (release milestones can use a version as the scope)

Why: the scope prefix lets you eyeball-group the milestone list and filter by area. The outcome clause forces the milestone to describe something shippable rather than a vague theme.

Rules:

- Always set a due date (even rough) — the progress bar needs one.
- Keep scope to ~5–20 issues; split if larger.
- Close on ship; punt leftovers to the next milestone.

## Label scheme

Prefer a small, **prefixed** scheme over freeform labels. Prefixes make labels self-grouping in the label list and unambiguous in filters. A good default:

- `type:` — `type: feature`, `type: bug`, `type: chore`, `type: docs`
- `priority:` — `priority: P0` … `priority: P3`
- `status:` — `status: blocked`, `status: needs-design`, `status: ready`
- `area:` — `area: api`, `area: frontend`, `area: infra` (match your codebase's real boundaries)

Optional, only if needed:

- `needs:` — `needs: design`, `needs: product`, `needs: review`
- `good first issue` / `help wanted` — GitHub's conventional contributor labels; keep these as-is since tooling recognizes them.

## Labels vs milestones vs iterations — who owns what

Don't encode the same thing in two places:

- **Milestone** owns _what ships and roughly when_.
- **Iteration** owns _which cycle it's worked in_ (teams only).
- **Labels** own _type, priority, current state, and area_ — the cross-cutting filters.

If you find yourself making a label like `milestone: v2` or `sprint: 14`, stop — that's a milestone or iteration field's job, and duplicating it guarantees drift.

## Color guidance

Light touch, but a consistent palette helps scanning: reds/oranges for `priority` and `type: bug`, blues/greens for `type: feature` and `status: ready`, gray for `chore`/`docs`, a distinct warning color for `status: blocked`. The exact hues matter less than using them consistently across the prefix family.
