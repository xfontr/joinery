# 🧰 shared

What more than one script needs. Nothing here knows a script exists.

## What's here

| File | What it is |
| --- | --- |
| [`cli.ts`](./cli.ts) | `run` (argv parsed once, one meaning per exit code), `fail` and `flag` |
| [`errors.ts`](./errors.ts) | `ExpectedError` and `CancelledError`, which `run` treats as answers, not bugs |
| [`adapters/io.ts`](./adapters/io.ts) | The terminal: `out.*`, and `requireTerminal` before any prompt |
| [`adapters/exec.ts`](./adapters/exec.ts) | Subprocesses: `run`, `capture`, `inherit`, and `assertNotFlagLike` |
| [`adapters/git.ts`](./adapters/git.ts) | `git`, `repoRoot()` and `at()` |
| [`adapters/gh.ts`](./adapters/gh.ts) | `gh` and `createIssue` |
| [`adapters/usage.ts`](./adapters/usage.ts) | `appendUsage`, the row `run()` records after every command |
| [`adapters/cache.ts`](./adapters/cache.ts) | The file cache under `node_modules/.cache/@joinery/scripts` |
| [`adapters/prompts.ts`](./adapters/prompts.ts) | `orExit`, so a cancelled prompt unwinds to `run` |
| [`domain/cli.ts`](./domain/cli.ts) | The argv parser, `optionValue`, `detailOf` |
| [`domain/usage.ts`](./domain/usage.ts) | What a recorded run holds — see [`usage/`](../usage/README.md) |
| [`domain/layout.ts`](./domain/layout.ts) | `PROJECT_ROOTS` |
| [`domain/logs.ts`](./domain/logs.ts) | `stripAnsi` and `excerpt` |

Code moves here when a second script needs it. Facts about the environment (the repo root, the
terminal) live here from the start, so there's only one copy.

## No side effects at module scope

No `run()`, `git()` or `readFileSync` at a file's top level, and read `process.argv`/`process.env`
inside a command or through `flag()`. Breaking this once made two modules unimportable outside a git
checkout.
