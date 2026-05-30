# Team workflow on GitHub

For 2–8+ people. The defining change from solo work is running **two planning axes at once** and driving day-to-day work from a **GitHub Project** (the modern Projects, not classic), not from the repo's Issues tab.

## The two axes

- **Milestones** = _what ships and when it's done._ Outcome-scoped, weeks to months. These map to releases/announcements.
- **Iterations** = _what each person works on this cycle._ Time-boxed, 1–2 week cadence.

Every issue carries **both** plus labels: one milestone, one iteration. This is the rule that keeps the "what we're shipping" view and the "what we're doing now" view in sync. Milestones don't tell Sara what to start Monday; iterations do. Iterations don't tell stakeholders what's launching next quarter; milestones do.

## The board lives in GitHub Projects

Create a GitHub Project for the team and drive everything from its custom fields. The repo milestone feature still exists and still tracks completion %, but the Project is where the team actually works.

### Status field = the kanban board

`Backlog → Ready → In progress → In review → Done`

The column teams forget is **In review**. PRs sit there waiting on a reviewer; if it's invisible, review latency becomes invisible and cycle time quietly balloons. Make it a first-class column and watch it in standup.

### Custom fields that earn their place

Keep these lean — every field is a tax on whoever fills it out.

- **Iteration** — built into Projects as a first-class field type. Set the cadence (e.g. 2 weeks) and GitHub auto-rolls it forward, giving you burndown and velocity for free.
- **Priority** (P0–P3) — triage within a cycle without re-litigating.
- **Estimate** (points) — feeds velocity. Only adopt if the team will actually maintain it; a half-filled estimate field is worse than none.
- **Assignee / squad** — matters once you're past ~5 people and want to slice the board per sub-team.

Don't add more fields speculatively. Add a field only when a recurring question can't be answered without it.

## Rituals (the structure is inert without cadence)

Map each ritual to a concrete board action:

- **Backlog refinement** (weekly) — move issues Backlog → Ready, attach milestones + estimates.
- **Sprint planning** (start of iteration) — pull Ready issues into the new iteration until capacity is hit.
- **Standup** (daily, can be async via a saved board view) — everyone scans In progress + In review for their name; flag blockers.
- **Review / retro** (end of iteration) — close the iteration; close any milestone whose release shipped, punting leftover issues forward.

## Saved views are the real interface

A team's Project gets noisy fast. Build and pin a handful of saved views — most friction people blame on the tool is a missing view:

- **My open work** — filtered to the viewer, In progress + Ready.
- **This iteration by status** — board grouped by Status, filtered to current iteration.
- **Blocked** — anything with `status: blocked`.
- **Priority sweep** — P0/P1 across all milestones, for triage.

## Automations worth setting up

GitHub Projects has built-in workflow automation (and GitHub Actions for more):

- Auto-set Status to **In progress** when an issue is assigned.
- Auto-move to **In review** when a linked PR opens.
- Auto-move to **Done** and close the issue when the PR merges.
- Auto-add new repo issues to the Project in **Backlog**.

These remove the manual board-shuffling that otherwise rots within two weeks.

## Squads on one board

For larger teams, keep a single Project (one source of truth) and slice by an **assignee/squad** field rather than splitting into multiple boards. Per-squad saved views give each group its focused slice while leadership keeps the cross-cutting view. Multiple boards drift out of sync; one board with views does not.

## Team-specific traps

- **Milestones as sprints** — the cardinal sin. Milestone = _what_, iteration = _when worked_. Keep them orthogonal.
- **Invisible review queue** — surface the In review column or cycle time balloons silently.
- **Estimate theater** — don't adopt points unless the team maintains them honestly.
- **Multiple drifting boards** — one Project + saved views beats many boards.
- **No automation** — manual board upkeep decays; wire the PR-driven transitions early.
