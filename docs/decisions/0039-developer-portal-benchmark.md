---
issue: 472
status: to-implement
decision: accepted
---

# 🧭 The developer portal is redesigned for visitors, from a twelve-site benchmark

## Context

[0021](./0021-developer-portal-public-ux.md) made the portal the repo's public front door through
three intent cards and plain-language labels, with no separate views and no portal-owned copy. It
was written before the workflows, Huella Legal's relaunch, Marina Roustan, wp-editor and tooling
telemetry existed. The front door it produced still doesn't tell a visitor who doesn't write code
what they are looking at, and it never looked at the design, which is still Nuxt UI's dashboard
starter. #472 asks what strong sites do that the portal should learn from, for each kind of page it
has: a front page, collections (projects, decisions, audits, workflows), tables, charts and long
docs.

## Result

**0021 is superseded.** The portal gets a visitor view written for people who don't write code, a
developer view with every current feature, and a visual identity of its own. Whether visitors
choose a view or start in one is `cap:visitor-structure`'s question.

| From 0021 | Holds |
| --- | --- |
| One static, read-only site; every route stays directly addressable | Yes |
| Plain language before technical terms; engineering health below the story | Yes |
| A plain-language "How the pieces fit" before the raw Nx graph | Yes |
| No analytics; English only; indexing allowed | Yes |
| No views or modes for different visitors | No: a visitor view and a developer view |
| Project copy comes only from READMEs | No: visitor copy may be written for the portal, approved by the owner |
| The three intent cards open the Overview | No: the visitor front page replaces them |

### What the twelve sites teach

Counted across the twelve sites analysed below, measured on 2026-11-17.

| # | Pattern | Seen in | For the portal |
| --- | --- | --- | --- |
| W1 | The first screen is one sentence or one title, set at least 6× the body size | 8 of 12: Rauno, Linear, Carbon, Bratiiev, Tom de Koning, CRL, Brandon Yasin's case pages, Super Eight's work page | **Want**, on the visitor front page |
| W2 | A display face, a reading face and a mono for labels, IDs and numbers | Serif display in 5 (Linear, Carbon, Bratiiev, Super Eight, Tom de Koning); mono labels in 5 (Linear, Carbon, Bratiiev, Cafeteria, Primer) | **Want**: the repo is full of IDs — `0039`, `#472`, `B3`, `cap:` — that a mono sets apart |
| W3 | At most one accent colour, spent on one job | 11 of 12; only Super Eight runs two | **Want**: one accent; the three status tones stay as they are |
| W4 | Collections as numbered index rows, not cards: ID, title, meta, a hairline between | 7 of 12: Linear's table of contents, Bratiiev's archive, Romain Avalle's 39-row table, Rauno's projects, CRL, Cafeteria's text view, Martin Foucaut | **Want** for decisions, audits, workflows and the developer view of projects |
| W5 | Docs as a sidebar plus one reading column, with tables full width | Primer, Carbon; Linear drops the sidebar for long reads | **Want** for the wiki; Linear's centred column for visitor-facing long reads |
| W6 | Work shown as large screenshots with a caps label, not described | Brandon Yasin, Primer, Super Eight | **Want** for the project showcase |
| W7 | A plain text view one click from the rich one | Cafeteria (`?view=text`) | **Want**: the model for the visitor/developer switch — same content, two densities |
| W8 | One piece of code-native imagery: ASCII figures, dot matrices | Bratiiev, Romain Avalle, Cafeteria | **Want, once**: a single figure on the front page, never as decoration |
| N1 | Content waits on motion, sound or WebGL | Cafeteria's phone view is black below the hero; Tom de Koning's About is empty until animated | **Avoid**: the site is prerendered and must read with nothing running |
| N2 | Labels under 12 px or faded below 4.5:1 | CRL 8 px, Martin Foucaut 9 px, Romain Avalle 11 px, Bratiiev 12 px at 33% opacity | **Avoid**: the portal's `text-2xs` is 11 px today |
| N3 | Template tells: logo strips, testimonial cards, pill tags, rounded panels, 31 type sizes | Super Eight; rounded panels in Primer | **Avoid**: the portal already has pills and rounded cards everywhere |
| N4 | Text set over imagery | CRL's intro over its glyph | **Avoid** |

### How it lands in the portal

Paths are under `apps/developer-portal/` and as of this report. Each row is a rule the lab follows
and the build blocks implement.

