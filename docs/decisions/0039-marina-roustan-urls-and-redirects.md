---
issue: 446
status: to-implement
decision: accepted
---

# 🧭 Marina Roustan's URLs and redirects

## Context

A rebuild has to answer every URL the old site answers, or say what it becomes. Huella only
redirected its renamed URLs inside the cutover PR (#188, #251), so this inventory is fixed before any
route is built. The method is [0028](./0028-huella-legal-urls-and-cutover.md): the sitemap
checked against the REST API, `noindex` items included.

## Result

The live site was probed on 15 Nov 2026. Yoast's sitemap index lists 19 URLs, and the REST API
agrees: 10 posts, 7 pages, the `uncategorized` category archive and one author archive. Nothing is
`noindex`, so nothing hides outside the sitemap. The apex is canonical, `www` 301s to it, every
permalink ends in a slash, and a path without one 301s to it.

**Posts and pages keep their URLs.** Posts sit at the root as `/<slug>/`, and no post slug collides
with a page or a new route. The 10 citable post URLs and the four kept pages need no redirect.

| Old URL | Becomes | How |
| --- | --- | --- |
| `/`, `/servicios/`, `/aviso-legal/`, `/libro-cancer/`, `/contacto/`, `/blog/` | The same path | Routes |
| `/<post-slug>/` × 10 | The same path | The blog's post route |
| `/testarea/` | 301 to `/` | A copy of the home page, public by mistake |
| `/category/uncategorized/` | 301 to `/blog/` | The only category is the default one |
| `/author/marina-roustan/` | 301 to `/blog/` | One author; the listing is the archive |
| `/feed/`, `/<post-slug>/feed/` | 301 to `/blog/` | No feed is rebuilt for ten posts |
| `/wp-content/uploads/…` | 301 to the media's new path | The home page links the CV PDF there, and outside links may too |
| `/wp-admin/…`, `/wp-login.php`, `/wp-json/…`, `/xmlrpc.php` | 410 | WordPress is retired, so nothing proxies to it |

| Change | Where | What |
| --- | --- | --- |
| 1 | `apps/marina-roustan/layers/legacy/`, copying `apps/huella-legal/layers/legacy` | The rules above, served from Netlify's `_redirects` |
| 2 | `apps/marina-roustan/e2e/legacy.spec.ts`, copying Huella's | One URL per row, on the preview deploy |

## Options considered

| Option | Why not |
| --- | --- |
| Move posts under `/blog/<slug>/` | Ten citable URLs would need redirects for no reader-facing gain |
| Proxy `/wp-content/…` to WordPress, as Huella's legacy layer does | WordPress is retired after launch, so the proxy would point at nothing |
| Keep the RSS feed | Ten posts, the last from 2024; a feed nobody reads is a route to maintain |

## Consequences

The new routes are fixed now, so the blog's post route and the page template both serve root
slugs, and a new page must not take a post's slug. The redirects land with the legacy layer before
the cutover, not inside it. The media's new path is set by the export in
[0038](./0038-marina-roustan-content-model.md), and the uploads rule waits on it.

## Confirmation

| Claim | Check |
| --- | --- |
| Every sitemap URL answers | The e2e spec requests all 19 old URLs on the preview deploy and gets 200 or the 301 in the table |
| No post URL changes | The 10 post slugs in `apps/marina-roustan/content` match the old sitemap |
