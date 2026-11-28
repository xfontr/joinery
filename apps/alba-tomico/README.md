# 📦 @joinery/alba-tomico

Nuxt 4 port of Alba Tomico's photography portfolio, pixel for pixel from the old site, with
ImageKit as its content source.

## Design

The tokens and their contrast table are in [`DESIGN.md`](./DESIGN.md); every token lives in
[`layers/design`](./layers/design), on Nuxt UI and Tailwind v4.

## Development

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server. Reads no live site |
| `pnpm build` | Production build into `.output/`, prerendering `/`. Also typechecks |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Vitest. `pnpm test:coverage` adds coverage |
| `pnpm test:e2e` | Playwright against `.output/`. Build first, or run `nx test:e2e` |
| `pnpm exec nx nuxt-prepare @joinery/alba-tomico` | Regenerate `.nuxt` by hand; Nx already runs it before lint, typecheck, test and build |

## Environment

Same mechanism as [huella-legal](../huella-legal/README.md#environment): a variable a feature
needs goes under `requiredEnv` in [`nuxt.config.ts`](./nuxt.config.ts), checked by
[`modules/requiredEnv.ts`](./modules/requiredEnv.ts). None is listed yet; ImageKit's keys are
the first.

| Variable | What it is |
| --- | --- |
| `NUXT_SITE_ENV` | `production` on the production deploy and `preview` on every other deploy, unset in dev, CI and e2e builds. Only `production` fails on an unset required variable |

A new variable goes in [`.env.example`](./.env.example) and a row here.

## Copy

Every string is in [`i18n/locales/en.json`](./i18n/locales/en.json), carried over from the old
site's `locales/en.json`.

## Testing

| Layer | Runs | Where | Command |
| --- | --- | --- | --- |
| `node` | Vitest on the [node preset](../../packages/configs/README.md) | `modules/`, `server/`, `shared/`, and `eslint.config.spec.ts` | `pnpm test` |
| `nuxt` | Vitest in a booted Nuxt app on happy-dom, via `@nuxt/test-utils` | `app/` | `pnpm test` |
| e2e | Playwright, Chromium only, at 390, 768 and 1280 px | [`e2e/`](./e2e) | `pnpm exec nx test:e2e @joinery/alba-tomico` |

Both configs wrap the [`@joinery/configs`](../../packages/configs/README.md) presets. Pages are
left out of coverage; Playwright covers them.

### e2e

Runs the built server on port 4340 with [`e2e/server.ts`](./e2e/server.ts) preloaded, which only
records server console output for now. Any console output fails a test, and every page spec runs an
axe scan. Conventions are in the [configs README](../../packages/configs/README.md#playwright).
