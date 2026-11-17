# 🤖 `pnpm invariants:check`

The gate for repo rules that hold whoever makes the edit: no lifecycle script, no build step in
`packages/*`, no hand-moved `version`, and every package's manifest and export contract. Runs in
`pre-commit`, CI, the Claude edit hook (with `--base=HEAD`) and the developer portal's collector.

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

CI passes `--base` on a pull request. `pre-commit` doesn't, since merging `master` brings in release
version bumps.
