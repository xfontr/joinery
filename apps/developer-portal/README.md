# 📦 @monorepo/developer-portal

The repo's front door: every markdown file rendered as a wiki, plus what isn't written down —
coverage, the project graph, open issues, decisions, audits, workflows and tooling usage.

Under `pnpm dev developer-portal` it reads the working tree live. The deployed site is a prerendered
[snapshot of `master`](#-the-deployed-site-is-a-snapshot) on GitHub Pages.

## 🚀 Development

| Command | What it does |
| --- | --- |
| `pnpm dev developer-portal` | Start the portal, from the workspace root |
| `pnpm exec nx collect @monorepo/developer-portal` | Rebuild the snapshot in `.report/`: graph, coverage, metrics, docs, usage |
| `pnpm exec nx build-static @monorepo/developer-portal` | `nuxt build --prerender`, the build that deploys |
| `pnpm exec nx nuxt-prepare @monorepo/developer-portal` | Regenerate `.nuxt` by hand; Nx already runs it before lint, typecheck, test and build |

- Coverage is only as fresh as the last root `pnpm test:coverage`.
- `build` delegates to `build-static`, so CI builds what deploys.
- `.report/` is gitignored and every page must render without it.

## 🗂 Structure

| Path | What lives there |
| --- | --- |
| `app/` | The shell: layout, sidebar, Overview, and shared parts like `StatTile` and `DashboardGrid` |
| `layers/` | One Nuxt layer per capability — see [🧱 Layers](#-layers) |
| `tools/collect/` | The collector that builds the snapshot |
| `tools/lib/` | Node-only helpers: paths, `git`, the shape checks, the doc-link rewriter |

## 🧱 Layers

| Layer | Kind | What it owns |
| --- | --- | --- |
| `snapshot` | Core | The `.report/` store, its types, `useSnapshot` |
| `design` | Core | Tokens, shared classes and the Nuxt UI theme |
| `docs` | Core | Link rewriting and `ProseA` for rendered markdown |
| `github` | Core | Browser-side reads of GitHub issues and deployments |
| `decisions`, `audits`, `benchmarks` | Feature | Each record type's list and pages |
| `projects` | Feature | Projects, Architecture and What's new |
| `health` | Feature | Work in progress, Coverage, Dependencies |
| `telemetry` | Feature | Tooling usage |
| `workflows` | Feature | The Workflows pages |
| `wiki` | Feature | Documentation pages and the nav tree |

The rules match [huella-legal's](../huella-legal/README.md#-structure): the kit (`app/components/`,
`app/utils/`) uses only itself, cores use themselves and the kit, features also use cores but never
another feature. `eslint.layerBoundaries` in [`eslint.config.ts`](./eslint.config.ts) enforces it.

- Cross-layer imports read `#layers/<name>/…`, resolved by Nuxt and, outside it, by the `imports`
  field in [`package.json`](./package.json).
- No root `shared/`: a relative import into it broke the prerendered build
  ([0014](../../docs/decisions/0014-developer-portal-deployment.md)).
- Each layer declares its sidebar links under `nav` in its `app/app.config.ts`.

## 📄 What each page reads

| Page | Reads |
| --- | --- |
| Documentation | Every tracked `*.md`, read in place from the workspace root by [`content.config.ts`](./content.config.ts) |
| Architecture, Projects | The collected Nx graph, project metrics, and deleted projects from `git log` |
| Decisions | `docs/decisions/NNNN-<slug>.md` frontmatter |
| Audits | Every table in `docs/audits/` with an `ID` and a `Status` column |
| Benchmarks | `docs/benchmarks/*.md` frontmatter and body, and the screenshots beside them in `images/` |
| Workflows | `data/workflows/`, read on every request. Under `pnpm dev` the wizard and Settings page write it |
| Work in progress | Open issues, fetched from GitHub in the reader's browser |
| What's new | Every `CHANGELOG.md` plus unreleased commit counts |
| Engineering health | Coverage, `pnpm audit`, outdated deps and the invariant findings |
| Tooling usage | `data/telemetry/` CSVs, enabled lint rules and `eslint-disable` comments |

### Doc links

Docs link to files the GitHub way. [`remarkDocLinks`](./tools/lib/remarkDocLinks.ts) rewrites each
link at parse time: a markdown target becomes a route, anything else a link to the repo. A broken
link is counted on the Overview, never a build failure. Fix a link that breaks here in
[`docLinks.ts`](./layers/docs/shared/docLinks.ts), not in the doc.

`@nuxt/content` lower-cases every route, so anything joining a route to a repo path goes through
[`toCollectionPath`](./layers/docs/shared/docPages.ts).

### The wiki tree

Derived from paths alone, so a new doc appears on its own. Changelogs, dated audits, numbered
decisions and benchmark entries are left out of the tree since each has its own page; CLAUDE.md
files are left out of the collection and link to GitHub. ⌘K search loads on first open, not in the
layout, which kept it out of every page's payload.

### GitHub reads

Issues and deployments are fetched unauthenticated from the browser, so the site needs no server or
secret. The limit is 60 requests an hour per IP. Board placement (`projectItems`) is GraphQL-only and
needs a token, so it isn't shown.

## 🚢 The deployed site is a snapshot

[`developer-portal-deploy.yml`](../../.github/workflows/developer-portal-deploy.yml) publishes to
GitHub Pages on every push to `master` or by hand: `pnpm test:coverage`, then `collect`, then
`build-static`. Pages must be set to build from GitHub Actions in repo settings. huella-legal's
Storybook is built into the same artifact under `/huella-legal-storybook/`.

- Every page is as old as the last deploy, except issues and deployments (live) and workflows (as
  old as the last committed `pnpm workflow:sync`).
- `NUXT_APP_BASE_URL` and `NUXT_PUBLIC_REPO_URL` are baked in at build time, derived by the workflow.
- The project overrides its `production` Nx input in [`package.json`](./package.json) so any `*.md`
  or `data/workflows/` change makes it affected, and a `runtime` input over
  [`snapshotStamp.ts`](./tools/lib/snapshotStamp.ts) hashes the gitignored `.report/`.

## 🔍 Checks it surfaces

[`tools/lib/invariants.ts`](./tools/lib/invariants.ts) runs on every collect and shows findings on
the Overview. It blocks nothing.

| Check | Flags |
| --- | --- |
| `pnpm invariants:check --json` | Everything the [invariants gate](../../infrastructure/scripts/src/invariants/README.md) reports |
| `compareAuditShape` | An audit with a bad filename, missing frontmatter, a reused ID or an unknown status |
| `compareDecisionShape` | A decision with a bad filename, reused number, unknown `status:`/`decision:`, no `issue:` or a dangling `supersededBy:` |
| `compareWorkflowShape` | A workflow file that breaks [the workflow rules](../../docs/workflows/README.md) |

## 🎨 Design system

The [`design`](./layers/design) layer is the only place a value is chosen. Components use Nuxt UI's
semantic roles and Tailwind's scale; ESLint rejects bracketed values.

| Piece | Where | What it is |
| --- | --- | --- |
| `--tone-good`, `-warn`, `-bad` | [`main.css`](./layers/design/app/assets/main.css) | The three status colours; [`toneClass`](./app/utils/format.ts) maps a `Tone` to its class |
| `text-2xs` | `main.css` | The one step under `text-xs` |
| `.data-table`, `.numeric` | `main.css` | Every table |
| `.embedded-report` | `main.css` | The frame around the coverage report and Nx graph |
| `variant="flush"` on `UCard` | [`app.config.ts`](./layers/design/app/app.config.ts) | A card with no body padding |
| `--state-*`, `--stage-*` | [`workflows.css`](./layers/workflows/app/assets/workflows.css) | Workflow colours, kept with that feature |
| `--usage-*` | [`telemetry.css`](./layers/telemetry/app/assets/telemetry.css) | Tooling-usage colours, kept with that feature |

The three status colours were validated as a set for contrast and colour-blind separation. Re-run
the `dataviz` skill's validator before changing one.

## 📐 Boundaries

`type:app`, `scope:internal`. Depends only on `@monorepo/configs`; nothing depends on it.
