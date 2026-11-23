---
issue:
status: to-implement
decision: accepted
---

# 🧭 The visitor view becomes its own app, and the portal reads only as a developer platform

## Context

[0039](./0039-developer-portal-benchmark.md) gave the developer portal a visitor view and a
developer view, and [0040](./0040-developer-portal-visitor-structure.md) put both in one app behind
a toggle. Built out, the two views share a domain and nothing else a reader sees:

- **Two identities.** The visitor pages are serif and editorial, and the developer view is black
  chrome in IBM Plex. [`visitor.css`](../../apps/developer-portal/layers/design/app/assets/visitor.css)
  is a list of `@source not` lines keeping seven layers, the developer pages and dozens of Nuxt UI
  themes out of the visitor stylesheet.
- **Two subjects.** The visitor pages are about a person: an About page, case studies, a
  `Person` identity in `schemaOrg` (`nuxt.config.ts:72`). The developer view is about a repo. Each
  front page has to explain the other one before it can say what it is.
- **One address wanted.** The visitor pages belong at the owner's name (xifre.dev), and the
  developer view beneath it at `/portal/`, because a view transition can't cross origins (#518).

## Result

**The six visitor pages move to a new app, `apps/xifre-font`.** The developer portal keeps every
developer page and drops its visitor view. 0040 is superseded; 0039 mostly still holds:

