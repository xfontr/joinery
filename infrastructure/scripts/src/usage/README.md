# 📊 usage

Records which scripts get run and which lint rules agents trip, for the developer portal's Tooling
usage page. Rows go to a buffer inside `.git`; `pnpm usage:flush` (run by `pre-commit`) moves them
into `data/telemetry/<log>/<branch>.csv`.

| Log | Written by | Sees |
| --- | --- | --- |
| `scripts` | [`run()`](../shared/cli.ts), after every script | Every run, yours and agents' |
| `lint` | [`eslint-fix.sh`](../../../../.claude/hooks/eslint-fix.sh), after each agent edit | **Agent edits only.** Your editor fixes yours on save |

## 🗂 Structure

```
main.ts              for each log: take the buffer, append complete rows to this branch's file
adapters/files.ts    buffer rename and read, log append
```

The recorder (`domain/usage.ts`, `adapters/usage.ts`) lives in [`shared/`](../shared/README.md),
since `run()` calls it. It owns both logs' columns.

## 🧾 What a row holds

The repo is public, so rows hold nothing private: the day (never the time), the script and
subcommand, a project name, flag names (values only for `type` and `project`), the branch's area,
the caller (`human` or the agent's name), exit code and duration. Lint rows hold the rule, project,
severity and whether it's fixable — no path, no message. Cells never contain commas, so the portal
splits on `,`.

## 🔁 Why buffer in `.git`

Writing there keeps a script run from dirtying the working tree. One file per branch means two PRs
never conflict.

## 🙈 Never recorded

Runs in CI, under Vitest, inside a git hook, `usage:flush` itself, and the root one-liners that don't
go through `run()` (`pnpm check`, `lint`, `test`, `release`).
