# 📦 @joinery/developer-portal

The repo's front door: every markdown file rendered as a wiki, plus what isn't written down —
coverage, the project graph, open issues, decisions, audits, workflows and tooling usage.

Under `pnpm dev developer-portal` it reads the working tree live. The deployed site is a prerendered
[snapshot of `master`](#the-deployed-site-is-a-snapshot) on GitHub Pages.

## Development

| Command | What it does |
| --- | --- |
| `pnpm dev developer-portal` | Start the portal, from the workspace root |
| `pnpm exec nx collect @joinery/developer-portal` | Rebuild the snapshot in `.report/`: graph, coverage, metrics, docs, usage |
| `pnpm exec nx build-static @joinery/developer-portal` | `nuxt build --prerender`, the build that deploys |
| `pnpm exec nx nuxt-prepare @joinery/developer-portal` | Regenerate `.nuxt` by hand; Nx already runs it before lint, typecheck, test and build |
| `pnpm exec nx test:e2e @joinery/developer-portal` | Playwright over the build: skip link, SEO tags, the published payload, axe on the 404 page |

- Coverage is only as fresh as the last root `pnpm test:coverage`.
- `build` delegates to `build-static`, so CI builds what deploys.
- `.report/` is gitignored and every page must render without it.

## Structure

| Path | What lives there |
| --- | --- |
| `app/` | The shell: the layout, Home at `/`, and `app/composables/`, which assemble Home's queue and Health, the rail, the status bar and search from several layers |
| `app/components/`, `app/types/`, `app/utils/` | The kit: shared parts such as `PageFacts`, `PageHeader` and `EmptyState`, one type per file, pure helpers |
| `i18n/locales/en.json` | The interface's copy — see [🔤 Copy](#copy) |
| `server/routes/embed/data.json.ts` | The figures [`apps/portfolio`](../portfolio/README.md) shows, prerendered — see [📤 The payload](#the-payload) |
| `layers/` | One Nuxt layer per capability — see [🧱 Layers](#layers) |
| `tools/collect/` | The collector that builds the snapshot |
| `tools/lib/` | Node-only helpers: paths, `git`, the shape checks, the doc-link rewriter |

## Layers

| Layer | Kind | What it owns |
| --- | --- | --- |
| `snapshot` | Core | The `.report/` artifacts, bundled at build time by one `<name>Artifact()` util each, and their types |
| `design` | Core | Tokens, shared classes and the Nuxt UI theme |
| `docs` | Core | Link rewriting and `ProseA` for rendered markdown |
| `github` | Core | Browser-side reads of GitHub issues |
| `decisions`, `audits`, `benchmarks` | Feature | Each record type's list and pages |
| `projects` | Feature | Projects, Architecture and What's new |
| `health` | Feature | Work in progress, Coverage, Dependencies |
| `telemetry` | Feature | Tooling usage |
| `workflows` | Feature | The Workflows pages |
| `wiki` | Feature | Documentation pages and the nav tree |

The rules match [huella-legal's](../huella-legal/README.md#structure): the kit (`app/components/`,
`app/types/`, `app/utils/`) uses only itself, cores use themselves and the kit, features also use
cores but never another feature. `eslint.layerBoundaries` in [`eslint.config.ts`](./eslint.config.ts) enforces it.

- Cross-layer imports read `#layers/<name>/…`, resolved by Nuxt and, outside it, by the `imports`
  field in [`package.json`](./package.json).
- No root `shared/`: a relative import into it broke the prerendered build
  ([0014](../../docs/decisions/0014-developer-portal-deployment.md)).
- Each layer declares its rail links under `nav` in its `app/app.config.ts`; [`apps.ts`](./app/utils/apps.ts)
  groups them into Home, Catalog, Docs, Work and Health.
- A page reads its data through a `use<Page>` composable in its layer and lists its sections, each a
  component in `components/<page>/` or named for the layer (`wizard/Step.vue` → `WizardStep`).

## Copy

The interface's copy is in [`en.json`](./i18n/locales/en.json) through `$t()`, keyed the
way [huella-legal's are](../huella-legal/README.md#copy-keys). Specs see keys, not copy:
[`vitest.setup.ts`](./vitest.setup.ts) empties the messages.

## The payload

The personal site, [`apps/portfolio`](../portfolio/README.md), shows figures only this app can compute. It
imports none of its code: [`data.json.ts`](./server/routes/embed/data.json.ts) prerenders
`/embed/data.json` and that site fetches it at build, after this one deploys.

| Key | From |
| --- | --- |
| `benchmarks` | `docs/benchmarks/` through the `docs` collection: id, title, screenshot path |
| `decisions` | The collected docs artifact: id, number, title, status |
| `workflows` | `data/workflows/`: each project's map at full and glyph scale, the templates, the lesson count |
| `rules` | Enabled and in-house lint rules from the usage artifact |
| `specs` | Spec files across every project, from the metrics artifact |

Its spec pins the keys, since renaming one blanks that site's figures without failing its build.

## What each page reads

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
link is counted on Home, never a build failure. Fix a link that breaks here in
[`docLinks.ts`](./layers/docs/shared/docLinks.ts), not in the doc.

`@nuxt/content` lower-cases every route, so anything joining a route to a repo path goes through
[`toCollectionPath`](./layers/docs/shared/docPages.ts).

### The wiki tree

Derived from paths alone, so a new doc appears on its own. Changelogs, dated audits, numbered
decisions and benchmark entries are left out of the tree since each has its own page; CLAUDE.md
files are left out of the collection and link to GitHub. ⌘K search loads on first open, not in the
layout, which kept it out of every page's payload.

### GitHub reads

Issues are fetched unauthenticated from the browser, so the site needs no server or
secret. The limit is 60 requests an hour per IP. Board placement (`projectItems`) is GraphQL-only and
needs a token, so it isn't shown.

## The deployed site is a snapshot

[`deploy-developer-portal.yml`](../../.github/workflows/deploy-developer-portal.yml) runs on every
push to `master` or by hand: `pnpm test:coverage`, then `collect`, then `build-static`, then it
uploads the build as the `developer-portal-site` artifact. The
[portfolio's deploy](../portfolio/README.md#deploy) publishes that artifact at
[xifre.dev/portal/](https://xifre.dev/portal/), so the portal goes live only when
that run succeeds. Cloudflare only hosts: the build runs in Actions, and the site has no Functions.
huella-legal's Storybook is built into the same output under `/huella-legal-storybook/`.

- The old `xfontr-monorepo` Pages project gets only a `_redirects` file, sending every path to the
  same path under `/portal/`.

- Every page is as old as the last deploy, except issues (live) and workflows (as
  old as the last committed `pnpm workflow:sync`).
- The site is served from `/portal/` under `SITE_URL` in [`nuxt.config.ts`](./nuxt.config.ts),
  the personal site's origin, so the view switch can animate between the two. Canonical URLs are
  built on both.
- `NUXT_PUBLIC_REPO_URL` is baked in at build time, derived by the workflow.
- Cloudflare Pages rejects any file over 25 MiB, which is why the Architecture map is drawn from
  `projects.json` rather than Nx's exported graph viewer.
- The project overrides its `production` Nx input in [`package.json`](./package.json) so any `*.md`
  or `data/workflows/` change makes it affected, and a `runtime` input over
  [`snapshotStamp.ts`](./tools/lib/snapshotStamp.ts) hashes the gitignored `.report/`.

## Search and speed

| Concern | Where |
| --- | --- |
| Title, description, canonical | `useSeoMeta` on the dashboard; `nuxt-seo-utils` signs the title with the site name |
| Indexing | None: one `/**` route rule in [`nuxt.config.ts`](./nuxt.config.ts) sets `noindex, follow` on every page, so links out are still followed |
| First paint | Styles inlined; no script preload or chunk prefetch; links prefetch on interaction |

## Checks it surfaces

[`tools/lib/invariants.ts`](./tools/lib/invariants.ts) runs on every collect and shows findings on
Home. It blocks nothing.

| Check | Flags |
| --- | --- |
| `pnpm invariants:check --json` | Everything the [invariants gate](../../infrastructure/scripts/src/invariants/README.md) reports |
| `compareAuditShape` | An audit with a bad filename, missing frontmatter, a reused ID or an unknown status |
| `compareDecisionShape` | A decision with a bad filename, reused number, unknown `status:`/`decision:`, no `issue:` or a dangling `supersededBy:` |
| `compareWorkflowShape` | A workflow file that breaks [the workflow rules](../../docs/workflows/README.md) |

## Design system

The [`design`](./layers/design) layer is the only place a value is chosen. Components use Nuxt UI's
semantic roles and Tailwind's scale; ESLint rejects bracketed values.

| Piece | Where | What it is |
| --- | --- | --- |
| `--tone-good`, `-warn`, `-bad` | [`main.css`](./layers/design/app/assets/main.css) | The three status colours; [`toneClass`](./app/utils/format.ts) maps a `Tone` to its class |
| `.data-table`, `.numeric` | `main.css` | Every table |
| `.embedded-report` | `main.css` | The frame around the coverage report |
| `variant="flush"` on `UCard` | [`app.config.ts`](./layers/design/app/app.config.ts) | A card with no body padding |
| `--state-*`, `--stage-*` | [`workflows.css`](./layers/workflows/app/assets/workflows.css) | Workflow colours, kept with that feature |
| `--usage-*` | [`telemetry.css`](./layers/telemetry/app/assets/telemetry.css) | Tooling-usage colours, kept with that feature |

The three status colours were validated as a set for contrast and colour-blind separation. Re-run
the `dataviz` skill's validator before changing one.

ESLint also rejects raw palette classes (`bg-slate-500`, `text-white`) everywhere.

### The identity

Direction E, approved in [`0039`](../../docs/decisions/0039-developer-portal-benchmark.md), is one
system in [`main.css`](./layers/design/app/assets/main.css), whose tokens [`apps/portfolio`](../portfolio/README.md) copies, set on `:root` so Nuxt UI's overlays take it too. Nothing is set under 12 px.

| Piece | What it is |
| --- | --- |
| `paper-*`, `terracotta-*` | The palette: warm neutrals and the one accent. Read through the roles, never as classes |
| `--font-display`, `--font-sans`, `--font-mono` | Fraunces, IBM Plex Sans, IBM Plex Mono |
| `text-statement`, `title`, `section`, `heading` | The display steps; with `text-2xl`, `base`, `sm` and `xs` they make the scale's eight |
| `--ui-primary` | Terracotta 600 in light, 300 in dark |
| `--tone-*` | The status colours, re-picked for these surfaces with the `dataviz` validator |
| `surface-ink` | A fill that stays dark in both modes, such as the developer rail, with its own tones |
| `<mark>` | A marked word takes the accent in italic |
| `data-figure` | A count or percentage that leads a panel: tabular, semibold |
| `data-scroll-x` | A row or table that scrolls sideways fades at its right edge |
| View transitions | Every page change crossfades in 0.15 s |
| `data-prose`, `data-readme` | Rendered markdown keeps a 72-character measure; a README drops its own `#` title |

Every text role clears 4.5:1 on every surface. Each cell is light / dark:

| Text | `bg` | `bg-muted` | `bg-elevated` | `bg-accented` |
| --- | ---: | ---: | ---: | ---: |
| `dimmed`, `muted` | 5.9 / 6.7 | 5.3 / 7.3 | 6.4 / 6.3 | 4.8 / 5.8 |
| `toned` | 12.9 / 12.0 | 11.7 / 13.0 | 14.0 / 11.3 | 10.5 / 10.5 |
| default | 14.0 / 13.5 | 12.6 / 14.6 | 15.1 / 12.6 | 11.3 / 11.7 |
| `highlighted` | 14.9 / 16.1 | 13.5 / 17.4 | 16.1 / 15.1 | 12.0 / 14.0 |
| `primary` | 5.7 / 7.1 | 5.2 / 7.7 | 6.2 / 6.6 | 4.6 / 6.2 |
| `--tone-good` | 6.0 / 5.5 | 5.4 / 6.0 | 6.5 / 5.2 | 4.8 / 4.8 |
| `--tone-warn` | 6.9 / 5.5 | 6.3 / 5.9 | 7.5 / 5.1 | 5.6 / 4.7 |
| `--tone-bad` | 5.9 / 5.4 | 5.3 / 5.8 | 6.4 / 5.0 | 4.7 / 4.7 |
| `inverted` on `bg-inverted` | 16.1 / 14.9 | | | |

| Text on `surface-ink` | Fill | `bg-elevated` |
| --- | ---: | ---: |
| `muted` | 7.3 | 6.7 |
| default | 16.1 | 14.9 |
| `highlighted` | 17.4 | 16.1 |
| `primary` | 7.7 | 7.1 |
| `inverted` on `bg-primary` | 7.7 | |
| `--tone-good`, `-warn`, `-bad`, lowest | 5.0 | 4.6 |

## Boundaries

`type:app`, `scope:internal`. Depends only on `@joinery/configs`; nothing depends on it.
