# 🌳 worktree

Gets a linked git worktree (such as Claude Code's `.claude/worktrees/`) ready for its first `lint`,
`test` or `dev`: copies the git-ignored env files and runs CI's install.

```sh
pnpm worktree:prepare .claude/worktrees/agent-a1     # relative to where you typed it
pnpm worktree:prepare                                # lists linked worktrees with no node_modules
```

Run it from a checkout that's already installed. A fresh worktree can't run it on itself: every
script here imports `@clack/prompts`, which isn't there yet.

## 🗂 Structure

```
index.ts               hands main to run()
main.ts                resolve the path, copy env files, install, report
adapters/git.ts        git worktree list, the ignored env files of a checkout
adapters/files.ts      copy-if-missing, the node_modules probe, realpath
adapters/pnpm.ts       pnpm install --frozen-lockfile --ignore-scripts in the worktree
domain/worktree.ts     the porcelain parser and which paths count as env files
```

## 📋 The steps

| Step | Why |
| --- | --- |
| Find the path in `git worktree list` | Refuses a directory that isn't a linked worktree, so it never installs over the main checkout |
| Copy `.env` and `.env.*` from the main checkout | They're git-ignored, so a worktree starts without them. `.env.example` is tracked, so it's never listed; an existing file is never overwritten |
| `pnpm install --frozen-lockfile --ignore-scripts` | The same install every CI workflow runs. The pnpm store is shared, so it takes seconds |

No `nuxi prepare` is needed (Nx and the Vitest presets handle `.nuxt`), and hooks already work
through the shared `core.hooksPath`.
