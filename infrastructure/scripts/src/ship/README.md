# 🚀 ship

`pnpm issue:ship` pushes the current branch, opens a PR (or reuses the open one), arms GitHub
auto-merge, then waits for the checks and prints how it went. No flags, no prompts.

## 🗂 Structure

```
main.ts              push → PR → auto-merge → watch → report
adapters/git.ts      current branch, push
adapters/gh.ts       find or create the PR, arm auto-merge, watch checks, wait for the merge
domain/report.ts     the final line
domain/checks.ts     recognises gh's "no checks reported" message
```

## ⚙️ Behaviour

- Merging goes through `gh pr merge --auto`, so it only happens once the required checks pass.
  `MERGE_METHOD` in [`main.ts`](./main.ts) is `merge`.
- Re-running after a failed check is the same command: an existing PR is reused.
- Right after a push GitHub may report no checks yet; `watchChecks` retries for up to a minute. After
  checks pass, `waitForMerge` polls up to 60 s before reporting "merge queued".
- Uncommitted changes are left out, as with `git push`.

## 🔑 Requirements

`gh` logged in with push access, and the repo's *Allow auto-merge* setting on. Without it the run
stops with the PR open and nothing armed.
