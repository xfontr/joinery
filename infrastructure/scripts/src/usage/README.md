# 📊 usage

Records which scripts get run, how they ended and how long they took, which lint rules agents trip,
and how long each Nx task takes, for the developer portal's Tooling usage page. Rows go to a buffer
inside `.git`; `pnpm usage:flush` (run by `pre-commit`) moves them into
`data/telemetry/<log>/<branch>.csv`.

| Log | Written by | Sees |
| --- | --- | --- |
| `scripts` | [`run()`](../shared/cli.ts), after every script | Every run, yours and agents' |
| `lint` | [`eslint-fix.sh`](../../../../.claude/hooks/eslint-fix.sh), after each agent edit | **Agent edits only.** Your editor fixes yours on save |
| `tasks` | [`tasks`](../tasks/README.md), after every root Nx command | Every Nx task of `pnpm check`, `lint`, `test`… — git hooks' too |

## Structure

```
main.ts              for each log: take the buffer, append complete rows to this branch's file
adapters/files.ts    buffer rename and read, log append
domain/rows.ts       carrying rows and files written under a log's previous header over
```

The recorder (`domain/usage.ts`, `adapters/usage.ts`) lives in [`shared/`](../shared/README.md),
since `run()` calls it. It owns every log's columns.

## What a row holds

The repo is public, so rows hold nothing private: the day (never the time), and no path, message or
free-text flag value. Cells never contain commas, so the portal splits on `,`.

| Log | Columns |
| --- | --- |
| `scripts` | Script, subcommand, project named, flag names (values only for `type` and `project`), branch area, caller (`human` or the agent), exit code, `outcome`, `error`, `ms` |
| `lint` | Rule, project, severity, whether it's fixable, caller |
| `tasks` | Run id, the root command (`trigger`), the git hook if any, caller, area, project, target, `cache` hit or miss, exit code, `ms`, `load` |

`outcome` is why a run ended, so a refusal never reads as a crash:

| Outcome | Means |
| --- | --- |
| `ok` | Finished cleanly |
| `finding` | Exited non-zero without throwing — a `--check` that found drift, a red Nx run |
| `refused` | An `ExpectedError`: bad input, nothing to do, a precondition unmet |
| `usage` | No subcommand matched |
| `crash` | Anything else; `error` holds its kind, e.g. `gh:exit` or `ENOENT`, never the message |
| `cancelled` | A prompt answered with Ctrl+C or escape |
| `interrupted` | Ctrl+C on the run itself; `ms` is then how long it was left open |

`load` is the 1-minute load average per core when the task started, so a slow run beside other
worktrees' builds reads as one. A cache hit's `ms` is Nx restoring output; time only the misses.

## Changing a log's columns

Worktrees on older code keep writing the old width into the shared buffer. Give the log a
`previous` header and an `upgrade` in [`LOGS`](../shared/domain/usage.ts): the flush carries old
rows over, and rewrites a branch file still under the old header before appending to it.

## Why buffer in `.git`

Writing there keeps a script run from dirtying the working tree. One file per branch means two PRs
never conflict.

## Never recorded

Runs in CI or under Vitest, and `usage:flush` itself. A git hook's script runs are left out of
`scripts`, since nobody chose them, but its Nx tasks are kept in `tasks` with `hook` set, since
that's where a slow check is felt. `pnpm release` and `graph` don't go through `run()`.
