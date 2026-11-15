---
issue: 446
status: to-implement
decision: accepted
---

# 🧭 Marina Roustan's hosting and rendering

## Context

Huella's hosting was decided on paper and then superseded twice: Google Cloud, Netlify, Cloudflare
Workers, then Netlify again (#186, #244, #377). The hosting prototype asks for measured cold and
warm time to first byte from the readers' region, before any deploy work. The method is
[0033](./0033-huella-legal-hybrid-prerender.md).

## Result

**Netlify, with every page prerendered.** The site has 6 kept pages plus 10 posts, its content is
Markdown in the repo ([0038](./0038-marina-roustan-content-model.md)), and nothing on it changes
per request: the only server code is the contact route. A full static build covers every page,
and Netlify runs the contact route as a function.

Time to first byte was measured from the owner's development machine on 15 Nov 2026, three
requests each:

| Site | Host | Cold | Warm |
| --- | --- | --- | --- |
| Huella Legal's home, prerendered | Netlify | 0.30–0.42 s | 0.18–0.31 s |
| The live Marina Roustan home | LiteSpeed, `no-cache` | 0.46–1.23 s | — |

The prototype is Huella's production home page rather than a new hello-world. It runs on the same
host and the same prerendered output that this site would use, so its figures stand for this site's
without a throwaway Netlify site.

| Change | Where | What |
| --- | --- | --- |
| 1 | `apps/marina-roustan/nuxt.config.ts`, `nitro.prerender` | Crawl every route, as Huella prerenders `/` |
| 2 | `apps/marina-roustan/netlify-ignore.sh`, copying Huella's | Build only when the app is affected |
| 3 | The Netlify site | Created by the owner in `ci-deploy`, with the env vars from [0041](./0041-marina-roustan-forms-and-integrations.md) |

## Options considered

| Option | Why not |
| --- | --- |
| Huella's hybrid of prerender and cached server rendering | It exists for a WordPress source with hundreds of posts; Markdown in the repo rebuilds in one build |
| Cloudflare Workers | Huella moved there and back within days (#377); a second host means a second deploy setup |
| Staying on the LiteSpeed host | It serves WordPress; uncached responses take up to 1.2 s |
| A new hello-world on Netlify | It would measure the same CDN as Huella's live site, at the cost of a site to delete |

## Consequences

Deploy work copies Huella's Netlify setup. A post edit reaches readers on the next build, which a
merge to `master` triggers. Revisit this if the site gains content that changes per request, such
as a booking calendar, or enough posts for the build to slow down.

## Confirmation

| Claim | Check |
| --- | --- |
| Every page is static | The build output holds an HTML file for each of the 16 routes |
| First byte holds on the real site | The same three-request measurement against the preview deploy, recorded in the `ci-deploy` PR |
