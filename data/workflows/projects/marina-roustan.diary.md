# 📓 Marina Roustan diary

What the snapshot and the commits can't record. The format and when to write are in
[the workflows README](../../../docs/workflows/README.md#-diary).

- 2026-11-15 14:16 · start · Three tickets filed: #446, #447, #448
- 2026-11-15 14:26 · map · #447 · design-tokens writes the app's DESIGN.md and eslint config, but the map doesn't make it depend on app-scaffold (#448)
- 2026-11-15 14:33 · friction · #446 · guard-live.sh blocks every /wp-json request, so a discovery spike can't probe the old site; its block was commented out on the owner's word
- 2026-11-15 14:33 · note · #446 · The probe took one read-only script and about a minute: 7 pages, 10 posts, 19 sitemap URLs
- 2026-11-15 14:46 · rule · #446 · Writing one decision report per spike block made 5 reports for a 17-URL site; the owner kept one discovery report and dropped the rest, Netlify's included since it was already chosen
- 2026-11-15 15:24 · estimate · #446 · 19 SP, about 55 min from pick to merge: the probe took a minute, most of the rest went to writing five reports and folding them into one
- 2026-11-15 15:36 · map · #444 · Before the diary started: `page-template` was one block per page, while the owner builds one template per layout and a page on it is a slug; fixed in #444
- 2026-11-15 15:36 · rule · #446 · Filing created 3 of 25 tickets; the owner expected the whole map, and decide-before-you-file held the rest back until #446 closed
- 2026-11-15 15:36 · friction · Settling `scope-signoff` meant hand-editing the project file, and the owner sees no point in a ticket for a decision; a settle control was added to the project page
- 2026-11-15 15:36 · friction · The snapshot stayed stale after #451 merged and `master` was checked out; `workflow:sync` now runs from the post-checkout and post-merge hooks
- 2026-11-15 16:20 · friction · `workflow:sync` exits 1 on every run because `huella-legal-editorial` has no milestone on GitHub; the other projects still sync first
- 2026-11-15 16:27 · friction · The portal's sidebar submenus only unfolded from their arrow, which the owner reported as not working (it worked in headless Chromium); an entry now unfolds on click, and only one stays open
- 2026-11-15 16:28 · note · `scope-signoff` settled from the project page with no ticket, the settle control's first real use
