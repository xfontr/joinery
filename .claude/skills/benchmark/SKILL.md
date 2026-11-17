---
name: benchmark
description: Benchmark a site or app's design against strong references — source them from juried and curated galleries, capture each in full, analyse every site on the same dimensions with measured type and colour, then synthesise what to take, what to avoid and how it fits this project. Use on "benchmark X", "find references for X", "design research for X", "what are the best sites like X", or a `cap:benchmark` spike. Writing the result up is `decision-report`.
---

# Benchmarking a design

A benchmark answers **what this project should do, learned from sites that already do it well.** A
gallery of screenshots with "this one's cool" beside each is not a benchmark. The output is a set of
conclusions the design lab can build from and be checked against.

The steps run in order. Each one is a gate the next depends on.

## 1. Know what you're benchmarking for

Before looking at a single site, write down:

| Fact | Where it comes from |
| --- | --- |
| Who reads the page, and what they should know after 30 seconds | The issue, the workflow project's summary, the user |
| Every **page type** the project has: a landing, a list, a data table, a long doc, a chart, a form | The app's routes |
| The constraints: component library, static or SSR, contrast floor, phone first | The app's README and `CLAUDE.md` |
| What the project looks like today, and which of its traits are stock | Screenshots of the current pages, and its design layer |

A landing-page benchmark says nothing about how a dense table should look. **Every page type needs
references of its own.**

## 2. Source from where the bar is set

Never pick references from memory, from well-known developer blogs, or from whatever a web search
ranks first. Start from galleries where a jury or a curator has already filtered for quality, and
match the gallery to the page type.

| Page type | Start from |
| --- | --- |
| Landings, portfolios, front pages | [Awwwards](https://www.awwwards.com) (Site of the Day, of the Month, Developer Award, high jury scores), [CSS Design Awards](https://www.cssdesignawards.com), [The FWA](https://thefwa.com), [Godly](https://godly.website), [Siteinspire](https://www.siteinspire.com), [Behance](https://www.behance.net) curated galleries |
| Product UI: dashboards, tables, settings, docs | [Refero](https://refero.design), [Mobbin](https://mobbin.com) (needs an account), [Godly](https://godly.website)'s app category, the docs and data pages of design systems such as [Carbon](https://carbondesignsystem.com) and [Primer](https://primer.style) |
| Type pairings | [Typewolf](https://www.typewolf.com), [Fonts In Use](https://fontsinuse.com) |

- **Collect wide, then cut.** Around thirty candidates from at least three galleries, then a
  shortlist of ten to twelve.
- **Shortlist by fit, not fame:** it's live and loads without a click or sound; it matches a page
  type from step 1; a reader gets its point without waiting on an intro; it isn't a gimmick the
  project could never use.
- **Show the shortlist to the user before analysing anything**, as links with one 1280 px
  screenshot each. The user sets the taste bar; deep analysis of a site they'd reject is wasted.
- Some galleries and sites refuse automated browsers or show only a WebGL intro. Wait longer once,
  then record them as excluded with the reason, never as analysed.

## 3. Capture every site in full

A first-screen screenshot hides most of what makes a site good. For each shortlisted site:

| Capture | How |
| --- | --- |
| The home page at 390 and 1280 px, **full page** | Playwright from the workspace, a script in the scratchpad; scroll to the bottom first so lazy content loads, and wait out any intro |
| Two or three inner pages, chosen to match the project's page types | The site's own nav |
| Type and colour, measured | In the same capture script, every visible text element's computed font family and size, and the most-painted colours, per page and width. Not `pnpm brand:extract`: it merges every URL into one brand and outputs build tokens, not a comparison |
| Motion and interaction | Open it in a real browser; note what moves, when, and whether the page works without it |

Keep the captures in the scratchpad. Third-party screenshots are not committed.

## 4. Analyse every site on the same dimensions

One analysis per site, every dimension filled from the captures. Each cell states a fact with its
evidence — a measured value, a page, a pixel width — not an adjective.

| Dimension | Answer |
| --- | --- |
| First 30 seconds | What a reader knows, and which element told them |
| Layout and grid | Columns, margins, how sections are separated, density |
| Type | Families, the measured sizes, how many sizes, display versus body |
| Colour | Paper, ink, accents and how many, where the accent is spent |
| Imagery | Photos, renders, illustration, the product itself, or none |
| Navigation | Sidebar, top bar, corner labels, index, menu button; how deep pages are reached |
| Dense content | How a list, table, doc or figure is handled, if the site has one |
| Motion | What animates, and whether content waits on it |
| Phone | What changes at 390 px: reflow, hiding, reordering |
| What fails | Where it's slow, unreadable, low-contrast or gimmicky |

## 5. Synthesise

The analyses are evidence. The synthesis is the deliverable.

1. **Patterns, counted.** "Seven of eleven set the hero in one display face over 96 px", not "many
   use big type".
2. **Want, don't want.** Each pattern is kept or rejected for **this** project, with the reason
   tied to step 1's reader, page types and constraints.
3. **How to make it work here.** Each kept pattern becomes a concrete rule for the project's own
   pages and components: which page type, which component, which token. A pattern that can't be
   expressed in the project's stack, or fails its contrast floor, is rejected here, not in the lab.
4. **The anti-list.** The project's current stock traits and the failures from step 4, as checks a
   lab direction must pass.

## 6. Write it up

The result is a decision report: follow the `decision-report` skill. The per-site analyses go in as
one table per dimension group, so the Result stays scannable; the synthesis is the Result's lead.

## 📚 Lessons

- **#472.** References were picked from memory, mostly famous developer portfolios; the user
  rejected six of ten. Of that first pass, rauno.me, linear.app/method, primer.style and
  carbondesignsystem.com held up and are the taste calibration for this repo.
- **#472.** Only the first screen of each site was captured and each verdict was a sentence, with
  no measurements, no inner pages and no reference for the project's dense pages. The redo followed
  steps 3–5.
