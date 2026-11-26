---
issue: 527
status: implemented
decision: accepted
---

# 🧭 The personal site is redesigned from a second benchmark of award-winning portfolios

## Context

The personal site (`apps/portfolio`) inherited its look from the developer portal's visitor view,
designed in [0039](./0039-developer-portal-benchmark.md) before anyone knew it would become a
portfolio or what it would hold. Its pages and copy are now settled. Its look still carries tells:
Impeccable's detector ([0043](./0043-impeccable-for-ai-made-designs.md)) finds 33 over the six
pages at 1280 and 390 px, and all three faces (Fraunces, IBM Plex Sans, IBM Plex Mono) are on its
list of reflex picks. The question is what award-winning portfolios do that this site should take,
with the palette, the pages and the copy held fixed.

## Result

**The pages, the copy and the palette stay; the type, the composition and the use of the accent
change.** Twelve portfolios were analysed, sourced from Awwwards (portfolio, portfolio winners,
developer and typography lists) and Siteinspire, and measured on 2026-11-25. Round 1's
[rauno.me](../benchmarks/rauno-me.md), [Linear Method](../benchmarks/linear-app-method.md),
[Bratiiev](../benchmarks/bratiiev-com.md) and [Romain Avalle](../benchmarks/romainavalle-dev.md)
back up the counts. Award portfolios show visual work and this site shows a method, so they are
references for technique, not for a look.

