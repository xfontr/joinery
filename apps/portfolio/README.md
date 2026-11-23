# 🪪 @monorepo/portfolio

Xifré Font's personal site: the five rules, the method behind them, the project maps and the work
they produced. It shows what the [developer portal](../developer-portal/README.md) builds, without
building any of it.

## Development

| Command | What it does |
| --- | --- |
| `pnpm dev portfolio` | Start the site, from the workspace root |
| `pnpm exec nx build-static @monorepo/portfolio` | `nuxt build --prerender`, the build that deploys |
| `pnpm exec nx test:e2e @monorepo/portfolio` | Playwright over the build: axe in light and dark, keyboard, motion, SEO tags, sitemap |

- `build` delegates to `build-static`, so CI builds what deploys.
- With `NUXT_PUBLIC_DATA_URL` unset, as it is locally and in CI, every page renders without figures
  or maps.

## The portal's payload

Every count, map and benchmark comes from the portal's `/embed/data.json`, fetched at build from
`NUXT_PUBLIC_DATA_URL` through [`useSiteData.ts`](./app/composables/useSiteData.ts). The
[portal README](../developer-portal/README.md#the-payload) lists the keys, and
[`SiteData`](./app/types/SiteData.ts) types them.

- A figure is as fresh as the portal's last deploy.
- Set but unreachable, the URL fails the prerender rather than shipping a page without figures.
- Each composable is its own cut under its own key, so a page's payload carries only what it shows.
- A link into the portal goes through [`portalUrl`](./app/utils/portal.ts), since a path alone would
  404 here. A `live.href` path in `content/work/` is read the same way.

## Structure

| Path | What lives there |
| --- | --- |
| `app/pages/` | Front page, Method, About, Project maps (`/agentic-workflows`), Work and its case studies |
| `app/components/` | The sections those pages share, and the workflow map and glyph |
| `content/work/` | One markdown file per Work entry: the frontmatter holds the facts, the body the case study's story, and `caseStudy: false` marks a tool that links straight to its `live` URL |
| `app/assets/work/` | Case-study screenshots at 1440 × 900, served as WebP at 480, 960 and 1440 px |
| `i18n/locales/en.json` | The copy; `rules` holds the five rules both the front page and Method number |

## Deploy

[`portfolio-deploy.yml`](../../.github/workflows/portfolio-deploy.yml) runs after each successful portal
deploy, or by hand. It prerenders with the payload URL set and publishes to the `portfolio` Cloudflare
Pages project with `wrangler pages deploy`. Cloudflare only hosts.

- The site is served from the root of `SITE_URL` in [`nuxt.config.ts`](./nuxt.config.ts), which
  canonical, sitemap and share-image URLs are built on.
- `NUXT_PUBLIC_REPO_URL` is baked in at build time, derived by the workflow.

## Search and speed

| Concern | Where |
| --- | --- |
| Title, description, canonical, OG | `useSeoMeta` on each page; `nuxt-seo-utils` signs the title with the site name |
| Share image | `public/og-image.png` (1200×630) by default; a case study uses its own screenshot, cropped to that size |
| Structured data | A `Person` identity in `schemaOrg` |
| First paint | Styles inlined; no script preload or chunk prefetch; links prefetch on interaction |
| Hydration | Deferred to `load` or the first input by [`deferHydration.ts`](./server/plugins/deferHydration.ts), copied from huella-legal; a click made before then is replayed |
| Page changes | Pages rise in; a title or screenshot named with `carried()` flies to its namesake on the next page |

## Boundaries

`type:app`, `scope:portfolio`. Depends only on `@monorepo/configs`; nothing depends on it.
