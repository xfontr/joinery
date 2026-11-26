# 🔄 A change, end to end

From picking an issue to a released version. Each step links to the hook, script or workflow that
does it.

## 1. Pick the issue

```sh
pnpm issue:pick
```

Creates and checks out `<type>/<area>/<issue number>-<slug>` and assigns you. Later steps read the
issue number from that name; a hand-made branch without it silently skips steps 2 and 5.

## 2. Commit

| Hook | Does |
| --- | --- |
| [`pre-commit`](../../.husky/pre-commit) | Blocks on a stale `docs/FEATURES.md` or a failing [`invariants:check`](../../infrastructure/scripts/src/invariants/README.md). Runs [`env:sync`](../../infrastructure/scripts/src/env-sync/README.md) if a `.env.example` is staged. Stages [`usage:flush`](../../infrastructure/scripts/src/usage/README.md)'s telemetry |
| [`commit-msg`](../../.husky/commit-msg) | Adds the issue number (`feat: add thing` → `feat: [#50] add thing`), then runs commitlint |

Commitlint is `@commitlint/config-conventional`: lower-case type, and a subject that isn't
capitalised. `feat: add thing` passes; `feat: Add thing` doesn't.

## 3. Push

[`pre-push`](../../.husky/pre-push), in order:

1. Branch name must match `^(hotfix|fix|feature|release)/[^/]+/[0-9]+-.+`.
2. No new `TODO`/`FIXME` in the pushed commits — file it with `pnpm issue:add` instead.
3. `pnpm audit`, warning only.
4. Lint, test and typecheck on affected projects — **in the working tree**, so uncommitted changes
   count.
5. `pnpm unused:check` on the whole workspace, since an export goes unused when its last importer
   changes, not itself.

## 4. Ship

`pnpm issue:ship` ([README](../../infrastructure/scripts/src/ship/README.md)) pushes, opens or reuses
the PR, arms auto-merge and waits for checks.

## 5. The PR fills itself in

- [`pr-metadata.yml`](../../.github/workflows/pr-metadata.yml) copies the issue's title, assignees and
  project onto the PR. Needs `PROJECTS_TOKEN`; no-ops on forks.
- [`pr-labeler.yml`](../../.github/workflows/pr-labeler.yml) adds path labels, and
  [`pr-docs-review.yml`](../../.github/workflows/pr-docs-review.yml) posts an advisory docs review.

## 6. CI

[`ci.yml`](../../.github/workflows/ci.yml) on every PR and push to `master`:

| Step | Scope | Already run locally? |
| --- | --- | --- |
| `docs:map --check`, `invariants:check` | Whole workspace | Yes, pre-commit |
| `unused:check` | Whole workspace | Yes, pre-push |
| `lint`, `typecheck`, `test:coverage`, `build` | Affected | Lint, typecheck and test (without coverage) at pre-push |
| `test:e2e` | Affected, in parallel with `checks` and not required | No |
| Dependency review | The PR's diff | `pnpm audit`, roughly |

So coverage thresholds and builds fail only in CI — and huella-legal typechecks during its build.

The `master` ruleset requires a PR with no review. Required checks: `checks` and
`dependency-review` from CI, `huella-legal` from the Netlify workflow, plus SonarCloud.

## 7. Release

Merging isn't releasing. Run the **Release** workflow by hand; see
[versioning](../concepts/versioning.md).
