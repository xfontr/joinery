# Joinery

[![CI](https://github.com/xfontr/joinery/actions/workflows/ci.yml/badge.svg)](https://github.com/xfontr/joinery/actions/workflows/ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=xfontr_joinery&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=xfontr_joinery)
[![Netlify Status](https://api.netlify.com/api/v1/badges/cae76234-bf69-4487-9dee-505f9a006250/deploy-status)](https://app.netlify.com/projects/monorepo-idp/deploys)
[![Deploy / Developer portal](https://github.com/xfontr/joinery/actions/workflows/deploy-developer-portal.yml/badge.svg)](https://github.com/xfontr/joinery/actions/workflows/deploy-developer-portal.yml)
[![Release](https://github.com/xfontr/joinery/actions/workflows/release.yml/badge.svg)](https://github.com/xfontr/joinery/actions/workflows/release.yml)
[![Deploy / Huella Legal](https://github.com/xfontr/joinery/actions/workflows/deploy-huella-legal.yml/badge.svg)](https://github.com/xfontr/joinery/actions/workflows/deploy-huella-legal.yml)

A pnpm + Nx monorepo maintained by Xifré Font: Nuxt websites for small publications and
practices, the shared packages they build on, and the tooling that keeps them consistent. The
[developer portal](https://xifre.dev/portal/) is the readable way in.

| Worth reading first | Why |
| --- | --- |
| [`apps/huella-legal`](./apps/huella-legal/README.md) | The main product: a Nuxt 4 rebuild of a WordPress law magazine |
| [`@joinery/configs`](./packages/configs/README.md) | Shared presets and the in-house ESLint rules every project runs |
| [Architecture & boundaries](#architecture--boundaries) | How projects may depend on each other, enforced at lint time |
| [0028](./docs/decisions/0028-huella-legal-urls-and-cutover.md), [0030](./docs/decisions/0030-huella-legal-rendering-hosting-and-cost.md) | Two decisions: keeping old URLs working, and hosting cost |

## Workspace layout

<!-- docs:map:layout -->
```
packages/
    configs/          @joinery/configs — shared ESLint, Vitest, Playwright and tsconfig presets
    content/          @joinery/content — CMS entries and taxonomies + a Nuxt module
    i18n/             @joinery/i18n — translations core + a Nuxt module
    observability/    @joinery/observability — Grafana Faro in the browser, OpenTelemetry on the server
apps/
    developer-portal/ @joinery/developer-portal — the repository's developer portal over its docs, projects, architecture, workflows and engineering health
    huella-legal/     @joinery/huella-legal — Huella Legal, a WIP law blog redesign (Nuxt 4)
    marina-roustan/   @joinery/marina-roustan — Marina Roustan, a website rebuild (Nuxt 4)
    portfolio/        @joinery/portfolio — Xifré Font's personal site: the method, the work and the project maps
    wp-editor/        @joinery/wp-editor — local-only review-and-apply tool for bulk edits to WordPress posts and pages
infrastructure/
    scripts/          @joinery/scripts — repo-local dev tooling, one folder per script
    translations/     @joinery/translations — TMS serving the locale files over HTTP
```
<!-- /docs:map:layout -->

`packages/*` is shared code and the only thing `nx release` versions. `apps/*` are the products.
`infrastructure/*` is everything else: services apps call over the network, and repo tooling.

| Looking for | Go to |
| --- | --- |
| Anything about one project | Its own `README.md` |
| Every command, hook, workflow and skill | [`docs/FEATURES.md`](./docs/FEATURES.md) |
| Cross-project concepts and how-tos | [`docs/concepts/`](./docs/concepts/README.md), [`docs/guides/`](./docs/guides/README.md) — start with the [first hour](./docs/guides/first-hour.md) |
| Why something is the way it is | [`docs/decisions/`](./docs/decisions/README.md) |
| Known problems per project | [`docs/audits/`](./docs/audits/README.md) |
| Files the tooling reads and writes | [`data/`](./data/README.md) |

## Architecture & boundaries

Projects are layered with Nx tags (declared in each `package.json` under `nx.tags`) and enforced by
`@nx/enforce-module-boundaries` at lint time:

<!-- docs:map:type-tags -->
| Tag | May depend on | Who has it |
| --- | --- | --- |
| `type:app` | `type:integration`, `type:observability`, `type:config` | `developer-portal`, `huella-legal`, `marina-roustan`, `portfolio`, `wp-editor` |
| `type:integration` | `type:config` | `content`, `i18n` |
| `type:observability` | `type:config` | `observability` |
| `type:infra` | `type:config` | `translations` |
| `type:tooling` | `type:config` | `scripts` |
| `type:config` | nothing | `configs` |
<!-- /docs:map:type-tags -->

Every project also carries exactly one `scope:*` tag, and both rules apply at once:

<!-- docs:map:scope-tags -->
| Scope | May depend on | Who has it |
| --- | --- | --- |
| `scope:shared` | `scope:shared` | `configs`, `content`, `i18n`, `observability` |
| `scope:huella-legal` | `scope:huella-legal`, `scope:shared` | `huella-legal` |
| `scope:marina-roustan` | `scope:marina-roustan`, `scope:shared` | `marina-roustan` |
| `scope:portfolio` | `scope:portfolio`, `scope:shared` | `portfolio` |
| `scope:internal` | `scope:internal`, `scope:shared` | `developer-portal`, `wp-editor` |
| `scope:tooling` | `scope:tooling`, `scope:shared` | `scripts` |
| `scope:infra` | `scope:infra`, `scope:shared` | `translations` |
<!-- /docs:map:scope-tags -->

Apps compose, everything else stays a leaf, and nothing reaches into another product's scope.
The constraints live in [`boundaries.ts`](./packages/configs/src/eslint/lib/boundaries.ts);
[`docs/concepts/boundaries.md`](./docs/concepts/boundaries.md) has the why.

## Tooling conventions

- **pnpm catalog**: shared framework versions are pinned once in `pnpm-workspace.yaml` and
  referenced as `catalog:`.
- **No `project.json`**: Nx infers targets from plugins and package scripts; metadata lives in each
  `package.json`'s `nx` block.
- **Raw source packages**: `packages/*` export TypeScript/Vue source with no build step.
- **Shared configs**: every ESLint, Vitest, Playwright and tsconfig file wraps a preset from
  [`@joinery/configs`](./packages/configs/README.md).

## Getting started

Requires the Node version in `.nvmrc` and pnpm (version pinned via `packageManager` in
`package.json`).

```sh
pnpm install
pnpm quick-start                        # hooks, .env files, workspace coverage and developer-portal snapshot
pnpm dev                                # pick a project to start
```

Skip `pnpm quick-start` and the [git hooks](#git-conventions) never install: lifecycle scripts are
banned here, so Husky can't install itself.

`lint`, `typecheck`, `test` and `build` run on **affected** projects only (changed since `master`),
like CI. For everything, `pnpm exec nx run-many -t <target>`.
[`docs/FEATURES.md`](./docs/FEATURES.md) lists every other command.

| Command | What it does |
| --- | --- |
| `pnpm quick-start` | Install Git hooks, create `.env` files, collect coverage, refresh the portal's snapshot |
| `pnpm dev` | Pick a project and start it (`pnpm dev <name>` skips the picker). Installs first on a fresh clone |
| `pnpm lint` | Lint affected projects |
| `pnpm typecheck` | Typecheck affected projects |
| `pnpm test` | Test affected projects |
| `pnpm check` | Lint, typecheck and test affected projects, failures inline, then `docs:map --check` |
| `pnpm test:coverage` | The **whole workspace** with coverage, merged into [`coverage/index.html`](./infrastructure/scripts/src/coverage-report/README.md) |
| `pnpm build` | Build affected projects |
| `pnpm graph` | Open the Nx project graph |
| `pnpm docs:map` | Re-render [`docs/FEATURES.md`](./docs/FEATURES.md); `--check` asserts it is current |
| `pnpm release:dry` | Preview a release (versioning + changelogs) |

## Git conventions

Each rule is enforced by a hook or workflow;
[`change-lifecycle.md`](./docs/guides/change-lifecycle.md) has the order they fire in.

- Branches match `^(hotfix|fix|feature|release)/[^/]+/[0-9]+-.+`, so `master` can't be pushed.
  [`pnpm issue:pick`](./infrastructure/scripts/src/issue/README.md#pnpm-issuepick) makes one.
- Commits are [Conventional Commits](https://www.conventionalcommits.org)
  ([`commitlint.config.mjs`](./commitlint.config.mjs)). [`commit-msg`](./.husky/commit-msg) adds the
  branch's issue number: `feat: [#50] add thing`.
- [`pre-commit`](./.husky/pre-commit) blocks on a stale `docs/FEATURES.md` or a failing
  [`pnpm invariants:check`](./infrastructure/scripts/src/invariants/README.md), and stages
  [`pnpm usage:flush`](./infrastructure/scripts/src/usage/README.md)'s telemetry.
- [`pre-push`](./.husky/pre-push) rejects a bad branch name or an added `TODO`/`FIXME` (file it with
  [`pnpm issue:add`](./infrastructure/scripts/src/issue/README.md)), then runs lint, test,
  typecheck and `pnpm unused:check`, which fails on any export, file or dependency nothing uses
  ([`knip.config.ts`](./knip.config.ts)). A spec counts as a user.
- [`pnpm issue:ship`](./infrastructure/scripts/src/ship/README.md) pushes, opens the PR and arms
  auto-merge.
- PRs get their title, assignees and project from the issue
  ([`pr-metadata.yml`](./.github/workflows/pr-metadata.yml)), path labels
  ([`pr-labeler.yml`](./.github/workflows/pr-labeler.yml)) and an advisory docs review
  ([`pr-docs-review.yml`](./.github/workflows/pr-docs-review.yml)).
- [`post-checkout`](./.husky/post-checkout) and [`post-merge`](./.husky/post-merge) warn when
  `pnpm-lock.yaml` changed, run [`pnpm env:sync`](./infrastructure/scripts/src/env-sync/README.md)
  when a `.env.example` did, and refresh
  [`pnpm workflow:sync`](./infrastructure/scripts/src/workflow/README.md) in the background.
- Manual only: [`pnpm docs:drift`](./infrastructure/scripts/src/drift/README.md).
- Five secrets nothing provisions; see
  [`docs/guides/repo-secrets.md`](./docs/guides/repo-secrets.md).

## Versioning

Versions and changelogs are derived from commit messages by `nx release` — no manual bumps.

- Each `packages/*` project is versioned **independently**, from the commits that touched its files.
- `feat` → minor, `fix` → patch; `chore`, `refactor`, `docs`, `test`, `ci` and `style` don't bump.
  A `!` suffix or `BREAKING CHANGE:` footer → major.
- While a package is on `0.x`, Nx downshifts bumps one level (breaking → minor, feat → patch).
- Current versions come from git tags (`<projectName>@<version>`), falling back to `package.json`.
- Packages depending on a bumped package get a patch bump and a "Updated Dependencies" entry.

Cut versions with the **Release** workflow ([`release.yml`](./.github/workflows/release.yml)):
leave `dry-run` on to preview, tick `first-release` only for a project with no tag yet. Each bumped
package gets a GitHub Release. Locally, `pnpm release:dry` previews.
