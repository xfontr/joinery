# 📦 @monorepo/marina-roustan

A Nuxt 4 rebuild of Marina Roustan's website. So far it is one placeholder page, the environment
check, the test harness and the design tokens, so every page that follows lands on a pipeline that
already lints, typechecks, tests and runs e2e, and on colours that already pass contrast.

## 🎨 Design

The brand, the tokens and their contrast table are in [`DESIGN.md`](./DESIGN.md); every token
lives in [`layers/design`](./layers/design), on Nuxt UI and Tailwind v4.

## 🚀 Development

```sh
pnpm exec nx serve @monorepo/marina-roustan   # from anywhere in the workspace
pnpm dev                                      # or from this directory
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server. It reads no live site, so nothing it does reaches marinaroustan.com |
| `pnpm build` | Production build (output in `.output/`) |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint — the nuxt flavour, deliberately not type-checked, plus the Tailwind rules that ban raw palette steps |
| `pnpm typecheck` | `nuxt typecheck`. Redundant before a build: `typescript.typeCheck: "build"` makes `pnpm build` do the same pass |
| `pnpm test` | Vitest in the preset's projects, without coverage. `pnpm test:coverage` adds it — see [Testing](#-testing) |
| `pnpm test:e2e` | Playwright against the built `.output/`. Run `pnpm build` first; `nx test:e2e` does it for you |
| `pnpm exec nx nuxt-prepare @monorepo/marina-roustan` | Regenerates `.nuxt` (`nuxi prepare`) — [`nx.json`](../../nx.json) already runs it before `lint`/`typecheck`/`test`/`build`, so this is only for calling it by hand |

## 🔑 Environment

A variable a feature can't work without is listed under `requiredEnv` in
[`nuxt.config.ts`](./nuxt.config.ts), and [`modules/requiredEnv.ts`](./modules/requiredEnv.ts)
checks the list once at startup, so no route re-checks its config per request. Nothing is listed
yet, so the key is absent.

| Where | An unset required variable |
| --- | --- |
| Production build (`NUXT_SITE_ENV=production`) | Fails the build naming each one, so the live deploy keeps serving |
| `nuxt dev` | One warning at startup naming each one |
| Any other build, CI's included | Nothing: CI builds with none of them set |

| Variable | What it is |
| --- | --- |
| `NUXT_SITE_ENV` | `production` on the production deploy and `preview` on every other deploy, unset in dev, CI and e2e builds. Only `production` fails on an unset required variable |
| `NUXT_PUBLIC_SITE_URL` | Optional. Overrides the public origin set in `nuxt.config.ts`, with scheme |

Only secrets and values that change per environment are env vars. A public value that is the same
everywhere is a literal in [`nuxt.config.ts`](./nuxt.config.ts), so changing it is a one-line PR:

| Literal | Value |
| --- | --- |
| `public.site.url` | The site's public origin, with no trailing slash |

Every variable is read at **startup**, not at build time, so one build artifact runs in any
environment. A new variable goes in [`.env.example`](./.env.example) and a row here.

## ✅ Testing

| Layer | Runs | Where | Command |
| --- | --- | --- | --- |
| `node` | Vitest on the [node preset](../../packages/configs/README.md) | `modules/`, `server/`, `shared/`, and `eslint.config.spec.ts` | `pnpm test` |
| `nuxt` | Vitest in a booted Nuxt app on happy-dom, via `@nuxt/test-utils` | `app/` | `pnpm test` |
| e2e | Playwright, Chromium only, at 390, 768 and 1280 px | [`e2e/`](./e2e) | `pnpm exec nx test:e2e @monorepo/marina-roustan` |

[`vitest.config.ts`](./vitest.config.ts) and [`playwright.config.ts`](./playwright.config.ts) are
wrappers over the shared presets in [`@monorepo/configs`](../../packages/configs/README.md), which
own the project split, where coverage lives and the widths. This app only keeps `app/pages/**` out
of the coverage denominator, because pages are Playwright's, and lists `eslint.config.spec.ts` in
`nodeSpecs`, since it sits outside every preset glob.

### 🎭 e2e

Playwright runs the built `.output/` server on port 4320 with [`e2e/server.ts`](./e2e/server.ts)
preloaded through `node --import`. The app reads no upstream yet, so the preload only calls
`recordServerConsole()`: the preset's teardown fails the run on anything the server logged, and on a
server that never recorded at all. Specs import `test` from `@monorepo/configs/playwright/utils/test`,
which fails a test on any browser console output; a 404 test allows its own with
`test.use({ allowedConsole: [NOT_FOUND_DOCUMENT] })`. Each page's spec runs an axe scan against
WCAG 2.1 AA, once per width.

The Chromium has to match `@playwright/test`'s version in the
[catalog](../../pnpm-workspace.yaml), and CI runs the specs inside the Playwright image that
[`ci.yml`](../../.github/workflows/ci.yml) pins to it, uploading `.playwright/` on failure.

## 🧭 Deliberately deferred

| Later need | What changes |
| --- | --- |
| Content | Local Markdown, decided on #448. Whatever reads it, dev and e2e read fakes or fixtures in the repo, never the live site |
| A per-environment host or a key | An env var with no default, a line in `.env.example`, a row in the table above and, if the feature can't work without it, an entry under `requiredEnv` in `nuxt.config.ts` |
| Thresholds | `thresholds` in `vitest.config.ts` once there is code beyond the scaffold to measure |
| SEO, robots and the sitemap | The `@nuxtjs/*` SEO modules, as `huella-legal` has them, with `NUXT_SITE_ENV` keeping previews out of search |