| Rule | From | Where | Change |
| --- | --- | --- | --- |
| Three faces as tokens | W2 | `layers/design/app/assets/main.css` (`@theme static`) | Add `--font-display` and `--font-sans` beside the existing `--font-mono`; the lab picks the two new faces |
| Eight type steps at most, display ≥ 6× body, nothing under 12 px | W1, N2 | `main.css` | Replace `--text-2xs` (11 px) with a 12 px step; define the display steps |
| One accent | W3 | `layers/design/app/app.config.ts` | Set `ui.colors.primary` and `neutral`; icons stop taking `text-primary` |
| Index rows for collections | W4 | `layers/decisions/app/pages/decisions/index.vue`, `layers/audits/app/pages/audits/index.vue`, `layers/workflows/app/pages/workflows/index.vue`, `layers/projects/app/pages/projects.vue` | Mono ID, title, meta, hairline rule; one shared row component in `app/components/` |
| One reading column | W5 | `layers/wiki/app/pages/docs/[...slug].vue` | Prose capped near 72 characters; tables may run full width |
| Showcase as images | W6 | the visitor projects page (`cap:project-showcase`) | Screenshot, caps label, one line, live link |
| Two densities of one page | W7 | `cap:view-switch` | The visitor view leaves out detail; it never has different facts |
| One figure, static | W8, N1 | `app/pages/index.vue` | Rendered at build, readable with JavaScript off |

### Per-site analysis

Shortlisted from 28 candidates on Awwwards (developer, data-visualisation and typography lists) and
Siteinspire, plus the owner's four picks. Each was captured in full at 1280 and 390 px with up to
two inner pages, and its type and colour measured from computed styles.

