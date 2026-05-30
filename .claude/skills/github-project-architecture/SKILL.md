---
name: github-project-architecture
description: Design how a software project is structured and tracked on GitHub — milestones, GitHub Projects boards, iterations/sprints, issues, labels, and the rituals that tie them together. Use this skill whenever the user asks how to organize, structure, plan, or track work on GitHub, or mentions milestones, GitHub Projects, sprints, iterations, issue triage, label schemes, roadmaps, or team workflow on GitHub — even casually ("how should I set up my repo", "what's the best way to plan releases", "how do we run sprints on GitHub", "help me structure my backlog"). Trigger even when GitHub isn't named explicitly but the user is clearly planning engineering work that will live in a repo. Do NOT use for Git mechanics (branching, rebasing, merge conflicts) or for non-GitHub trackers like Jira or Linear unless the user wants to map those concepts onto GitHub.
---

# GitHub Project Architecture

Help the user design a project-tracking structure on GitHub that scales with their team and stays honest about _what ships_ versus _what's being worked on right now_. The output is almost always advice plus a concrete recommended structure — not code.

## Core mental model

The single most important idea, and the one to lead with: **milestones represent shippable outcomes, not time buckets or task lists.** Every milestone should answer "what can users do after this ships?" If a proposed milestone can't answer that, it's really a sprint, an epic, or a label in disguise.

The second key idea for any team larger than one: **run two planning axes at once.**

- **Milestones** answer _"what are we shipping and when is it done?"_ — outcome-scoped, span weeks to months.
- **Iterations / sprints** answer _"what is each person working on this cycle?"_ — time-boxed, recur on a fixed cadence.

A solo dev can get by with milestones alone. A team cannot, because milestones don't tell anyone what to pick up Monday morning and don't surface who's overloaded. The two axes stay orthogonal: an issue gets **one milestone (the outcome it serves) + one iteration (the cycle it's worked in) + labels**. Never collapse milestone into sprint — milestones then inherit sprint churn and stop representing real outcomes.

## How to respond

1. **Detect scale first.** Solo/hobby, small team (2–8), or larger org. The right structure differs sharply. If it's ambiguous and matters, ask one quick question; otherwise infer from context and state your assumption.
2. **Lead with the mental model**, then give the concrete structure for their scale.
3. **Recommend, don't enumerate.** Give an opinionated default structure rather than listing every GitHub feature. The user can ask to go deeper.
4. **Name the traps.** Each scale has predictable failure modes (below). Surfacing them is high-value.
5. **Offer a next step** — e.g. label scheme, automation setup, or saved views — rather than dumping everything at once.

If the user would benefit from _seeing_ the hierarchy, a simple top-down diagram (roadmap → release → milestone → issue, or the two-axis team view) communicates faster than prose. Keep boxes sparse.

## Read the right reference

- For a **solo dev or tiny project** → see `references/solo.md`.
- For a **team** (the most common deep-dive) → see `references/team.md`. Covers GitHub Projects boards, iteration fields, custom fields, saved views, automations, and squads.
- For **label and milestone naming conventions** that apply at any scale → see `references/conventions.md`.

Read only the file that fits the user's situation. Don't preload all three.

## Milestone naming (applies everywhere)

Use a `[scope]: outcome` pattern so the milestone list is scannable and filterable: `Auth: SSO login flow`, `Billing: subscription upgrade UX`, `API: rate limiting`. Always set a due date even if rough — GitHub's milestone progress bar only renders alongside one. Keep scope to roughly 5–20 issues; past 20 you likely have two milestones pretending to be one. Close a milestone when its release ships, even if a couple of issues get punted to the next one — a graveyard of stale open milestones is a navigation nightmare.

## Universal traps to watch for

- **Milestones as sprints** — the most common mistake on teams. Keep them orthogonal.
- **Issues spanning two milestones** — breaks the completion-% math. One milestone per issue, always.
- **Label sprawl** — dozens of overlapping labels nobody applies consistently. Prefer a small prefixed scheme (`type:`, `priority:`, `status:`, `area:`) over freeform labels.
- **Open milestones forever** — close on ship.
- **No saved views (teams)** — most friction blamed on "the tool" is actually a missing saved board view.
