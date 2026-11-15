# 🤖 `pnpm invariants:check`

The one gate for the repo rules that hold whoever makes the edit: no lifecycle script, no build step
in `packages/*`, no hand-moved `version`, and every package's manifest and export contract. It runs
in `pre-commit`, in `ci.yml`, after every Claude edit to a manifest, and on the developer portal, so
a rule broken by hand fails the same way one broken by an agent does.

| Command | What it does |
| --- | --- |
| `pnpm invariants:check` | Check every manifest and package contract; warn about docs drift |
| `pnpm invariants:check --base=<ref>` | Also fail on a `version` that moved since `<ref>` |
| `pnpm invariants:check --json` | Print the findings as one JSON line and exit 0, for the portal |

## 🗂 Structure

```
index.ts       hands main to run()
main.ts        collects every finding, prints it, fails on a blocking one
adapters/      reads manifests, package files and the README; reads a manifest at a git ref
domain/        the bans, the package contracts and the tag-table comparisons
```

## ✅ What blocks and what warns

| Check | Where | Blocks? |
| --- | --- | --- |
| `preinstall`, `install`, `postinstall`, `prepare`, `prepublish`, `prepublishOnly` | the root and every project manifest | Yes. CI installs with `--ignore-scripts`, so one would work locally and do nothing there |
| A `build` script, or `main`, `types`, `typings` or `module` | `packages/*` | Yes. Packages export raw source through `exports` |
| `version` differs from `--base` | every project manifest | Yes, and only with `--base`, since a release commit moves every version |
| Name, version, `type`, export targets, peer metadata | `packages/*` | Yes |
| The README tag table names the same tags as [`boundaries.ts`](../../../../packages/configs/src/eslint/lib/boundaries.ts) | `README.md` | No. Docs checks stay advisory, per [`0025`](../../../../docs/decisions/0025-check-docs-removal.md) |
| Every project is in the README's workspace-layout block | `README.md` | No |

`--base` is what CI passes on a pull request (`NX_BASE`), and what the Claude hook passes as `HEAD`.
`pre-commit` leaves it off: a commit that resolves a merge from `master` carries that release's
version bumps, and would fail.

## 🧭 Deliberately deferred

| Later need | What changes |
| --- | --- |
| Validate a published artifact | Add a separate packaging experiment that defines tarball and consumer semantics; this command stays about the raw-source workspace contract |
| Block on docs drift | Flip `blocks` in `domain/tables.ts`, and supersede 0025, which keeps docs checks out of the gates |
| Catch a secret or per-environment value written into the repo | Needs a scanner with its own allowlist, not a manifest read; the root `CLAUDE.md` rule stays prose until then |
