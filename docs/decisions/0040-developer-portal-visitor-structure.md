---
issue: 474
status: to-implement
decision: accepted
---

# 🧭 Visitors land on the front page and toggle to the developer view

## Context

[0039](./0039-developer-portal-benchmark.md) gave the portal a visitor view and a developer view,
and left open how a visitor enters. #474 asks three things: whether a door (pick a view first) or
a toggle (visitor view by default, developer view one click away) gets readers to useful content
sooner; how every page the portal has today shows to a visitor; and which sections the visitor
front page has, in order, and what data each reads.

## Result

**The toggle.** `/` becomes the visitor front page. The current Overview moves to `/overview` as the
developer view's home, and every page shows a plain `<a href>` "Developer view" link to it.

Both entries were built as rough lab pages (`app/pages/lab/door/`, `app/pages/lab/toggle.vue`) and
measured with Playwright at 390 × 844 and 1280 × 800, with JavaScript on and off. The results were
identical in both modes.

| Reader, arriving at `/` | Door | Toggle |
| --- | --- | --- |
| Visitor: what this is (the W1 sentence) | 0 clicks | 0 clicks |
| Visitor: the first shipped app | 1 click, on screen (top at 377 px at 390, 644 px at 1280) | 0 clicks, one scroll (top at 889 px at 390, 1156 px at 1280) |
| Developer: the Overview | 1 click | 1 click |
| Anyone on a deep link (`/decisions/<id>`) | 0: the door is never seen | 0 |

The door buys an on-screen app for one click, which the toggle gets for one scroll. Its own page
holds nothing but the sentence and two choices, and it only exists at `/`. Shared links into the
portal skip it, so it can't hold the choice anyway.

### Every page, for a visitor

The nav key is the `nav` entry in each layer's `app/app.config.ts`. The visitor nav keeps
`projects`, `graph`, `decisions`, `audits` and `workflows`. Nothing is removed. A re-presented page
leaves detail out and never shows different facts (W7).

| Route | Page | Nav key | For a visitor |
| --- | --- | --- | --- |
| `/` | `app/pages/index.vue` | `overview` | Developer-only: moves to `/overview`; `/` is the front page |
| `/projects` | `layers/projects/app/pages/projects.vue` | `projects` | Re-presented: the showcase (W6) first, packages and tooling as index rows (W4) |
| `/graph` | `layers/projects/app/pages/graph.vue` | `graph` | Re-presented: "How the pieces fit" (`graph.vue:46`) only; the Nx graph and "Tags and edges" stay in the developer view |
| `/decisions` | `layers/decisions/app/pages/decisions/index.vue` | `decisions` | Re-presented: index rows, without the search and three selects (`index.vue:23-50`) |
| `/decisions/<id>` | `…/decisions/[id].vue` | — | Shown |
| `/audits` | `layers/audits/app/pages/audits/index.vue` | `audits` | Re-presented: index rows with open of total, without the selects (`index.vue:30-50`) |
| `/audits/<id>` | `…/audits/[id].vue` | — | Shown |
| `/workflows` | `layers/workflows/app/pages/workflows/index.vue` | `workflows` | Re-presented: projects as rows, without `WorkflowNewProjectCard` (`index.vue:64`) |
| `/workflows/<id>` | `…/workflows/[id]/index.vue` | — | Shown |
| `/workflows/<id>/settings` | `…/workflows/[id]/settings.vue` | — | Developer-only: prerendered, but saves only under `pnpm dev` |
| `/workflows/new` | `…/workflows/new.vue` | — | Developer-only: same |
| `/docs` | `layers/wiki/app/pages/docs/index.vue` | `docs` | Developer-only |
| `/docs/<path>` | `…/docs/[...slug].vue` | — | Shown when a visitor page links to it |
| `/changelog` | `layers/projects/app/pages/changelog.vue` | `changelog` | Developer-only |
| `/issues` | `layers/health/app/pages/issues.vue` | `issues` | Developer-only |
| `/coverage` | `layers/health/app/pages/coverage.vue` | `coverage` | Developer-only |
| `/deps` | `layers/health/app/pages/deps.vue` | `deps` | Developer-only |
| `/telemetry` | `layers/telemetry/app/pages/telemetry.vue` | `telemetry` | Developer-only; its agent share feeds front-page section 3 |

