---
issue: 446
status: to-implement
decision: accepted
---

# 🧭 Marina Roustan's feature inventory

## Context

Huella found comments, its about page, the subscription-confirmed page and hidden categories late,
some after launch (#324, #328, #400, #392). This inventory lists every surface of the old site
before the design starts, marks each keep, drop or replace, and maps each kept one to a block of
[the project's map](../../data/workflows/projects/marina-roustan.yaml).

## Result

Every page and every repeated element of the live site was read on 15 Nov 2026. The owner decided
each row on the same day.

| Surface | Today | Verdict | Block |
| --- | --- | --- | --- |
| Home | Oxygen layout: hero, three service teasers, a quote, six topics, three testimonials, the contact form | Keep, copy in code | `home-page` |
| Servicios | Eight service sections, real copy in WordPress | Keep | `standard-page` |
| Aviso legal | Legal notice and privacy policy, real copy in WordPress | Keep | `standard-page` |
| Libro cáncer | A book page, real copy in WordPress | Keep | `standard-page` |
| Contacto | Fluent Form 4 and contact details | Replace the form | `contact-form` |
| Blog | `/blog/` lists all 10 posts with excerpts | Keep | `articulos-page` |
| Post page | Body, author, featured image | Keep | `articulos-page` |
| Testarea | A public copy of the home page | Drop, 301 to `/` | `legacy-redirects` |
| Category and author archives | One of each | Drop, 301 to `/blog/` | `legacy-redirects` |
| RSS feed | `/feed/` | Drop, 301 to `/blog/` | `legacy-redirects` |
| Header | Logo, phone number, a four-item menu: Inicio, Servicios, Publicaciones, Contacto | Keep | `navigation-shell` |
| Footer | "Hora de trabajar en tus problemas" call to action, contact block, legal link | Keep | `navigation-shell` |
| WhatsApp button | A `wa.me` link with prefilled text, on every page | Keep as a plain link | `navigation-shell` |
| CV link | A PDF in WordPress uploads, linked from the home page | Keep | `content-migration` |
| Search | None today | Add | `search` |
| Analytics and cookie banner | None today | Not added for now | `consent-analytics`, switched off |

**One page template serves every content page.** `servicios`, `aviso-legal` and `libro-cancer` are
plain WordPress pages on one layout, so they are the `standard-page` extra. The home and contact
pages are built in code by their own blocks, and no page needs a `custom-page`.

| Change | Where | What |
| --- | --- | --- |
| 1 | `data/workflows/projects/marina-roustan.yaml`, `standard-page` | Its `summary` names the three pages |
| 2 | Same file, `switches` | `consent-analytics: false` |

## Options considered

| Option | Why not |
| --- | --- |
| A second page template for Servicios | Its eight sections are headings and paragraphs, which the Standard layout already renders |
| Contacto as a `custom-page` | `contact-form` already builds the page around the form, as Huella's `layers/contact` does |
| Rebuild the testimonials as content entries | Three fixed quotes; copy in the home component is cheaper to change than a collection |

## Consequences

The map now matches the site: one page template, one blog, the home page and the contact form.
Search is new on this site, so its design has nothing live to copy. Switching analytics back on
later brings back the consent banner work and a provider row in
[0041](./0041-marina-roustan-forms-and-integrations.md).

## Confirmation

| Claim | Check |
| --- | --- |
| Every kept surface has a block | `pnpm workflow:next marina-roustan` lists or will file a ticket for each block in the table |
| No page was missed | The 19 sitemap URLs in [0039](./0039-marina-roustan-urls-and-redirects.md) each map to a row here |
