# 🏷 How a version gets derived from a commit

The [root README](../../README.md#versioning) has the bump rules. The point of this page: no
version number in this repo is ever someone's judgment call.

## The chain

1. [`commit-msg`](../../.husky/commit-msg) adds the issue number and runs commitlint
   (`@commitlint/config-conventional`, no overrides). A non-conventional commit never lands.
2. `nx release` derives each `packages/*` version and changelog from the commits that touched that
   package since its last tag — never from `package.json`.
3. [`pnpm invariants:check --base`](../../infrastructure/scripts/src/invariants/README.md) fails a
   hand-edited `version`, in CI and after every agent edit to a manifest.

## Why each package versions independently

A `fix` in one package and a `feat` in another give two bumps on two tags, so a consumer only
absorbs changes to code it uses. A package depending on a bumped one gets a patch bump and an
"Updated Dependencies" entry automatically.

## Why `0.x` downshifts

On `0.x`, breaking → minor and `feat` → patch, so a package doesn't jump to `1.0.0` before it has
consumers to break.

## Why release only runs from the workflow

Local `nx release` and `pnpm release` are denied in [`.claude/settings.json`](../../.claude/settings.json).
A version cut on one machine depends on what happens to be checked out there — exactly the manual
bump the chain exists to avoid. `pnpm release:dry` previews locally.
