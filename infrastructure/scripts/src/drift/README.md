# 📚 drift

A cheap, non-AI nudge: for each project a branch touches, warn when its docs may be stale and offer
to file an issue. It never fails or blocks, and no hook runs it.

```sh
pnpm docs:drift                                              # merge-base(HEAD, master)..HEAD
DOCS_DRIFT_BASE=<sha> DOCS_DRIFT_HEAD=<sha> pnpm docs:drift  # any range
```

## Structure

```
main.ts             the range, the per-project loop, the prompt, the issue
adapters/git.ts     changed files, diff stats and text, last markdown commit
domain/detect.ts    the warn decision and its thresholds
```

## When it warns

Either condition is enough, for a project the range touches:

| Condition | Threshold (in [`detect.ts`](./domain/detect.ts)) |
| --- | --- |
| Docs are stale | No markdown under the project touched in 4 months |
| The change is big | ≥ 200 lines, ≥ 8 files, or any rename |

Both are proxies ([0002](../../../../docs/decisions/0002-docs-drift-detection.md)). An answered
warning is remembered by a hash of the project's diff, so the same diff never asks twice on this
clone.

Filing creates `Address documentation drift for <Name>` on the `Joinery` board, with an empty body.
