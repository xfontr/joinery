# 🎨 Alba Tomico design

The tokens for the port of Alba Tomico's photography portfolio, taken one for one from the old
site's `assets/_variables.scss`. The port is pixel-perfect, so a new token needs a reason the
old site lacked one.

## Structure

| Path | Role |
| --- | --- |
| [`layers/design/app/assets/main.css`](./layers/design/app/assets/main.css) | Every token, Nuxt UI's semantic roles pointed at them, and the old reset's line height |
| [`layers/design/app/app.config.ts`](./layers/design/app/app.config.ts) | Nuxt UI's colour aliases, both `neutral`; the roles in `main.css` override them |
| [`layers/design/nuxt.config.ts`](./layers/design/nuxt.config.ts) | Loads `main.css`, turns colour mode off and has `@nuxt/fonts` serve Montserrat at 300, 600 and 900 |

## Tokens

| Old variable | Token | Class |
| --- | --- | --- |
| `$color-primary`, `$color-secondary` | `--color-paper` (white), `--color-ink` (black) | Only through a role: `bg-default`, `text-default`, `bg-inverted`, `text-inverted` |
| `$distances-s/m/l` | `--spacing-s/m/l` | `p-m`, `gap-s`, `mb-l` |
| `$font-size-m/l/xl/xxl` | `--text-m/l/xl/xxl`, plus `--text-status` for the error page's 1.5 × xxl | `text-l` |
| `$z-index-s…xxl` | `--z-index-s…xxl` | `z-m` |

`text-xl` is the old site's 2.75 rem, not Tailwind's. The lint bans in
[`eslint.config.ts`](./eslint.config.ts) reject every other colour, type size, spacing step and
z-index.

The table below is the output of `pnpm brand:contrast
apps/alba-tomico/layers/design/app/assets/main.css`. Re-run it and replace the table after any
token change.

| Role | Token | Surface | Ratio |
| --- | --- | --- | --- |
| `--ui-text-dimmed` | `paper` | `--ui-bg` → `ink` | 21.00:1 |
| `--ui-text-dimmed` | `paper` | `--ui-bg-muted` → `ink` | 21.00:1 |
| `--ui-text-dimmed` | `paper` | `--ui-bg-elevated` → `ink` | 21.00:1 |
| `--ui-text-dimmed` | `paper` | `--ui-bg-accented` → `ink` | 21.00:1 |
| `--ui-text-muted` | `paper` | `--ui-bg` → `ink` | 21.00:1 |
| `--ui-text-muted` | `paper` | `--ui-bg-muted` → `ink` | 21.00:1 |
| `--ui-text-muted` | `paper` | `--ui-bg-elevated` → `ink` | 21.00:1 |
| `--ui-text-muted` | `paper` | `--ui-bg-accented` → `ink` | 21.00:1 |
| `--ui-text-toned` | `paper` | `--ui-bg` → `ink` | 21.00:1 |
| `--ui-text-toned` | `paper` | `--ui-bg-muted` → `ink` | 21.00:1 |
| `--ui-text-toned` | `paper` | `--ui-bg-elevated` → `ink` | 21.00:1 |
| `--ui-text-toned` | `paper` | `--ui-bg-accented` → `ink` | 21.00:1 |
| `--ui-text` | `paper` | `--ui-bg` → `ink` | 21.00:1 |
| `--ui-text` | `paper` | `--ui-bg-muted` → `ink` | 21.00:1 |
| `--ui-text` | `paper` | `--ui-bg-elevated` → `ink` | 21.00:1 |
| `--ui-text` | `paper` | `--ui-bg-accented` → `ink` | 21.00:1 |
| `--ui-text-highlighted` | `paper` | `--ui-bg` → `ink` | 21.00:1 |
| `--ui-text-highlighted` | `paper` | `--ui-bg-muted` → `ink` | 21.00:1 |
| `--ui-text-highlighted` | `paper` | `--ui-bg-elevated` → `ink` | 21.00:1 |
| `--ui-text-highlighted` | `paper` | `--ui-bg-accented` → `ink` | 21.00:1 |
| `--ui-primary` | `paper` | `--ui-bg` → `ink` | 21.00:1 |
| `--ui-primary` | `paper` | `--ui-bg-muted` → `ink` | 21.00:1 |
| `--ui-primary` | `paper` | `--ui-bg-elevated` → `ink` | 21.00:1 |
| `--ui-primary` | `paper` | `--ui-bg-accented` → `ink` | 21.00:1 |
| `--ui-text-inverted` | `ink` | `--ui-bg-inverted` → `paper` | 21.00:1 |
