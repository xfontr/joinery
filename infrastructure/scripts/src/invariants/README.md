# 🤖 `pnpm invariants:check`

The gate for repo rules that hold whoever makes the edit: no lifecycle script, no build step in
`packages/*`, no hand-moved `version`, every package's manifest and export contract, no
one-sided `shared/` file in a Nuxt app, and README tables that match the code. Every finding fails
it. Runs in `pre-commit`, CI and the Claude edit hook (with `--base=HEAD`).

It runs on every edit, so a check belongs here only if it's fast. A whole-repo rule that takes
seconds, such as no unused exports, goes in `pnpm unused:check`, which runs at pre-push and in CI.

| Command | What it does |
| --- | --- |
| `pnpm invariants:check` | Check every manifest, package contract and README table |
| `pnpm invariants:check --base=<ref>` | Also fail on a `version` that moved since `<ref>` |

## Structure

```
index.ts       hands main to run()
main.ts        collects every finding, prints it, fails on any
adapters/      reads manifests, package files, workflows and the README; reads a manifest at a git ref
domain/        the bans, the package contracts, the shared/ sides, workflow names and the tag tables
```

## What it checks

| Check | Where | Why |
| --- | --- | --- |
| `preinstall`, `install`, `postinstall`, `prepare`, `prepublish`, `prepublishOnly` | the root and every project manifest | CI installs with `--ignore-scripts`, so one would work locally and do nothing there |
| A `build` script, or `main`, `types`, `typings` or `module` | `packages/*` | Packages export raw source through `exports` |
| `version` differs from `--base` | every project manifest | Only with `--base`, since a release commit moves every version |
| Name, version, `type`, export targets, peer metadata | `packages/*` | The export contract consumers compile against |
| A `shared/` file reached from only `app/`, or only from `server/`, `tools/`, `modules/` or a `nuxt.config.ts` | every app with a `nuxt.config.ts` | `shared/` is for code both sides use; specs and stories don't count, and a file nothing uses yet passes |
| A workflow's file isn't its `name` slugged (`Deploy / Portfolio` → `deploy-portfolio.yml`) | `.github/workflows/` | The Actions sidebar is flat and sorts by name, so the category prefix is what groups it |
| The README tag table names the same tags as [`boundaries.ts`](../../../../packages/configs/src/eslint/lib/boundaries.ts) | `README.md` | `pnpm docs:map` renders it; a new tag needs a re-render |
| Every project is in the README's workspace-layout block | `README.md` | Same, from each project's `description` |

CI passes `--base` on a pull request. `pre-commit` doesn't, since merging `master` brings in release
version bumps.
