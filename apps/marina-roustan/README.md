# 📦 @joinery/marina-roustan

A Nuxt 4 rebuild of Marina Roustan's website. So far: one placeholder page, the env check, the test
harness and the design tokens.

## Design

The brand, the tokens and their contrast table are in [`DESIGN.md`](./DESIGN.md); every token
lives in [`layers/design`](./layers/design), on Nuxt UI and Tailwind v4.

## Development

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server. Reads no live site |
| `pnpm build` | Production build into `.output/`. Also typechecks |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Vitest. `pnpm test:coverage` adds coverage |
| `pnpm test:e2e` | Playwright against `.output/`. Build first, or run `nx test:e2e` |
| `pnpm exec nx nuxt-prepare @joinery/marina-roustan` | Regenerate `.nuxt` by hand; Nx already runs it before lint, typecheck, test and build |

## Environment

Same mechanism as [huella-legal](../huella-legal/README.md#environment): a variable a feature
needs goes under `requiredEnv` in [`nuxt.config.ts`](./nuxt.config.ts), checked by
[`modules/requiredEnv.ts`](./modules/requiredEnv.ts). None is listed yet.

| Variable | What it is |
| --- | --- |
| `NUXT_SITE_ENV` | `production` on the production deploy and `preview` on every other deploy, unset in dev, CI and e2e builds. Only `production` fails on an unset required variable |
| `NUXT_PUBLIC_SITE_URL` | Optional. Overrides the public origin set in `nuxt.config.ts`, with scheme |

`public.site.url` is a literal in [`nuxt.config.ts`](./nuxt.config.ts). A new variable goes in
[`.env.example`](./.env.example) and a row here.

## Testing

| Layer | Runs | Where | Command |
| --- | --- | --- | --- |
| `node` | Vitest on the [node preset](../../packages/configs/README.md) | `modules/`, `server/`, `shared/`, and `eslint.config.spec.ts` | `pnpm test` |
| `nuxt` | Vitest in a booted Nuxt app on happy-dom, via `@nuxt/test-utils` | `app/` | `pnpm test` |
| e2e | Playwright, Chromium only, at 390, 768 and 1280 px | [`e2e/`](./e2e) | `pnpm exec nx test:e2e @joinery/marina-roustan` |

Both configs wrap the [`@joinery/configs`](../../packages/configs/README.md) presets. Pages are
left out of coverage; Playwright covers them.

### e2e

Runs the built server on port 4320 with [`e2e/server.ts`](./e2e/server.ts) preloaded, which only
records server console output for now. Any console output fails a test, and every page spec runs an
axe scan. Conventions are in the [configs README](../../packages/configs/README.md#playwright).

## Next

| Need | Plan |
| --- | --- |
| Content | Local Markdown (#448). Dev and e2e never read the live site |
| SEO, robots, sitemap | The `@nuxtjs/*` SEO modules, as huella-legal has them |
| Coverage thresholds | Once there's code beyond the scaffold |
