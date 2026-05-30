# Solo dev / tiny project

When it's one person (or a hobby project with occasional contributors), keep the machinery minimal. Overhead that a team amortizes across many people is pure tax on a solo dev.

## Recommended structure

- **Milestones only** for the planning axis. Skip iterations/sprints entirely — you don't need a second axis to coordinate yourself.
- **Issues** for anything that takes more than one sitting or that you might forget. Trivial same-session fixes don't need an issue.
- **A single GitHub Project board** (optional) only if you like a visual kanban. For many solo devs the repo's Issues tab with milestone filters is enough.
- **A lean label set**: `type: bug`, `type: feature`, `type: chore`, plus maybe `priority: high`. Resist adding more until you feel actual pain.

## Milestones for solo work

Each milestone = a release you'd actually announce or deploy, named `[scope]: outcome`. Example progression for a small app:

- `v0.1: core CRUD working`
- `v0.2: auth + user accounts`
- `v0.3: public beta polish`

Set a loose due date so the progress bar shows up. When you ship, close it — punt unfinished issues to the next milestone.

## What to deliberately skip

- No iteration/sprint field — no one to coordinate with.
- No estimate/points field — velocity tracking is meaningless solo.
- No assignee field — it's always you.
- No standup/retro rituals — though a 10-minute weekly "what shipped / what's next" review against your milestones keeps you honest.

## When to graduate to the team setup

The moment a second person is regularly picking up work, you'll feel the gap: milestones no longer tell each of you what to do _this week_. That's the signal to add the iteration axis and a real GitHub Projects board — point them to the team reference.
