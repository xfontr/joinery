# 🤖 The agent setup as one inspectable system

Claude Code's native layout: `CLAUDE.md` files for always-on rules, skills under
[`.claude/skills/`](../../.claude/skills/) for task procedures, and settings, hooks, subagents and
workflows beside them under `.claude/`. All tracked.

## 📄 Why `CLAUDE.md` reads the way it does

`CLAUDE.md` holds only what the READMEs and code don't show, or what agents get wrong anyway. Each
project's file is a pointer to its README plus the invariants worth losing a build over. The root
file loads every turn; a project's loads once Claude reads something there.

## 🪝 The hooks

Two `PostToolUse` hooks fire after every edit, and one `PreToolUse` hook before every shell
command.

| Hook | Enforces |
| --- | --- |
| [`eslint-fix.sh`](../../.claude/hooks/eslint-fix.sh) | Runs `eslint --fix` on the touched file, so style is corrected mechanically, and records each rule hit first for the portal's [lint usage](../../infrastructure/scripts/src/usage/README.md) |
| [`check-invariants.sh`](../../.claude/hooks/check-invariants.sh) | Runs [`pnpm invariants:check`](../../infrastructure/scripts/src/invariants/README.md) after a manifest edit, and reminds about the cross-file steps of a new project or a boundary change |
| [`guard-live.sh`](../../.claude/hooks/guard-live.sh) | Refuses `pnpm start`, `nuxt preview`, requests to the live WordPress site, force pushes and pushes to `master`: the things an unattended run must never do, whatever its prompt says |

The hooks are early feedback; `pre-commit` and CI run the same gates on edits made by hand.

## 🚫 What the deny list forecloses

[`.claude/settings.json`](../../.claude/settings.json) denies editing changelogs and
`docs/FEATURES.md`, running a release, and reading real `.env` files.

## 🛠 What the skills are collectively

A skill loads only for a matching task, which keeps procedures out of unrelated context.
[`docs/FEATURES.md`](../FEATURES.md) lists every skill.

## 🚢 The ship-issue pipeline

[`ship-issue.js`](../../.claude/workflows/ship-issue.js) takes issues to merged PRs with no human
reading the code: `/ship-issue 340 341`. Issues run one after another, each branching off the
`master` the previous one merged into.

| Stage | Who | Stops the run when |
| --- | --- | --- |
| Pick | The issue's labels, then `pnpm issue:pick` and `pnpm issue:brief` | The tree is dirty or the pick fails |
| Plan | [`ticket-planner`](../../.claude/agents/ticket-planner.md) | The issue needs a structure with no precedent, or a choice the issue leaves open |
| Implement | A general agent following the plan, then `pnpm check` | `check` is still red after two fixes |
| Review | [`review-architecture`](../../.claude/agents/review-architecture.md), [`review-tests`](../../.claude/agents/review-tests.md) and [`review-correctness`](../../.claude/agents/review-correctness.md) in parallel, then a fixer | Blocking findings survive two fix rounds |
| Polish | `comment-cleanup` and `doc-drift-check` | `check` goes red |
| Ship | Conventional commits, then [`pnpm issue:ship`](../../infrastructure/scripts/src/ship/README.md) | The required checks fail after one repair, or the PR never merges |

- An `owner` ticket is skipped. A `spike` ticket skips Plan, Review and Polish: one agent writes a
  decision report, runs `pnpm check`, and ships.
- The planner decides structure, and every file it plans names the existing path it copies, so an
  unattended run can't invent a convention.
- Reviewers get the issue and the diff, never the implementer's summary.
- Run it from a checkout nothing else writes to (`pnpm worktree:prepare`). The ship step commits only
  the paths the run touched.
- A stopped run labels the issue or PR `needs-human`, comments why, and starts nothing further.
- `git` and `gh` permissions live in each machine's `.claude/settings.local.json`.
