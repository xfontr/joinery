# 🎨 Marina Roustan design

The tokens for the rebuild of [marinaroustan.com](https://marinaroustan.com/). Every colour, type
step and radius below came out of `pnpm brand:extract` run against the live home, `/servicios/`,
`/contacto/` and `/blog/` on 15 Nov 2026, not transcribed by hand; the
[`brand` script's README](../../infrastructure/scripts/src/brand/README.md) says how each one is
picked. Tone is the one row a person wrote, from a screenshot of the home page at 1280 px.

## 🧩 What stays recognizably Marina

| Ingredient | Direction |
| --- | --- |
| Paper | Pale blue `#DEF1FC` as the page, with white `#FFFFFF` bands between sections |
| Ink | Slate blue `#375B6F` for body text and headings alike |
| Primary | Sky blue `#5E98B8` for links and subtitles; `#2F586D` whenever it carries text |
| Accent | Ochre `#B6671E` on the calls to action and the kickers; `#7E3F00` whenever it carries text |
| Type | Lato throughout: 700 for headings, 300 for body text at 21 px |
| Tone | A calm clinical practice: flat illustrations on pale blue, one ochre button per section, rounded cards, no photography beyond the portrait |

## 🗂 Structure

| Path | Role |
| --- | --- |
| [`layers/design/app/assets/main.css`](./layers/design/app/assets/main.css) | Every token: palettes, type scale, Nuxt UI's semantic roles pointed at them, and the base focus ring |
| [`layers/design/app/app.config.ts`](./layers/design/app/app.config.ts) | Nuxt UI's colour aliases: primary sky, secondary ochre, neutral ink, error danger |
| [`layers/design/nuxt.config.ts`](./layers/design/nuxt.config.ts) | Loads `main.css`, turns colour mode off and has `@nuxt/fonts` serve Lato at the four weights the site uses |

## 🎨 Tokens

Palettes are namespaced (`marina-paper`, `marina-ink`, `marina-sky`, `marina-ochre`,
`marina-danger`) so none shadows a Tailwind palette, and each runs 50–950 because Nuxt UI generates
all eleven shades for every alias. Each ramp is the extract's own output, with the live colour
unchanged at its step; `marina-danger` is the one generated from a chosen red, since the site shows
no error colour.

Every text role on every surface, from `pnpm brand:contrast
apps/marina-roustan/layers/design/app/assets/main.css`, which exits 1 below 4.5:1. A token change
re-runs it and replaces this table.

| Role | Token | Surface | Ratio |
| --- | --- | --- | --- |
| `--ui-text-dimmed` | `marina-paper-600` | `--ui-bg` → `marina-paper-100` | 6.67:1 |
| `--ui-text-dimmed` | `marina-paper-600` | `--ui-bg-muted` → `marina-paper-50` | 7.43:1 |
| `--ui-text-dimmed` | `marina-paper-600` | `--ui-bg-elevated` → `marina-paper-50` | 7.43:1 |
| `--ui-text-dimmed` | `marina-paper-600` | `--ui-bg-accented` → `marina-paper-200` | 6.16:1 |
| `--ui-text-muted` | `marina-paper-600` | `--ui-bg` → `marina-paper-100` | 6.67:1 |
| `--ui-text-muted` | `marina-paper-600` | `--ui-bg-muted` → `marina-paper-50` | 7.43:1 |
| `--ui-text-muted` | `marina-paper-600` | `--ui-bg-elevated` → `marina-paper-50` | 7.43:1 |
| `--ui-text-muted` | `marina-paper-600` | `--ui-bg-accented` → `marina-paper-200` | 6.16:1 |
| `--ui-text-toned` | `marina-ink-600` | `--ui-bg` → `marina-paper-100` | 6.26:1 |
| `--ui-text-toned` | `marina-ink-600` | `--ui-bg-muted` → `marina-paper-50` | 6.98:1 |
| `--ui-text-toned` | `marina-ink-600` | `--ui-bg-elevated` → `marina-paper-50` | 6.98:1 |
| `--ui-text-toned` | `marina-ink-600` | `--ui-bg-accented` → `marina-paper-200` | 5.79:1 |
| `--ui-text` | `marina-ink-600` | `--ui-bg` → `marina-paper-100` | 6.26:1 |
| `--ui-text` | `marina-ink-600` | `--ui-bg-muted` → `marina-paper-50` | 6.98:1 |
| `--ui-text` | `marina-ink-600` | `--ui-bg-elevated` → `marina-paper-50` | 6.98:1 |
| `--ui-text` | `marina-ink-600` | `--ui-bg-accented` → `marina-paper-200` | 5.79:1 |
| `--ui-text-highlighted` | `marina-ink-700` | `--ui-bg` → `marina-paper-100` | 8.86:1 |
| `--ui-text-highlighted` | `marina-ink-700` | `--ui-bg-muted` → `marina-paper-50` | 9.87:1 |
| `--ui-text-highlighted` | `marina-ink-700` | `--ui-bg-elevated` → `marina-paper-50` | 9.87:1 |
| `--ui-text-highlighted` | `marina-ink-700` | `--ui-bg-accented` → `marina-paper-200` | 8.19:1 |
| `--ui-primary` | `marina-sky-600` | `--ui-bg` → `marina-paper-100` | 6.61:1 |
| `--ui-primary` | `marina-sky-600` | `--ui-bg-muted` → `marina-paper-50` | 7.36:1 |
| `--ui-primary` | `marina-sky-600` | `--ui-bg-elevated` → `marina-paper-50` | 7.36:1 |
| `--ui-primary` | `marina-sky-600` | `--ui-bg-accented` → `marina-paper-200` | 6.11:1 |
| `--ui-secondary` | `marina-ochre-600` | `--ui-bg` → `marina-paper-100` | 6.96:1 |
| `--ui-secondary` | `marina-ochre-600` | `--ui-bg-muted` → `marina-paper-50` | 7.76:1 |
| `--ui-secondary` | `marina-ochre-600` | `--ui-bg-elevated` → `marina-paper-50` | 7.76:1 |
| `--ui-secondary` | `marina-ochre-600` | `--ui-bg-accented` → `marina-paper-200` | 6.43:1 |
| `--ui-error` | `marina-danger-600` | `--ui-bg` → `marina-paper-100` | 7.13:1 |
| `--ui-error` | `marina-danger-600` | `--ui-bg-muted` → `marina-paper-50` | 7.94:1 |
| `--ui-error` | `marina-danger-600` | `--ui-bg-elevated` → `marina-paper-50` | 7.94:1 |
| `--ui-error` | `marina-danger-600` | `--ui-bg-accented` → `marina-paper-200` | 6.59:1 |
| `--ui-text-inverted` | `marina-paper-50` | `--ui-bg-inverted` → `marina-ink-600` | 6.98:1 |

The brand sky (`marina-sky-400`, 2.72:1 on paper) and ochre (`marina-ochre-500`, 3.66:1) fail as
text, so the roles take their 600 steps; the brand steps stay for fills and decoration.

| Type step | Spec (Lato, at 1280 px) | Where the live site uses it |
| --- | --- | --- |
| `text-h1` | 55 px, 0.9, 700 | The home page's h1 |
| `text-h2` / `h2-sm` | 52.5 / 48 px, 1.1, 700 | Section titles |
| `text-h3-lg` | 40 px, 1.2, 500–700 | Service titles |
| `text-h3` | 23 px, 1.2, 600 | Card and subtitle headings, the most-used h3 |
| `text-card` | 21 px, 1.2, 700 | Small headings in the credential row |
| `text-body` | 21 px, 1.6, 300 | Running text |

The controls' radius is `rounded-md`, Nuxt UI's control radius, at 7 px, the commonest radius on
the site's links and buttons; `--ui-radius` is `calc(7px / 1.5)` because `rounded-md` is 1.5 × it.

Colour reaches a component through Nuxt UI's roles (`bg-muted`, `text-primary`,
`border-accented`…), never a palette step: ESLint's `no-restricted-classes` in
[`eslint.config.ts`](./eslint.config.ts) rejects every `-50` to `-950` colour utility, Tailwind's
own palettes included, along with any arbitrary `text-`, `leading-` or `tracking-` value and any
arbitrary colour. The ban is whole-step from the start rather than per role, as Huella's grew, so no
raw step is ever there to migrate.

## 🧭 Deliberately deferred

| Later need | What changes |
| --- | --- |
| Dark theme | `ui.colorMode` is off; adding one means a second set of `--ui-*` roles, a dark pairing in `brand:contrast` and a new table |
| Component theme files | Huella's `app/theme/*.ts`, one per Nuxt UI component, wired into `app.config.ts` once a component needs more than the roles give it |
| Review gates | The design-lab directions and their gates, as [Huella's `DESIGN.md`](../huella-legal/DESIGN.md#-review-gates) records them, once there are pages to review |
| Small-screen type | The extract read 1280 px only; the 390 px steps come from the lab, not the live site |
| A step the ban blocks for a real reason | Add a role or a token to `main.css` rather than loosening the pattern in `eslint.config.ts` |
