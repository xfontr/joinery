# 📦 @monorepo/huella-legal

A Nuxt 4 redesign of the Huella Legal law blog. Content comes from an external WordPress through
[`@monorepo/content`](../../packages/content/README.md); the site is Spanish-only.

## 🚀 Development

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server against the [fake WordPress](#-dev-mocks), never huellalegal.com |
| `pnpm dev:api` | Dev server against the live WordPress. Only when the fakes can't show it |
| `pnpm build` | Production build into `.output/`. Also typechecks, which is why it's slow |
| `pnpm preview` | Serve the production build |
| `pnpm test` | Vitest. `pnpm test:coverage` enforces the thresholds |
| `pnpm test:e2e` | Playwright against `.output/`. Build first, or run `nx test:e2e` |
| `pnpm storybook` | Storybook on port 6007; `pnpm build:storybook` for a static build |
| `pnpm cache:clear` | Empty the local `articles` and `content` caches so the next request rereads WordPress |
| `pnpm exec nx nuxt-prepare @monorepo/huella-legal` | Regenerate `.nuxt` by hand; Nx already runs it before lint, typecheck, test and build |

### 🧪 Dev mocks

`pnpm dev` preloads [`mocks/server.ts`](./mocks/server.ts), an MSW fake of WordPress serving
[`mocks/content.json`](./mocks/content.json). The live host blacklists machines that read it too
often. An unknown slug is a `404`; any other request to huellalegal.com is an error in the dev log.
Kit, Turnstile and Resend stay inert without their keys.

### 📖 API reference

Every `/api` route is documented at `/_openapi.json` and browsable at `/_scalar`, in dev and on
every deploy. A route adds itself with `defineRouteMeta({ openAPI })` — literals only, since Nitro
reads it from source and silently drops an imported constant.

## 🚢 Deployment

GitHub Actions builds, Netlify hosts
([`netlify-deployment.yml`](../../.github/workflows/netlify-deployment.yml)). Netlify's own git
builds stay off.

| Trigger | Deploys |
| --- | --- |
| Push to `master` | Production, then warms the listing caches |
| Pull request | A preview, linked in one PR comment |
| Monday 05:00 UTC, or by hand | Production. Also the way to purge the CDN after an urgent fix |

- The `huella-legal` job is a required check, so it always reports and passes when
  [`netlify-ignore.sh`](./netlify-ignore.sh) finds nothing relevant changed. That list is kept by
  hand: a new runtime `@monorepo/*` import needs a line there.
- Never split the deploy into `netlify build` + `deploy --no-build`: the upload drops the image CDN
  config and every WordPress image breaks.
- `NETLIFY_SITE_ID` is a repo variable and `NETLIFY_AUTH_TOKEN` a secret. Fork and Dependabot PRs
  get neither and pass without a preview.

### 🔒 Staging login

`staging.huellalegal.com` and every `*.netlify.app` URL ask for Basic Auth; the public host doesn't.
[`modules/stagingGate.ts`](./modules/stagingGate.ts) writes a Netlify edge function on production
builds only. With `STAGING_USERNAME` or `STAGING_PASSWORD` unset, gated hosts answer `401`. A new
alias outside those two patterns stays open until it's added to `GATED_HOSTS`.

### 🗄 Rendering

Pages that read no query string are prerendered; the rest are cached by Netlify's CDN through `isr`
route rules. [0033](../../docs/decisions/0033-huella-legal-hybrid-prerender.md) has the reasoning.

| Route | Served as |
| --- | --- |
| Articles, WordPress pages, `/`, `/areas/`, `/colaboradores/`, `/contacto/`, `/publicar/`, `/sobre/`, `/calculo-intereses/` | Prerendered |
| Listings, `/buscar/`, `/feed/`, `GET /api/*` | `isr` for a day, varying on their query keys |
| `/api/articles/:slug/comments` | `isr` for ten minutes |
| Form routes, `/sitemap.xml` | Uncached function |

- Each layer declares its own rules under `rendering` in its `nuxt.config.ts`;
  [`modules/rendering.ts`](./modules/rendering.ts) turns them into route rules. Prerendering only
  happens when `NUXT_SITE_ENV` is set, so CI and e2e builds don't shadow the fakes.
- A WordPress outage fails the build and the previous deploy stays live. A runtime `5xx` is never
  cached ([`server/plugins/cdn.ts`](./server/plugins/cdn.ts)).
- Hydration is deferred to `load` or the first interaction
  ([`deferHydration.ts`](./server/plugins/deferHydration.ts)), and a click made before then is
  replayed. [0034](../../docs/decisions/0034-huella-legal-header-navigation.md) has the numbers.
- An icon rendered client-side first (inside `ClientOnly`, a lazy component, a client navigation)
  must be listed in the design layer's `icon.clientBundle.icons`. A miss shows in Netlify's log as
  `/api/_nuxt_icon/…`.

Reproduce a deploy build locally (it reads the live WordPress):

```sh
NUXT_SITE_ENV=preview pnpm exec nx build @monorepo/huella-legal --skip-nx-cache
```

### 🔐 Abuse and hardening

Every BFF route is public, so input is capped and checked first: each free-text field has a maximum
length in the browser and the route, forms carry a honeypot and a Turnstile token, and
[`nuxt.config.ts`](./nuxt.config.ts) sets the security headers and the `robots.txt` that turns away
AI crawlers. The Turnstile site key's hostname list in Cloudflare is what ties tokens to our
domains. Abusive IPs are blocked by hand in Netlify's firewall, never in the repo.

## 🔑 Environment

A variable a feature can't work without goes under `requiredEnv` in its layer's `nuxt.config.ts`.
A production build fails naming each unset one; `nuxt dev` warns; other builds ignore them. Every
variable is read at startup, except that prerendered pages bake in what the build had — so Netlify
must expose them to builds too.

| Variable | What it is |
| --- | --- |
| `NUXT_CONTENT_VENDOR_BASE_URL` | WordPress site root, with scheme, **without** `/wp-json` |
| `NUXT_SITE_ENV` | `production` or `preview` on deploys, unset elsewhere. Unset or `preview` means `noindex` |
| `NUXT_PUBLIC_SITE_URL` | Optional. Overrides the public origin used for permalinks and canonicals |
| `NUXT_PUBLIC_PAGE_SLUGS` | JSON array of WordPress page slugs served at `/:slug/`. Leave unset for the default |
| `NUXT_ARTICLES_HIDDEN_TERMS` | Optional. JSON array of category/tag slugs whose posts stay out of every listing |
| `STAGING_USERNAME`, `STAGING_PASSWORD` | The [staging login](#-staging-login). Needs Netlify's Functions scope |
| `NUXT_NEWSLETTER_API_KEY`, `_FORM_ID` | Kit API key and the form new readers join |
| `NUXT_NEWSLETTER_BASE_URL` | Optional. Kit API origin, **without** `/v4` |
| `NUXT_MAIL_API_KEY` | Resend API key for Contacto and Publicar |
| `NUXT_MAIL_BASE_URL`, `_FROM`, `_TO` | Optional. Resend origin, sender and Contacto's inbox |
| `NUXT_PUBLIC_SUBMISSION_EMAIL` | Optional. Publicar's editorial inbox |
| `NUXT_FORMS_SLOW_REPLIES_UNTIL` | Optional `YYYY-MM-DD`. Shows a "replies will be slow" notice on the forms until that day |
| `NUXT_COMMENTS_USERNAME`, `_APPLICATION_PASSWORD` | WordPress user that files comments. Needs Editor (`moderate_comments`) |
| `NUXT_TURNSTILE_SECRET_KEY`, `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile keys |
| `NUXT_PUBLIC_OBSERVABILITY_URL`, `_APP_ENVIRONMENT` | Faro collector. Unset, browser telemetry is off |
| `NUXT_OBSERVABILITY_URL`, `_INSTANCE_ID`, `_TOKEN` | Grafana OTLP gateway and credentials. Unset, server telemetry is off |
| `NUXT_PUBLIC_TRACKERS_GOOGLE_ANALYTICS_ID` | GA4 ID. Unset, no GA and no cookie banner |
| `NUXT_PUBLIC_SOCIAL_INSTAGRAM`, `_LINKEDIN`, `_X` | Footer profile links. Each unset one is hidden |

Public values that are the same everywhere (site URL, sender, inboxes) are literals in the
`nuxt.config.ts` of the layer that owns them; the matching `NUXT_` variable still overrides them.

## 🌍 i18n

Copy lives in [`i18n/locales/es-ES.json`](./i18n/locales/es-ES.json), handed straight to
`@nuxtjs/i18n` with no TMS (Tolgee's 500-key cap was outgrown). One locale, `no_prefix`, no browser
detection. Specs see keys, not copy: [`vitest.setup.ts`](./vitest.setup.ts) empties the messages.

### 🔤 Copy keys

| Rule | Example |
| --- | --- |
| First segment is the owner: `app` for the shell, a page, or a component in camelCase | `app.title`, `article.back`, `articleCard.readingTime` |
| Then element and role, camelCase, nested objects | `app.footer.links.publishThesis` |
| Name the role, never the wording | `article.back`, not `article.backToArticles` |
| Named params; plurals use vue-i18n's `\|` form | `"{page} de {total}"`, `t("articleCard.minutes", n)` |
| `common` only for copy that means the same everywhere | `common.loading` |
| Keys sorted alphabetically at every level | — |

## 📄 Content

Only the `articles` layer's server routes call `useContent`; every page reads those routes. The
routes map WordPress entries into view models, so neither the CMS URL nor raw HTML reaches the
browser. Listings, search suggestions and counts slice one cached index of every post (an hour in
production, five minutes in dev), so a new post can take a couple of hours plus the CDN's day to
list. The [module README](../../packages/content/src/nuxt/README.md) has the cache options.

### 🧼 The body pipeline

`toArticleBody` turns a post's HTML into markup safe for `v-html`, server-side.
[0027](../../docs/decisions/0027-huella-legal-content-model.md) has the corpus behind each rule.

| Step | What it does |
| --- | --- |
| Class map | WordPress classes → `hl-note`, `hl-quote`, `hl-quote-short`, `hl-callout`, `hl-highlight`. Everything else dropped |
| Sanitise | `rehype-sanitize`, GitHub schema, ids unprefixed |
| Notes | `#_ftnN` / `#_ftnrefN` links become `notes`; any other shape renders as written |
| Bibliography | Split off at the last *Bibliografía*, *Fuentes* or *Referencias* heading |
| TOC | Every `h2`/`h3` gets a unique ASCII id |
| Images | Lazy, and `/wp-content/` URLs repointed at `content.vendor.baseURL` |
| Lead | Up to the first paragraph; the featured image goes after it |

## 🧩 Structure

`app/` is the thin shell: layout, header, footer, error page and client plugins. Domain code lives
in Nuxt layers under [`layers/`](./layers), auto-registered (never add `extends`).

| Owner | Paths | May use |
| --- | --- | --- |
| Shell | The rest of `app/`, `server/`, `modules/` | Anything |
| Kit | `app/components/{base,listing}`, `app/{types,utils,composables}`, `i18n/` | The kit |
| Core | `layers/articles/` — owns all content reads | Itself, the kit |
| Capability | `layers/forms/`, `layers/design/` | Itself, the kit |
| Feature | Every other layer | Itself, kit, core, capabilities. Its pages may render another feature's components |

`eslint.layerBoundaries` in [`eslint.config.ts`](./eslint.config.ts) enforces the table, auto-imports
included.

| Layer | Holds |
| --- | --- |
| [`articles`](./layers/articles) | View models, WordPress mappers, every content route, the cached index, comments, sitemap and RSS |
| [`archive`](./layers/archive) | Home, the four listings, áreas, colaboradores and the about page |
| [`reading`](./layers/reading) | The article and WordPress-page views |
| [`search`](./layers/search) | `/buscar/` and the header's ⌘K palette |
| [`comments`](./layers/comments) | The thread and form under an article; posts to WordPress held for moderation |
| [`newsletter`](./layers/newsletter) | Kit signup, double opt-in |
| [`contact`](./layers/contact) | Contacto, sent through Resend |
| [`publish`](./layers/publish) | Publicar, with an optional draft attachment |
| [`interest`](./layers/interest) | The interest calculator at `/calculo-intereses/` ([README](./layers/interest/README.md)) |
| [`tracking`](./layers/tracking) | Consent banner and third-party scripts, loaded only when an ID is set |
| [`legacy`](./layers/legacy) | 301s from old WordPress URLs ([README](./layers/legacy/README.md)) |
| [`forms`](./layers/forms) | Honeypot, Turnstile, `assertForm`, `sendMail` |
| [`design`](./layers/design) | Tokens and the Nuxt UI theme ([DESIGN.md](./DESIGN.md)) |

### 🔗 Links

Components link by route name (`{ name: "article", params: { slug } }`), never by a built string.
A page sets its path in `definePageMeta`; `typedPages` fails typecheck on a wrong name.

| Name | Path |
| --- | --- |
| `index` | `/` |
| `publications` | `/publicaciones/` |
| `article` | `/:slug/` |
| `categories`, `category` | `/areas/`, `/areas/:slug/` |
| `tag` | `/etiquetas/:slug/` |
| `authors`, `author` | `/colaboradores/`, `/colaboradores/:slug/` |
| `search` | `/buscar/` |
| `about` | `/sobre/` |
| `contact` | `/contacto/` |
| `publish` | `/publicar/` |

## 📚 Storybook

Stories sit beside their component as `*.stories.ts`. It's plain `@storybook/vue3-vite` (the Nuxt
integration stops at Nuxt 3), so [`.storybook/`](./.storybook) wires Nuxt UI, fonts, i18n,
auto-imports and stubs for `NuxtImg` and `NuxtTurnstile` by hand. Its router repeats the
[route table](#-links) by hand too. The published copy lives on the developer portal.

## 📡 Observability

Both halves come from [`@monorepo/observability`](../../packages/observability/README.md) and are
off when their URL is unset.

- Browser: [`observability.client.ts`](./app/plugins/observability.client.ts) loads Faro on the
  first interaction or after ten seconds.
- Server: [`observability.ts`](./server/plugins/observability.ts) wraps the Nitro handler itself and
  names spans for the matched route, never the raw path. Off while prerendering.
- [`errorLog.ts`](./server/plugins/errorLog.ts) logs every handled `5xx` with its cause.
- Don't set `NUXT_PUBLIC_OBSERVABILITY_APP_VERSION` on Netlify; the build stamps the commit.

## ✅ Testing

| Project | Covers | Command |
| --- | --- | --- |
| `node` | `server/`, `shared/`, `modules/`, `tools/` in the app and each layer | `pnpm test` |
| `nuxt` | `app/` specs, one shared Nuxt environment | `pnpm test` |
| `nuxt-isolated` | `app/` specs that mock a module | `pnpm test` |
| e2e | Playwright, Chromium, at 390, 768 and 1280 px | `pnpm test:e2e` |

Configs wrap the presets in [`@monorepo/configs`](../../packages/configs/README.md); thresholds live
in [`vitest.config.ts`](./vitest.config.ts) and pages are left to Playwright.

### 🎭 e2e

- The built server runs with [`e2e/server.ts`](./e2e/server.ts) preloaded: MSW fakes WordPress (from
  `@monorepo/content/testing`), Kit and Turnstile in-process. Nothing reaches the network.
- Data is in [`e2e/fakes.ts`](./e2e/fakes.ts). A route the fakes don't serve is a change to the
  content package's `testing` entry.
- Every spec runs an axe scan. **No screenshot baselines** while the design still moves —
  [0037](../../docs/decisions/0037-huella-legal-e2e-and-visual-tooling.md) says when they return.
- Any console output, browser or server, fails the run. Import `test` from
  `@monorepo/configs/playwright/utils/test`.
- Bumping `@playwright/test` means moving the image tag in [`ci.yml`](../../.github/workflows/ci.yml)
  in the same PR. Pre-push doesn't run e2e.

## 🧭 Known gaps

| Gap | Note |
| --- | --- |
| A new post reaches `/` only on the next build | WordPress has no webhooks ([0030](../../docs/decisions/0030-huella-legal-rendering-hosting-and-cost.md)) |
| `hl-quote`, `hl-callout` and friends render unstyled | No design covers them yet |
| Netlify image CDN answers `max-age=0` | Fix is on WordPress's side (LiteSpeed browser cache) |
| No `script-src` CSP | `isr`-cached HTML rules out nonces |
| `staging.` serves the production deploy | The login hides nothing `www` doesn't show |
