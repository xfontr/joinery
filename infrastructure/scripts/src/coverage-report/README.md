# 📊 `pnpm test:coverage`

Merges every project's `coverage-final.json` into one HTML report at the workspace `coverage/`
([0003](../../../../docs/decisions/0003-coverage-report-merge.md) has why).

| Command | What it does |
| --- | --- |
| `pnpm test:coverage` (root) | `nx run-many -t test:coverage`, then merge and render `coverage/index.html` |

## 🗂 Structure

```
index.ts              hands main to run()
main.ts               loads the files discover.ts names, merges them, hands the result to files.ts
adapters/nx.ts        asks nx which projects declare test:coverage, and where each writes its output
adapters/files.ts     reads one coverage-final.json off disk, and writes the merged HTML report
domain/discover.ts    nx's project + output shape → the coverage-final.json path per project
domain/merge.ts       loaded reports → one CoverageMap, refusing a partial merge
```

## ✅ What it refuses to do

It never renders a partial report: if any project with a `test:coverage` target has no
`coverage-final.json`, it exits 1 naming it. That's why the root script uses `run-many`, never
`affected`. Coverage keys must be absolute paths, so the report groups by project on its own.
