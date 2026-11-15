---
issue: 446
status: to-implement
decision: accepted
---

# 🧭 Marina Roustan's content model

## Context

The Marina Roustan rebuild moves the site's content out of WordPress into Markdown, since the
project switches `content-migration` on. Before anything is drawn, the content audit has to say
what the live site really holds and where each piece a design needs comes from. That includes
which pages the Oxygen builder composes and which are plain WordPress content.

## Result

The live REST API was probed unauthenticated on 15 Nov 2026: 10 posts, 7 pages, 1 category
(`uncategorized`, all 10 posts), no tags, no comments, 2 users and about 80 media items: 48 PNG,
30 JPEG and 2 PDF. Nine posts date from May 2020 and one from June 2024. Three are in English, and
there is no translation layer.

| Design need | Source | Real counts |
| --- | --- | --- |
| Post body | `content.rendered`, plain HTML | 10 of 10; no `<img>`, table, iframe, footnote or shortcode in any body; one has Gutenberg block classes |
| Post length | Body word count | 156 to 3,197 words, median 233; seven are under 300 |
| Featured image | `featured_media` | 9 of 10 |
| Excerpt | WordPress's auto excerpt | 10 of 10 auto; none hand-written |
| SEO description | Yoast `yoast_head_json.description` | 9 of 10; none `noindex` |
| Author | User `marina-roustan`, with a bio | 10 of 10; the second user has no posts |
| Category, tags | None in use | The single `uncategorized` category only |
| Page body | `content.rendered` | Matches the live text for `aviso-legal`, `servicios` and `libro-cancer` (100% of the REST words appear on the live page) |
| Home copy | The live Oxygen layout only | REST holds an older version: only 62% of its words appear on the live home |
| Contacto copy | The live Oxygen layout only | REST body is empty |
| Testimonials | The live home page, three named quotes | Not in REST |

**Builder-composed pages are told apart from plain ones by that comparison.** Oxygen draws every
page's shell and the whole of `/`, `/contacto/` and `/blog/`. The three content pages keep their
real copy in WordPress, so the export reads them from REST. The home and contact copy, and the
testimonials, are written into the app from the live pages.

| Change | Where | What |
| --- | --- | --- |
| 1 | `apps/marina-roustan/content/` | One Markdown file per post and per Standard-template page, frontmatter `title`, `slug`, `date`, `description`, `image` |
| 2 | The export script, under `infrastructure/scripts` per the `scripts-new-script` skill | Reads posts and the three pages from REST, writes change 1 and copies their media; re-runs in one command |
| 3 | The home and contact pages' own components | Copy taken from the live page, not REST |

## Options considered

| Option | Why not |
| --- | --- |
| Keep WordPress as a headless source, as Huella does | Ten posts with no edits since 2024 don't justify a CMS host, its credentials and a cache layer |
| Export the home page from REST like the others | Its REST body is an older draft; a third of the live copy would be lost |
| Recreate Oxygen's layout markup in Markdown | Oxygen's markup is a layout, not content; the design replaces it |

## Consequences

Content becomes files in the repo, so a post edit is a commit and WordPress can be retired after
launch. The order is the export first, since the content source and the test fixtures both read its
output. A late edit on the old site is one re-run of the export, until the cutover freezes it. The
English posts stay untranslated, and switching `i18n` on later would revisit that.

## Confirmation

| Claim | Check |
| --- | --- |
| Every post and Standard page is exported | `ls apps/marina-roustan/content` counts 10 posts and 3 pages |
| No home or contact copy comes from REST | The export's page list names only `aviso-legal`, `servicios` and `libro-cancer` |
| Featured images survive | An e2e spec opens a post with a featured image on the preview deploy |
