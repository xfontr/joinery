# 🎨 Huella Legal design

The site was designed directly in code, reviewed at 390, 768 and 1280 px. There is no design file:
the running site is the design, and this page keeps the tokens and decisions behind it.

## What stays recognizably Huella

| Ingredient | Direction |
| --- | --- |
| Paper | Warm ivory `#F1E9DB` as the page, lighter `#FBF8F2` for fields and panels |
| Ink | Charcoal `#4E4E4E` for text, deep slate `#192630` for headings |
| Primary | Slate blue `#3E5A6D` for links and actions |
| Accent | Teal `#5DA399` as decoration only; `#326C65` whenever teal carries text |
| Type | Georgia for everything read, Montserrat for everything used to navigate |
| Tone | An academic journal, not a law firm: numbered issues, ISSN, hairline rules, no gradients |

> Tailwind's incremental scan sometimes misses classes in a new file. If a fresh page renders with
> a collapsed grid, touch [`main.css`](./layers/design/app/assets/main.css) or restart the dev server.

## Structure

| Path | Role |
| --- | --- |
| [`layers/design/app/assets/main.css`](./layers/design/app/assets/main.css) | Every token: palettes, type scale, measure, Nuxt UI's semantic roles pointed at them, and the base focus ring any element without its own falls back to |
| [`layers/design/app/app.config.ts`](./layers/design/app/app.config.ts) | Nuxt UI colour aliases and control defaults: 44 px minimum height, paper field surface, and a button theme that darkens on hover, rings outlines in ink and draws the 2 px focus ring |
| `.hl-prose` in [`layers/articles/app/assets/prose.css`](./layers/articles/app/assets/prose.css) | Reading typography for that HTML: headings, drop cap, notes, quotes, quoted legislation, tables, figures. It styles plain elements and Gutenberg's own wrappers (`wp-block-table`), so production can reuse it on CMS HTML |

## Tokens

Palettes are namespaced (`ivory`, `huella-slate`, `huella-teal`, `huella-ink`, `huella-danger`) so
none shadows a Tailwind palette, and each runs 50–950 because Nuxt UI generates all eleven shades
for every alias. Contrast ratios are measured on the canvas, so a token change needs them re-measured.

| Role | Token | Ratio on paper |
| --- | --- | --- |
| Headings | `--ui-text-highlighted` → `huella-slate-900` | 12.80:1 |
| Body | `--ui-text` → `huella-ink-700` | 6.90:1 |
| Secondary text | `--ui-text-muted` → `huella-ink-600` | 4.60:1 |
| Links, primary | `--ui-primary` → `huella-slate-500` | 6.03:1 |
| Teal text | `--ui-secondary` → `huella-teal-600` | 5.02:1 |
| Errors | `--ui-error` → `huella-danger-600` | 6.23:1 on `danger-50` |

| Type step | Spec | Use |
| --- | --- | --- |
| `text-display-sm` / `display` / `display-lg` | Georgia 38 / 52 / 60, 1.08, −0.02em | Homepage statement and article titles, one step per breakpoint |
| `text-title` / `title-lg` / `title-xl` | Georgia 42 / 56 / 64, 1.06, −0.02em | The h1 of every listing, index and utility page; `title-xl` only on the about page |
| `text-feature` / `feature-lg` / `feature-xl` | Georgia 32 / 40 / 46, 1.12, −0.02em | The homepage's lead article title |
| `text-figure` / `figure-lg` / `figure-xl` | Georgia 32 / 44 / 56, leading 1 | Stand-alone numbers: author and archive counts |
| `text-h1` / `h2` / `h3` | Georgia 40 / 30 / 24 | Lead-article titles, section titles and subsection titles, always regular weight |
| `text-reading` | Georgia 18/1.7 | Article body inside `max-w-measure` (680 px, about 70 characters) |
| `text-quote` / `text-citation` | Georgia italic 24 / Georgia 15 | Pull quotes / legal citations and footnotes |
| `text-meta` | Montserrat 400 13 | Date and reading time; author names set it at 600 |
| Kicker | Montserrat 600 12, uppercase, `tracking-kicker` (0.12em) | Category labels, section numbers |
| `text-label` | Montserrat 600 11, uppercase, `tracking-label` (0.14em) | The wordmark's tagline and the `§` tile's label |
| `text-reading-sm`, `h2-sm`, `h3-sm`, `quote-sm` | Georgia 17 / 26 / 21 / 21 | `.hl-prose` below `md`, where it switches to `reading`, `h2`, `h3` and `quote` |

### Surfaces and links

Colour reaches a component through Nuxt UI's roles (`bg-muted`, `text-secondary`,
`border-inverted`…), never a palette step the role already names; ESLint's
`no-restricted-classes` in [`eslint.config.ts`](./eslint.config.ts) rejects those steps and any
arbitrary `text-`, `leading-` or `tracking-` value.

| Utility | What it does | Why |
| --- | --- | --- |
| `surface-inverted` | Re-points the text, border and secondary roles for content on a slate-900 fill, so slate surfaces use the same classes as paper | Sets no colour itself, since a class list can't control Tailwind's order against `bg-*`/`text-*` |
| `underline-title` | A serif title link's hover underline: `--ui-border-accented`, 0.2em below | Slate-300 on paper and slate-500 on slate, through `surface-inverted` |

`text-kicker` is a typography utility that also sets the muted colour. Inside a Nuxt UI slot that
has a size variant, such as the command palette's `label`, tailwind-merge drops it in favour of
the variant's `text-xs`, so those slots spell the kicker out with `tracking-kicker`.

### Where the design departs from the Penpot tokens

An abandoned Penpot sheet (P5) supplied the original tokens. These are the deviations.

| Token | P5 value | Value | Why |
| --- | --- | --- | --- |
| Control / card radius | 8 px / 12 px | 4 px (`--ui-radius`) / 2–4 px | Rounded cards read as an app, not a journal; hairline rules carry the structure instead |
| Focus offset | 4 px | 2 px, in `main.css` and restated in `theme/button.ts` | Keeps the ring attached to tight inline links |
| Heading colour | `slate-800` | `slate-900` | More separation from body copy at regular weight |
| Kickers | No automatic uppercase | Uppercase, 0.12em tracking | CSS uppercase keeps Spanish accents; approved at Gate A |
| Canvas | `ivory-100` | `ivory-100` | Unchanged |
| Muted text | Stated as 4.60:1 | Measured 4.60:1 | Unchanged; the ratio was re-measured |

## Review gates

| Gate | Question | Status |
| --- | --- | --- |
| A | Do the foundations feel like Huella? | Approved 29 Sep 2026 |
| B | Which homepage direction? | Approved 29 Sep 2026: A · Revista, opened by B's statement line |
| C | Is the whole site ready at 390 / 768 / 1280? | Approved 29 Sep 2026 |
| D | Which benchmark proposals make it in? | Approved 30 Sep 2026: the D set, A wherever D has no page |

## Not designed yet

| Area | State |
| --- | --- |
| Interest calculator, comments | Built from Nuxt UI parts without a design pass |
| `hl-law`, `hl-note`, `hl-num` | Need mapping to Gutenberg block classes |
| Article imagery | Cards fall back to a `§` tile |
| Dark theme | `ui.colorMode` is off; needs a second set of `--ui-*` roles and a contrast pass |