| # | Pattern, counted over the 12 | For this site |
| --- | --- | --- |
| P1 | Four type sizes or fewer per page: 9 of 12. Lord and Huybrecht use one, Mangham two | **Want**: the front page uses 11 today |
| P2 | One or two faces carry the site: 9 of 12; only Neath, Kaspar and Bîrkar use three or more | **Want**: three faces in seven styles today |
| P3 | A serif carries sentences at 50 px or less (Vitanov, Takahashi, Bîrkar); no site sets a light serif display over 100 px | **Want**: Fraunces 300 at 128 px goes |
| P4 | Mono only for facts such as dates, disciplines, credits and counts: 7 of 12. Only Rajesh labels a section with a category | **Want**: 9 category labels on the front page today |
| P5 | Facts as label–value lines or columns: 8 of 12 (Clement's case pages, Rajesh's facts row, Mangham's credential strip) | **Want** for case studies and About |
| P6 | One accent at most: 12 of 12, and 10 use none, so colour comes from the work | **Want**: terracotta keeps two jobs out of six |
| P7 | Each project introduced by one sentence or a stated outcome: 4 of 12 (Neath, Vitanov, Clement, Rajesh) | **Want**, from the copy that exists: `line`, `why` |
| P8 | Wayfinding that stays put: Grégory's fixed index, Takahashi's pinned CV, Clement's sticky caption | **Want** on Method's five rules |
| P9 | Structure drawn as hairlines between rows or as visible column rules: 6 of 12 | **Want**: already the house rule line |
| P10 | A figure explained by notes on leader lines instead of a legend: Bîrkar | **Want, once**: the Huella Legal project map |
| P11 | A figure printed with its source or date: Mangham, Rajesh | **Want**: case facts already carry "as of" |
| N1 | Reading text under 12 px: 8 of 12, down to 9 px | **Reject**: the 12 px floor and axe in e2e stay |
| N2 | Content that waits on an intro, a scroll reveal or falling tags: 3 of 12 | **Reject** |
| N3 | Logo strips, pill filters, rounded image panels: 3 of 12 | **Reject** |
| N4 | 14 or more sizes (Bîrkar 23, Rajesh 14) | **Reject** |

What gets measured or counted, per direction in the lab and then in the build. Paths are under
`apps/portfolio/` and line numbers are as of this report.

| Rule | From | Where today | Change |
| --- | --- | --- | --- |
| New faces, none on Impeccable's reflex list | P2, P3 | `nuxt.config.ts` `fonts.families`; `app/assets/main.css` `@theme` `--font-*` | The approved direction's two or three faces |
| Six type steps, 12 px floor | P1, N1 | `main.css` `--text-statement` to `--text-heading`, plus ad hoc `text-xl`–`text-3xl` | `hero` or `title`, then `section`, `heading`, `lead`, `base` and `meta` |
| No category label above a heading | P4 | `index.vue:10`, `:52`; `WorkflowTeaser.vue:8`; `method.vue:51`; `about.vue:28`; `PageHero.vue:3` | Remove, or replace with a fact (`kind · stage`, a count) |
| The rule numbers stop being 72 px accent numerals | P4, P6 | `index.vue:18`, `RuleSection.vue:4`, `agentic-workflows.vue:12` | Set in the facts voice |
| The accent marks links and the map only | P6 | `main.css:210` (`mark`), the numerals above, `active-class` in `layouts/default.vue` | `mark` takes the direction's treatment; numerals lose the accent |
| A case study opens on its title, lead and live link | P5, P11 | `pages/work/[app].vue:11-18`, the side-striped box with a pulsing dot | The kicker, the counts and the in-progress flag go; the screenshot sits at half width beside the story |
| About and Method use a label column beside the content | P5, P8 | `about.vue`, `RuleSection.vue` | Two columns from `md` up, stacked below |
| Three identical cards become one row of links | N3 | `index.vue:30-45` (`DEEPER`) | Three links in one ruled row |
| Work as index rows | P5, P9 | `components/work/List.vue`, `pages/work/index.vue` | Name, line, links and, for a case study, a thumbnail, with a hairline between |

**The direction was approved in a lab** that rendered all six pages from the real copy and the
portal's payload, and was then built in #527. It reorganises the layout itself; a reskin of the old
section order was tried and dropped.

| Part | What it does | From |
| --- | --- | --- |
| Faces | Schibsted Grotesk at 500 for display and text, Geist Mono for facts | P1–P4 |
| Front page, first screen | A statement at about 10 vw over the lead, with a live index of all four pieces of work and their stage | Mangham, Huybrecht |
| The five rules | One five-column sheet with hairlines between, not five stacked sections | Lord, Kaspar |
| Project map | A warm dark band, with the Huella glyph annotated on leader lines | Bîrkar |
| Work | One table of name, line and links, with a thumbnail for each case study | Neath, Clement, Lord |
| Method | A sticky index of the five rules that marks the one in view | Lallé |
| Case study | Title, lead and live link, then `why` and the story beside a half-width screenshot, then label–value design rows | Rajesh, Clement |
| Project maps | One percentage done per map in the body font, no legend; a narrow map sits beside its heading | P1, P6 |
| The `mark` | Kept in terracotta, roman, same weight | P6 |

As built: 0 detector findings over the six pages at both widths, against 33 before. The only new
copy is `agenticWorkflows.projects.done`; the kind and stage lines, the counts, the legend and the
in-progress flag were cut at the owner's request, with their keys and `inProgress` itself.

## Options considered

| Option | Why not |
| --- | --- |
| Keep the design and fix the detector's findings | 22 of the 33 are one rule (italic serif display), but the category labels, the numerals and the sizes are composition, and a detector pass leaves them |
| Benchmark developer portfolios only | Eleven of the 45 candidates were developers' sites, and six of those were WebGL showcases; the type and layout craft came from designers' and directors' sites |
| Restyle today's layout with new faces | Built and rejected: with the section order unchanged, three restyles read as the same site, made worse |
| A new palette as well | The owner keeps paper and terracotta; P6 says the problem is how many jobs the accent does, not its hue |
| Change the copy to fit the references, such as outcome titles | Copy is fixed; P7 is met with `line` and `why` |
| Let Impeccable's `critique` pick the direction | Its ban on any label above a heading would also remove Vitanov's facts line, which the benchmark keeps (P4) |

## Consequences

The personal site's look now owes nothing to the portal's visitor view of 0039.

**Order.** Faces and the size steps first, because every page reads them. Then the label and
numeral removals, which are deletions. The case-study facts row and the About and Method label
columns come next, then the work rows, and the annotated figure comes last.

**Tripwires.**

- **The portal shares the faces.** Its black chrome is IBM Plex (0039, `layers/design` in
  `apps/developer-portal`). A new face here doesn't force one there, but the cross-app link then
  changes type mid-click. That is the owner's call, made separately.
- **Figures need the live payload in dev.** Run `NUXT_PUBLIC_DATA_URL=https://xifre.dev/portal/embed/data.json
  pnpm dev portfolio`; without it every figure and map renders empty.
- **Wide maps scroll rather than shrink.** Scaled to fit, their 12 px labels fall under the floor.
- **The `mark` is in the copy.** Each headline's last words are a separate key, such as
  `index.titleMark`, so any treatment is CSS only. Merging the keys is a copy change and needs
  approval.

## Confirmation

| Claim | Check |
| --- | --- |
| No reflex faces left | `grep -nE "Fraunces\|IBM Plex" apps/portfolio/nuxt.config.ts apps/portfolio/app/assets/main.css` finds nothing |
| Fewer tells than the baseline | `DO_NOT_TRACK=1 npx impeccable@4.10.0 detect --json --viewport <w>x<h> <url>` over the six pages at 1280x800 and 390x844 sums to 0 |
| Six steps, 12 px floor | Computed `font-size` of every visible text node on each page, at both widths, gives six values or fewer, all at 12 px or more |
| No category labels | `grep -rn "uppercase" apps/portfolio/app/pages apps/portfolio/app/components` finds only the map's stage names and the check areas in `ChecksPreview` |
| No side stripe or pulse | `grep -rn "border-l-2\|animate-pulse" apps/portfolio/app` finds nothing |
