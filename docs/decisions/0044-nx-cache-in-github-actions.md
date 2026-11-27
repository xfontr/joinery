---
issue: 489
status: implemented
decision: accepted
---

# 🧭 The Nx cache lives in GitHub Actions, and Nx Cloud is disconnected

## Context

[`0026`](./0026-nx-cloud-remote-cache.md) kept Nx Cloud as CI's remote cache. Its Hobby plan gives
50,000 credits a month and charges 500 per CI pipeline execution, cached or not, so it covers about
100 runs. `CI` and `Deploy / Developer portal` report to it, and together they ran 27 times on
2026-11-22 and 25 times on 2026-11-23 (`gh run list`). The month's credits ran out in two days, and
Hobby switches Cloud features off until the reset.

## Result

**CI saves and restores `.nx/cache` through `actions/cache`, PR caches are deleted when the PR
closes, and the workspace no longer connects to Nx Cloud.**

| File | Change |
| --- | --- |
| [`ci.yml`](../../.github/workflows/ci.yml) `checks` | `actions/cache` on `.nx/cache`, key `nx-<sha>`, restore prefix `nx-` |
| [`ci.yml`](../../.github/workflows/ci.yml) `e2e` | Same, key `nx-<sha>-e2e`, restoring `checks`' entry for the same commit first |
| [`deploy-developer-portal.yml`](../../.github/workflows/deploy-developer-portal.yml) | `actions/cache/restore` only, so the whole-workspace `test:coverage` reuses what `CI` saved |
| Both `nx` steps | `NX_MAX_CACHE_SIZE: 2GB`, so each saved snapshot stays bounded as entries accumulate |
| [`pr-cache-cleanup.yml`](../../.github/workflows/pr-cache-cleanup.yml) | New. On `pull_request: closed`, deletes every cache under `refs/pull/<n>/merge` |
| [`nx.json`](../../nx.json) | `nxCloudId` removed, `neverConnectToCloud: true` added |
| [`repo-secrets.md`](../guides/repo-secrets.md) | `NX_CLOUD_ACCESS_TOKEN` rows removed |

GitHub lets a run restore caches from its own ref or the default branch only. A PR therefore starts
from master's snapshot and its own earlier pushes, and nothing a PR saves is ever read by master.

The pnpm store caches from `setup-node`'s `cache: pnpm` had filled 9.1 GB of the 10 GB repo quota
in 41 copies, about half of them saved by PRs that no other ref can read. The cleanup workflow
removes those along with the PR's Nx snapshots.

## Options considered

| Option | Why not |
| --- | --- |
| Stay on Nx Cloud Hobby | 500 credits per run covers about four days of this repo's CI |
| `@nx/s3-cache` on Cloudflare R2 | Deprecated by Nx on 2026-05-21 over CREEP (CVE-2025-36852), an unpatchable cache-poisoning design flaw, and its peer range is `nx >= 18 < 23` against the repo's 24 |
| Downgrade Nx to 22 to keep `@nx/s3-cache` | Pins the workspace to a dead plugin with a known vulnerability |
| Self-hosted server on Nx's remote-cache OpenAPI spec | A service to run, and Nx puts CREEP on the implementer: it must refuse overwrites and keep PR tokens read-only |
| Nx Cloud for the run dashboard, remote cache off | Each recorded run still costs 500 credits, and `--no-cloud` stops recording |
| Only master saves the pnpm cache | Also frees the quota, but slows every job on a lockfile PR; deleting on close costs nothing |

## Consequences

Laptops get no shared cache, which matches 0026: remote caching was CI-only already.

A merge re-runs the affected tasks on master even though the PR built the same inputs, because master
cannot read PR caches. That is the same rule that keeps a PR from poisoning master.

The Nx Cloud run dashboard is gone. Per-run timings live in the Actions tab, and Nx's own output in
each log shows which tasks were cache hits.

Tripwires:

- The `NX_CLOUD_ACCESS_TOKEN` repo secret and the Nx Cloud workspace still exist until the owner
  deletes them; nothing reads them.
- The `e2e` job runs in the Playwright container. If that image lacks `zstd`, its archive version
  differs from `checks`' and the restore misses, so e2e rebuilds rather than fails.
- [`logs.ts`](../../infrastructure/scripts/src/shared/domain/logs.ts) still filters Nx Cloud lines
  from CI logs. It is harmless and keeps older logs readable.
- The cleanup job needs `actions: write`, which GitHub withholds from fork PRs, so a fork PR's
  caches age out after seven days instead.

Revisit if laptops need a shared cache, or if Nx ships a free self-hosted cache that is safe from
CREEP.

## Confirmation

| Claim | Check |
| --- | --- |
| No Cloud connection | `grep -n nxCloudId nx.json` and `git grep -n NX_CLOUD_ACCESS_TOKEN -- .github docs/guides` return nothing |
| CI caches `.nx/cache` | `grep -n "path: .nx/cache" .github/workflows/*.yml` lists `ci.yml` twice and the portal deploy once |
| Cache hits happen | A second CI run on the same PR prints `[local cache]` beside the tasks it skipped |
| PR caches are deleted | After a merge, `gh cache list --ref refs/pull/<n>/merge` is empty |
| Quota stays clear | `gh api repos/{owner}/{repo}/actions/cache/usage` stays well under 10 GB |