| From 0039 / 0040 | Holds |
| --- | --- |
| A visitor view written for people who don't code, and a developer view with every feature | Yes, as two apps |
| The visitor identity (W1–W3, W6, W8) and the developer identity (W4, W5) | Yes, one per app |
| A plain text view one click from the rich one (W7) | No: the two link to each other across apps |
| `/` is the visitor front page and the Overview moves to `/overview` (0040) | No: the personal site's `/` is the front page, and the portal's `/` is its Overview again |
| The view switch on every page (0040) | Yes: both apps carry it, and it crosses between them (#518) |

**The portal is the personal site's data source, the way WordPress is Huella Legal's.** No code
crosses: `type:app` may depend only on `type:integration`, `type:observability` and `type:config`
(`packages/configs/src/eslint/lib/boundaries.ts:15`). The portal prerenders one JSON file holding
every figure the visitor pages read today, and the personal site fetches it at build:

| Visitor pages read today | Payload key in `/embed/visitor.json` |
| --- | --- |
| `useBenchmarks()` — `layers/benchmarks/app/composables/useBenchmarks.ts:8` | `benchmarks`: id, title, screenshot URL |
| `useDecisionReports()` — `layers/decisions/app/composables/useDecisionReports.ts:4` | `decisions`: count, and the reports the front page and Method preview |
| `useWorkflowMaps()`, `useWorkflowGlyph()`, `useWorkflowTemplates()` — `layers/workflows/app/composables/useWorkflowMaps.ts` | `workflows`: each project's `projectMap()` at full and glyph scale, templates, lesson count |
| `useRuleCounts()` — `layers/telemetry/app/composables/useRuleCounts.ts:2` | `rules`: enabled and in-house |
| `specTotal(metricsArtifact()?.projects)` | `specs` |

The maps travel as `projectMap()` geometry rather than pictures, so the personal site keeps the
accessible list `WorkflowProjectMap.vue` draws below `md`. Its presentational components are copied
rather than shared, as `deferHydration.ts` was copied from huella-legal.

| Change | Where | What |
| --- | --- | --- |
| 1 | `apps/xifre-font/` | Scaffold with `new-package`: tags `type:app`, `scope:xifre-font`; one `scope:xifre-font` row in `boundaries.ts` beside `scope:marina-roustan` (line 33) |
| 2 | Portal `server/routes/embed/visitor.json.ts` | Assemble the payload from the composables' server sources, prerendered through `nitro.prerender.routes` |
| 3 | `apps/xifre-font/app/pages/` | Move `index.vue`, `method.vue`, `about.vue` from `apps/developer-portal/app/pages/`, `work/` from `layers/projects/app/pages/`, `agentic-workflows.vue` from `layers/workflows/app/pages/` |
| 4 | `apps/xifre-font/content/work/` | Move `content/work/*.md`, the `work` collection from `content.config.ts:8`, and the screenshots |
| 5 | `apps/xifre-font/app/components/` | Copy `WorkflowProjectMap`, `WorkflowGlyph`, `PageHero`, `TermList`, `DecisionQuestions`, `RuleSection`, `MethodChecks`, the five `*Preview` components and `work/List`, `work/Figure` |
| 6 | `apps/xifre-font/app/pages/work/[app].vue` | Add the project's map between the "why" and the design block, from `workflows` |
| 7 | `apps/xifre-font/i18n/locales/en.json` | Move `index`, `method`, `rules`, `about`, `work`, `workApp`, `workList`, `agenticWorkflows`, `workflowTeaser`, `checksPreview`, `decisionsPreview`, `app.visitor` |
| 8 | `apps/xifre-font/` | Move `app/layouts/visitor.vue` as the default layout, `visitor.css` as its only stylesheet minus the `@source not` lines, `public/og-image.png`, `app/plugins/siteHead.ts`, `server/plugins/deferHydration.ts`, `schemaOrg` |
| 9 | Portal `app/pages/overview.vue` | Move back to `app/pages/index.vue`; `overview.to` in `app/app.config.ts` becomes `/` |
| 10 | Portal | Delete `app/layouts/visitor.vue`, `visitor.css`, `ViewSwitch` (`app/layouts/default.vue:52`) and the visitor keys; the developer layout links to the personal site |
| 11 | `.github/workflows/xifre-font-deploy.yml` | Copy `developer-portal-deploy.yml` without coverage, collect and Storybook; run on `workflow_run` of the portal deploy |

Line numbers are as of this report.

## Options considered

| Option | Why not |
| --- | --- |
| Keep one app (0040) | Two identities and two subjects in one build, held apart by a stylesheet exclusion list; neither front page can open on what it is |
| A shared package for the map and the figures | Needs a new type tag in `boundaries.ts` for one component and five numbers, after [0036](./0036-huella-legal-owns-its-design-system.md) retired the shared UI package |
| The personal site reads the portal's `.report/` or imports its files | An app depending on an app, which `@nx/enforce-module-boundaries` rejects |
| The portal publishes map SVGs and the personal site embeds them as images | Loses the list `WorkflowProjectMap.vue` renders below `md` and the theme tokens |
| Links only, no figures | The case studies lose their maps, which are the proof that the platform built the site |

## Consequences

The personal site no longer builds what it shows: a figure is as fresh as the portal's last deploy.
Every portal edit to a payload field has to keep the personal site's reader in step, so change 2
owns a spec that pins the payload's keys.

**Order.** Change 2 lands and deploys before change 3, so the personal site never builds against a
missing payload. Changes 9 and 10 go last, so the visitor pages stay live at the old address until
the new one serves them.

**Tripwires.**

- **No domain is bought yet.** `SITE_URL` (`nuxt.config.ts:9`) and the deploy `url:` stay
  `xfontr-monorepo.pages.dev` until it is; DNS and the purchase are the owner's step.
- **The payload URL is per environment.** It is an env var with no default, unset locally; with it
  unset every page renders without figures or maps, the way the portal renders without `.report/`.
- **A visitor page's links into the portal become absolute** — `PROOFS` in `index.vue`, `to=` in
  `method.vue`, `live.href: /overview` in a work entry. A relative one 404s on the new domain.
- **The circle opened by switching views needs one origin.** It is a cross-document view
  transition, so the portal is built under `/portal/` and deployed inside the personal site's
  output (#518); `carried()` stays within each site.
- **The portal's e2e covers visitor pages only.** `e2e/copy.ts` `VISITOR_PAGES` moves with them;
  the portal needs its own list or its axe and SEO checks run on nothing.
- **The portal's `/` becomes indexable again.** `routeRules["/overview/**"]` (`nuxt.config.ts:82`)
  goes, and every developer route needs `noindex, follow`, as each layer's `nuxt.config.ts` sets.
- **Method cites 0040.** `DECISIONS.visitor` in `app/pages/method.vue` and its
  `method.decide.decisions.visitor` copy answer "where does a visitor land" with the toggle; they
  move to this report.
- **`site.name`** (`nuxt.config.ts:63`) signs every visitor page's title today, and
  `e2e/seo.spec.ts:4` asserts it. The personal site gets its own.

## Confirmation

| Claim | Check |
| --- | --- |
| The personal site imports no portal code | `pnpm exec nx lint @monorepo/xifre-font` passes `@nx/enforce-module-boundaries`; `grep -r "developer-portal" apps/xifre-font --include='*.ts' --include='*.vue'` finds nothing |
| The payload is published | After `nx build-static @monorepo/developer-portal`, `.output/public/embed/visitor.json` exists and has every key in the payload table |
| Visitor pages left the portal | `ls apps/developer-portal/app/layouts/visitor.vue apps/developer-portal/content/work` fails |
| The portal's home is `/` again | `.output/public/index.html` of the portal contains the Overview's title, and `overview/` is absent |
| The personal site builds without the payload | With the env var unset, `nx build @monorepo/xifre-font` succeeds and `/work/huella-legal/` renders without a map |
| Case studies show their map | The built `/work/huella-legal/index.html` contains `data-workflow-map` |
