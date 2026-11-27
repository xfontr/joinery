# 🤖 @joinery/scripts

The repo's CLI scripts: dev startup, issues, doc checks and gates.

⚠️ This is a mostly vibe-coded app, with low human intervention. Why: it's purely a DX tool. I do not
have the resources to properly build and maintain this, so I went for the quick and easy shortcut.

One folder per script under `src/`, each with its own README. This one covers what they share.

## Structure

Every script folder has the same four things:

```
index.ts     the entry point. Hands its commands to run() and does nothing else
main.ts      the command — or one file per subcommand, named after it, the way issue/ has add + pick
adapters/    one file per boundary out: git.ts, gh.ts, nx.ts, files.ts, prompts.ts, io.ts
domain/      pure functions and their types. No fs, no subprocess, no clack, no process
```

| Script | Command | What it's for |
| --- | --- | --- |
| [`dev`](./src/dev/README.md) | `pnpm dev` | Picking which project to start, and installing the workspace first on a fresh clone |
| [`issue add`](./src/issue/README.md#pnpm-issueadd) | `pnpm issue:add` | Picking a project and label, then filing an issue with `gh` |
| [`issue pick`](./src/issue/README.md#pnpm-issuepick) | `pnpm issue:pick` | Picking an open issue off a project board, then branching off it and self-assigning |
| [`issue brief`](./src/issue/README.md#pnpm-issuebrief) | `pnpm issue:brief` | Printing an issue with its comments, blockers, decisions, projects and linked docs |
| [`ship`](./src/ship/README.md) | `pnpm issue:ship` | Pushing the current branch, opening or reusing its PR, arming auto-merge, then blocking on checks |
| [`ci-failures`](./src/ci-failures/README.md) | `pnpm ci:failures` | Reporting a PR's failed checks, each Actions job cut to its error lines |
| [`worktree`](./src/worktree/README.md) | `pnpm worktree:prepare` | Copying env files into a linked worktree and installing it the way CI does |
| [`env-sync`](./src/env-sync/README.md) | `pnpm env:sync` | Keeping each `.env` in its `.env.example`'s order and comments, creating missing ones |
| [`workflow`](./src/workflow/README.md) | `pnpm workflow:setup`, `workflow:sync`, `workflow:next`, `workflow:file`, `workflow:drop` | Managing a [workflow project](../../docs/workflows/README.md): set up, snapshot, list what's ready, file tickets, drop |
| [`brand`](./src/brand/README.md) | `pnpm brand:extract`, `brand:contrast` | Reading a live site's brand, and checking a token file's contrast |
| [`drift`](./src/drift/README.md) | `pnpm docs:drift` | Warning when a changed project's docs look stale, and offering to file it |
| [`map`](./src/map/README.md) | `pnpm docs:map` | Rendering the feature index, and asserting in CI that it's current |
| [`invariants`](./src/invariants/README.md) | `pnpm invariants:check` | The repo rules every author is held to, run by hooks and CI |
| [`usage`](./src/usage/README.md) | `pnpm usage:flush` | Moving the runs every script records into the committed log; the pre-commit hook runs it |
| [`tasks`](./src/tasks/README.md) | `pnpm check`, `lint`, `typecheck`, `test`, `build`, `test:coverage`, `unused:check` (root) | Running the root Nx commands and timing every task they run |
| [`coverage-report`](./src/coverage-report/README.md) | `pnpm test:coverage` (root) | Merging every project's coverage into one browsable HTML report |

## Run by agents, not only by people

An agent's shell has no terminal, so `isTTY` is false and `out` prints plain lines. Two rules
follow for every script:

- **A prompt never runs without a terminal.** Call `requireTerminal(hint)` from
  [`io.ts`](./src/shared/adapters/io.ts) before the first one, with a hint naming the arguments
  that make the prompt unnecessary. `pnpm issue:pick` with no number fails that way at once; with a
  number it asks nothing.
- **A command that reports a failure exits 1.**

## Which way imports go

**index.ts → the command → `adapters/` → `domain/`.** Never back up, and never sideways into another
script's folder. One scoped exception: a command may import another command *in the same folder*,
which is what keeps `add.ts` calling `pick.ts` legal — the alternative puts that prompt in the
dispatcher. `shared/` is reachable from anywhere and reaches nothing.

- An adapter is named after the boundary it wraps, so `git.ts` in several folders isn't duplication.
- Every side effect lives in `adapters/`.

[`eslint.pureDomain`](../../packages/configs/src/eslint/lib/pureDomain.ts) enforces the `domain/`
half; the rest is convention. [0004](../../docs/decisions/0004-scripts-architecture.md) has the
reasoning.

## Adding a script

The `scripts-new-script` skill has the steps. The rules:

- A folder under `src/` with `index.ts`, `main.ts`, `adapters/`, `domain/` and a `README.md`, a line
  in this package's `scripts` (`pnpm --silent cli src/<name>/index.ts`) and a row in the table above.
- Every `index.ts` is the same five lines; only [`dev/index.ts`](./src/dev/index.ts) differs, since
  it runs before `pnpm install`:

```ts
#!/usr/bin/env node
import { run } from "../shared/cli.ts";
import { main } from "./main.ts";

await run(main);
```

- `run` owns exit codes: `CancelledError` exits 0, `ExpectedError` prints its message and exits 1,
  anything else prints a stack. Never call `process.exit`.
- Code two scripts need moves to [`shared/`](./src/shared/README.md). Scripts never import each other.
- Entries run on plain `node` with type stripping, so internal imports use the `.ts` extension.
- Real logic (parsers, diffs, formatting) goes in its own file with a spec; prompts and `gh` calls
  aren't unit-tested.
- Don't name a folder `coverage/` or `types/`: both are in ESLint's
  [`baseIgnores`](../../packages/configs/src/eslint/lib/ignores.ts) and would go unlinted.

## Requirements

| Script | Needs |
| --- | --- |
| `issue/`, `ship/`, `drift/`, `workflow/`, `ci-failures/` | `gh` installed and logged in |
| `ship/` | The repo's *Allow auto-merge* setting on |
| `brand:extract` | Playwright's Chromium and the network |