### The front page, in order

Numbers are read at build time and set inside sentences, never as a row of tiles (N3). No section
waits on JavaScript (N1). No label is under 12 px (N2), and no text sits on a screenshot (N4).

| # | Section | Reads | Supplied by | With no `.report/` |
| --- | --- | --- | --- | --- |
| 1 | One sentence on what this is, at least 6× the body size (W1), and two lines under it | Visitor copy | `cap:visitor-copy` | Unchanged |
| 2 | Shipped apps: a large screenshot, a caps label, one line, the live link (W6) | Showcase data | `cap:project-showcase` | Unchanged |
| 3 | How it's built: one paragraph covering agent share of script runs, spec count, line coverage, decision and audit counts. One static figure of which app uses which package (W8) | Snapshot `usage` (`scriptRows`, `sumDays`), `metrics`, `coverage`, `docs` (`useDecisionReports`, `useAuditReports`); the figure from `projects` | Existing | The paragraph without its numbers; no figure |
| 4 | How the work is run: the latest decisions and the active workflows as index rows (W4) | Snapshot `docs` (`sortDecisions`); `data/workflows/` (`activeProjects`) | Existing | Workflows only |
| 5 | The developer view link and the snapshot's age | Snapshot `manifest` (`SnapshotAge`) | Existing | The link only |

Sections 1 and 2 read data written for visitors, not the snapshot. That copy is approved by the owner,
which 0039 allows.

## Options considered

| Option | Why not |
| --- | --- |
| Door | One click for every visitor at `/` to save a scroll; a page with no content of its own; skipped by every deep link |
| Toggle by `?view=` query, as Cafeteria does | A prerendered site serves one HTML per route, so the query changes nothing with JavaScript off |
| Remove developer-only pages from the visitor build | 0039 keeps every route addressable, and #474 removes nothing |

## Consequences

`cap:scope-signoff` approves this report, and `cap:visitor-copy`, `cap:view-switch` and
`cap:design-lab` build on it.

**Order.** `view-switch` moves `app/pages/index.vue` to `app/pages/overview.vue` and sets
`app/app.config.ts`'s `overview.to` to `/overview` before the front page takes `/`. Otherwise `/` has
no developer home to link to while the front page is built.

**Tripwires.**

- The prerendered HTML has one nav per route, so it always renders the visitor nav plus the
  developer-view link. A remembered developer choice can swap in the full nav only after mount, the
  way `unfoldCurrent` waits for `onMounted` in `app/layouts/default.vue`. Swapping earlier is a
  hydration mismatch.
- In the lab, the W1 sentence alone filled the first screen at 390 px and pushed the first app to
  889 px. `design-lab` has to keep the top of the first screenshot in the first screen at 390, or
  the toggle loses its edge over the door.
- Shipped apps are those tagged `type:app` without `scope:internal`: Huella Legal and Marina Roustan
  today. `developer-portal` and `wp-editor` are internal.
- `/lab` is dropped from the production build by a `$production` `pages:extend` hook in
  `nuxt.config.ts`. A lab page that stops being dev-only would ship.

## Confirmation

| Claim | Check |
| --- | --- |
| `/` is the visitor front page and the Overview lives on | `.output/public/index.html` contains the W1 sentence; `.output/public/overview/index.html` exists |
| The toggle reads with JavaScript off | Playwright, `javaScriptEnabled: false`: from `/`, one click on "Developer view" reaches `/overview` |
| Developer-only pages leave only the visitor nav | Every route in the table still has an `index.html` in `.output/public` |
| No lab page ships | `ls apps/developer-portal/.output/public/lab` fails after `nx build-static` |
| The front page renders without a snapshot | With `.report/` moved aside, `build-static` succeeds and `/` shows sections 1, 2 and 5 |
