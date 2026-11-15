---
issue: 446
status: to-implement
decision: accepted
---

# 🧭 Marina Roustan's discovery

## Context

The Marina Roustan rebuild moves a small WordPress site, built with Oxygen, to a Nuxt app whose
content is Markdown in the repo. Before design or build starts, the discovery spike says what the
live site holds, what each URL becomes, which surfaces stay, and which provider replaces each
integration. Hosting is Netlify, as for Huella Legal.

## Result

The live site was probed on 15 Nov 2026: 10 posts (9 from 2020, 3 in English), 7 pages, one
category, no tags or comments, about 80 media items. Its plugins are Oxygen, Fluent Forms,
Akismet, Yoast and LiteSpeed's cache. No page loads a script from another host.

**Content.** Posts and the `aviso-legal`, `servicios` and `libro-cancer` pages export from REST,
whose text matches the live pages. The home page's REST body is an older draft (62% of its words
are on the live page) and Contacto's is empty, so their copy and the three testimonials are
written into the app from the live pages. Nine posts have a featured image and a Yoast
description; no body holds an image, table, embed or shortcode.

| Old URL | Becomes |
| --- | --- |
| `/`, `/servicios/`, `/aviso-legal/`, `/libro-cancer/`, `/contacto/`, `/blog/`, the 10 `/<post-slug>/` | The same path |
| `/testarea/`, a public copy of the home page | 301 to `/` |
| `/category/uncategorized/`, `/author/marina-roustan/`, `/feed/` | 301 to `/blog/` |
| `/wp-content/uploads/…` | 301 to the media's new path |
| `/wp-admin/…`, `/wp-login.php`, `/wp-json/…`, `/xmlrpc.php` | 410 |

| Surface | Block |
| --- | --- |
| Servicios, aviso legal, libro cáncer | `standard-page`, the one page template |
| Home, with its testimonials and form | `home-page` |
| Contacto: name, email, phone, message and consent, sent through Resend behind a honeypot and Turnstile | `contact-form`, copying `apps/huella-legal/layers/contact` and `layers/forms` |
| Blog listing and post page | `articulos-page` |
| Header, footer, WhatsApp and phone links | `navigation-shell` |
| Search, new on this site | `search` |
| Analytics and consent banner, absent today | Switched off |

| Change | Where | What |
| --- | --- | --- |
| 1 | `apps/marina-roustan/content/` | One Markdown file per post and Standard page, with `title`, `slug`, `date`, `description`, `image` |
| 2 | An export script under `infrastructure/scripts`, per the `scripts-new-script` skill | Writes change 1 and copies the media; re-runs in one command |
| 3 | `apps/marina-roustan/layers/legacy/`, copying Huella's | The redirects above, in Netlify's `_redirects` |
| 4 | `apps/marina-roustan/nuxt.config.ts`, `nitro.prerender` | Every route prerendered |

## Options considered

| Option | Why not |
| --- | --- |
| WordPress as a headless source, as Huella | Ten posts with no edit since 2024 don't justify a CMS host and its credentials |
| Posts under `/blog/<slug>/` | Ten citable URLs would need redirects for nothing |
| A `mailto:` instead of the form | The form is how patients ask for an appointment |

## Consequences

WordPress can be retired after launch, so no route proxies to it. The export goes first, since the
content source and the test fixtures read its output. Switching analytics on later brings a
provider choice and the consent banner.

## Confirmation

| Claim | Check |
| --- | --- |
| Every post and Standard page is exported | `apps/marina-roustan/content` holds 10 posts and 3 pages |
| Every old URL answers | An e2e spec requests the 19 sitemap URLs on the preview deploy and gets 200 or the redirect above |
