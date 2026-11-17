# 🎨 Marina Roustan design

The tokens for the rebuild of [marinaroustan.com](https://marinaroustan.com/), extracted from the
live site with [`pnpm brand:extract`](../../infrastructure/scripts/src/brand/README.md) on
15 Nov 2026. Tone is the one row a person wrote.

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
| [`layers/design/app/app.config.ts`](./layers/design/app/app.config.ts) | Nuxt UI's colour aliases: primary tide, secondary ochre, neutral ink, error danger |
| [`layers/design/nuxt.config.ts`](./layers/design/nuxt.config.ts) | Loads `main.css`, turns colour mode off and has `@nuxt/fonts` serve Lato at the four weights the site uses |

## 🎨 Tokens

Palettes `paper`, `ink`, `tide`, `ochre` and `danger` run 50–950, with each live colour unchanged at
its step. `danger` is invented; the site has no error colour.

The table below is the output of `pnpm brand:contrast
apps/marina-roustan/layers/design/app/assets/main.css`. Re-run it and replace the table after any
token change.

| Role | Token | Surface | Ratio |
| --- | --- | --- | --- |
| `--ui-text-dimmed` | `paper-600` | `--ui-bg` → `paper-100` | 6.67:1 |
| `--ui-text-dimmed` | `paper-600` | `--ui-bg-muted` → `paper-50` | 7.43:1 |
| `--ui-text-dimmed` | `paper-600` | `--ui-bg-elevated` → `paper-50` | 7.43:1 |
| `--ui-text-dimmed` | `paper-600` | `--ui-bg-accented` → `paper-200` | 6.16:1 |
| `--ui-text-muted` | `paper-600` | `--ui-bg` → `paper-100` | 6.67:1 |
| `--ui-text-muted` | `paper-600` | `--ui-bg-muted` → `paper-50` | 7.43:1 |
| `--ui-text-muted` | `paper-600` | `--ui-bg-elevated` → `paper-50` | 7.43:1 |
| `--ui-text-muted` | `paper-600` | `--ui-bg-accented` → `paper-200` | 6.16:1 |
| `--ui-text-toned` | `ink-600` | `--ui-bg` → `paper-100` | 6.26:1 |
| `--ui-text-toned` | `ink-600` | `--ui-bg-muted` → `paper-50` | 6.98:1 |
| `--ui-text-toned` | `ink-600` | `--ui-bg-elevated` → `paper-50` | 6.98:1 |
| `--ui-text-toned` | `ink-600` | `--ui-bg-accented` → `paper-200` | 5.79:1 |
| `--ui-text` | `ink-600` | `--ui-bg` → `paper-100` | 6.26:1 |
| `--ui-text` | `ink-600` | `--ui-bg-muted` → `paper-50` | 6.98:1 |
| `--ui-text` | `ink-600` | `--ui-bg-elevated` → `paper-50` | 6.98:1 |
| `--ui-text` | `ink-600` | `--ui-bg-accented` → `paper-200` | 5.79:1 |
| `--ui-text-highlighted` | `ink-700` | `--ui-bg` → `paper-100` | 8.86:1 |
| `--ui-text-highlighted` | `ink-700` | `--ui-bg-muted` → `paper-50` | 9.87:1 |
| `--ui-text-highlighted` | `ink-700` | `--ui-bg-elevated` → `paper-50` | 9.87:1 |
| `--ui-text-highlighted` | `ink-700` | `--ui-bg-accented` → `paper-200` | 8.19:1 |
| `--ui-primary` | `tide-600` | `--ui-bg` → `paper-100` | 6.61:1 |
| `--ui-primary` | `tide-600` | `--ui-bg-muted` → `paper-50` | 7.36:1 |
| `--ui-primary` | `tide-600` | `--ui-bg-elevated` → `paper-50` | 7.36:1 |
| `--ui-primary` | `tide-600` | `--ui-bg-accented` → `paper-200` | 6.11:1 |
| `--ui-secondary` | `ochre-600` | `--ui-bg` → `paper-100` | 6.96:1 |
| `--ui-secondary` | `ochre-600` | `--ui-bg-muted` → `paper-50` | 7.76:1 |
| `--ui-secondary` | `ochre-600` | `--ui-bg-elevated` → `paper-50` | 7.76:1 |
| `--ui-secondary` | `ochre-600` | `--ui-bg-accented` → `paper-200` | 6.43:1 |
| `--ui-error` | `danger-600` | `--ui-bg` → `paper-100` | 7.13:1 |
| `--ui-error` | `danger-600` | `--ui-bg-muted` → `paper-50` | 7.94:1 |
| `--ui-error` | `danger-600` | `--ui-bg-elevated` → `paper-50` | 7.94:1 |
| `--ui-error` | `danger-600` | `--ui-bg-accented` → `paper-200` | 6.59:1 |
| `--ui-text-inverted` | `paper-50` | `--ui-bg-inverted` → `ink-600` | 6.98:1 |

The brand tide (`tide-400`, 2.72:1 on paper) and ochre (`ochre-500`, 3.66:1) fail as
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

Colour reaches a component through Nuxt UI's roles (`bg-muted`, `text-primary`…), never a palette
step: [`eslint.config.ts`](./eslint.config.ts) rejects every `-50`…`-950` colour utility and any
arbitrary type or colour value. Need a new one? Add a role or token to `main.css`.

## 🧭 Not done yet

Dark theme (`ui.colorMode` is off), small-screen type (only 1280 px was extracted), and per-component
theme files.