| Site | First 30 s | Layout and navigation | Dense content |
| --- | --- | --- | --- |
| [rauno.me](https://rauno.me) | Who, where, what, for whom in one sentence | A horizontal reel with a tick-mark position bar; no text nav | `/craft` is a three-column wall of experiments, each with title and date; `/projects` is a plain list, title left, year right |
| [linear.app/method](https://linear.app/method) | "Practices for building", 128 px | Centred hero, a line-drawn Venn, then a table of contents numbered 1.1–3.6 in mono | Inner pages are one ~600 px column: 72 px serif title, 24 px sans subheads, 14–15 px body |
| [primer.style](https://primer.style) | "The design system for GitHub" | Rounded panels on the home page; docs get a sidebar | The DataTable page interleaves live tables and code; right-aligned numeric columns |
| [carbondesignsystem.com](https://carbondesignsystem.com) | "Let's make together", 112 px light serif | Square corners throughout; docs sidebar | Data visualisation is a grid of small chart thumbnails by type; the table page numbers its anatomy |
| [bratiiev.com](https://www.bratiiev.com/) | A serif statement with underlined key phrases | Dotted grid; mono annotations drawn as a tree (`--METHOD: --PIPELINE`) | `/work` is an archive of rows `/001`–`/010`: project, year, sector, one line |
| [romainavalle.dev](https://www.romainavalle.dev/) | Name and role as two black labels on an ASCII render | One column of bio, then the index | A 39-row project table: number, name, studio, role, awards, year |
| [crl-2026.webflow.io](https://crl-2026.webflow.io/) | A giant glyph, "/V.01", "(2026)" | Index, Library, About; counts in parentheses, "(20)", "(5)" | The library switches between Wheel and List; resources as rows with counts |
| [martinfoucaut.com](https://www.martinfoucaut.com/) | Who and where, in a labelled cell | The whole page is a spreadsheet of labelled cells, rotated labels at the edges | A table header row: Client(s), Service(s), Year(s), Link(s), Credit(s), Location(s) |
| [teamcafeteria.com/2027](https://www.teamcafeteria.com/2027) | "2027" as a dot-matrix, one line under it | A scroll-driven story with sound; a text view beside it | The text view is numbered lists and quotes with mono metadata (`FEMALE · 17 · MIAMI`) |
| [tomdekoning.work](https://www.tomdekoning.work/) | The name as a 410 px wordmark | Corner labels, a menu button, a WebGL project carousel | None |
| [brandonyasin.com](https://brandonyasin.com/) | Only the name; the work is the message | A horizontal strip of four project images | Case pages: 90 px title, a paragraph, client/year and discipline as two meta columns |
| [supereightstudio.com](https://supereightstudio.com/) | "Brands designed to be trusted." beside an orange disc | Logos, a work grid, testimonials, a stats row, a journal | A stats row: 17, 150+, 56+, 12+ with captions |

| Site | Type (measured) | Colour (measured) | At 390 px | Fails |
| --- | --- | --- | --- | --- |
| Rauno | One custom face; 85, 75 and 14 px | White, yellow `#ffff02`, ink `#171717` | The same composition, scaled | Nothing tells a reader where the work is |
| Linear | Tiempos Headline, Inter, Berkeley Mono; 8 sizes | `#08090a` paper, `#8a8f98` text, one indigo `#5e6ad2` | Hero drops to 48 px, TOC goes full width | Body grey on near-black is low contrast |
| Primer | Mona Sans only; 9 sizes, 56 px top | `#f6f8fa` paper, blue `#0055d5` links | Panels stack | Rounded panels read as a template |
| Carbon | IBM Plex Serif, Sans, Mono; 10 sizes, 112 px at weight 200 | `#f4f4f4`, ink `#161616`, blue `#0f62fe` | Hero 64 px | A cookie banner covers the first screen |
| Bratiiev | Libre Caslon, Geist Mono; 8 sizes, 110 px | Black on white, one mint fill `#a9edc6` | The statement keeps 24 px; expertise becomes a numbered accordion | Labels at 33% opacity |
| Romain Avalle | One face; 3 sizes, 37, 15, 11 px | Black and white only | The table drops to the name column | 11 px meta; the bio repeats itself |
| CRL | Neue Haas Grotesk; 87 px to 8 px | Grey `#a1a098`, black, white | Reflows into stacked blocks | Text over the glyph is unreadable; 8 px labels |
| Martin Foucaut | Arial; 18 to 9 px | Greys `#242424`, `#696969`, text `#efefef` | Cells stack two-wide | 9 px text, grey on grey |
| Cafeteria | Satoshi, Roboto Mono; 14 sizes | Black, `#f4f4f5`, one green button | Black below the hero until interacted with | Content waits on interaction |
| Tom de Koning | PP Neue Montreal, Playfair Display italics; 6 sizes | `#0b0b0b`, cream `#e7e1d7`, orange `#f34213` | The wordmark reflows; orange holds | Empty sections until animated |
| Brandon Yasin | Helvetica Now, Neue Haas Unica; 2 sizes at home | `#f8f6f2` and `#111` only; colour comes from photos | The strip scrolls sideways | Home says nothing but the name |
| Super Eight | Big Shoulders, Instrument Serif and Sans; 31 sizes | `#f6f5f1`, orange disc, teal, a deep green section | Stacks cleanly | Too many sizes, pills and cards |

The stock traits the lab must not keep, as of this report:

| Trait | Where |
| --- | --- |
| Nuxt UI's default `green` primary and `slate` neutral, with no `ui.colors` set | `layers/design/app/app.config.ts` |
| No sans or display face chosen; only `--font-mono` is set | `layers/design/app/assets/main.css` |
| The starter shell: `UDashboardGroup` and `UDashboardSidebar` with an icon per link | `app/layouts/default.vue:2-58` |
| Three icon-title-blurb cards as the first thing on the page | `app/pages/index.vue:47-67` |
| Stat tiles with a coloured number | `app/components/StatTile.vue` |
| Every container is the same ringed, rounded `UCard`, in 15 files | `layers/*`, `app/*` |
| 83 different Lucide icons, most tinted `text-primary` | `layers/*`, `app/*` |
| Soft-tinted pill badges on every label, link and tag | the Projects and Overview pages |
| An emoji as each project's icon | the Projects page |
| At 390 px the page title truncates to "Overvi" | `app/layouts/default.vue` page header |

## Options considered

| Option | Why not |
| --- | --- |
| Keep 0021 and only restyle | Its first screen still opens on "Monorepo" and three generic cards, and its ban on portal copy leaves the visitor with READMEs written for developers |
| Benchmark well-known developer blogs and portfolios | A first pass did; the owner rejected most of it. Juried galleries replaced it |
| Benchmark only landing pages | The portal is mostly collections, tables and docs; W4 and W5 come from inner pages |
| Retheme Nuxt UI's colours and stop there | Eight of the ten stock traits survive a colour change |

## Consequences

The design lab (`cap:design-lab`) builds every direction from the rules in "How it lands", and
each direction fails if it keeps a stock trait or hits N1–N4. Each direction names its one W8
figure, or says it has none.

**Order.** Type and colour tokens first, since every other row reads them. Then the index-row
component, which four pages share. The front page and showcase come last, because they depend on
`cap:visitor-copy`.

**Tripwires.**

- The three status tones in `main.css` were validated as a set for contrast and colour-blind
  separation. The new accent must not replace one; re-run the `dataviz` validator if it sits beside
  them.
- 0021's Confirmation table greps for the intent cards and for "no persona-mode state". Those checks
  stop holding once the visitor view lands.
- Several references depend on motion a screenshot misses. Open them in a browser before borrowing.
- Screenshots are not committed: they are third-party pages that would go stale in the repo.

## Confirmation

| Claim | Check |
| --- | --- |
| The accent and neutral are set | `grep -n "colors" apps/developer-portal/layers/design/app/app.config.ts` finds `primary` and `neutral` |
| Three faces are tokens | `grep -nE "font-(display\|sans\|mono)" apps/developer-portal/layers/design/app/assets/main.css` finds all three |
| No text step under 12 px | `grep -n "text-2xs" -r apps/developer-portal --include=*.css` finds no 11 px step |
| Collections are index rows | The four index pages render the shared row component, not `UCard` |
| No stock trait survives | Each `/lab` direction's screenshots at 390 and 1280 px show none of the ten traits above |
