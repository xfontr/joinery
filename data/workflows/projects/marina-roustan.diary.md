# 📓 Marina Roustan diary

What in the workflow worked and what went wrong. The format and when to write are in
[the workflows README](../../../docs/workflows/README.md#diary).

- 2026-11-15 · map · #447 · design-tokens writes the app's DESIGN.md and eslint config, but the map doesn't make it depend on app-scaffold (#448)
- 2026-11-15 · friction · #446 · guard-live.sh blocks every /wp-json request, so the discovery spike couldn't probe the old site; its block was commented out on the owner's word
- 2026-11-15 · worked · #446 · One read-only probe script mapped the old site in about a minute: 7 pages, 10 posts, 19 sitemap URLs
- 2026-11-15 · rule · #446 · One decision report per spike block made 5 reports for a 17-URL site; the owner kept one discovery report and dropped the rest
- 2026-11-15 · estimate · #446 · 19 SP, about 55 min from pick to merge, most of it writing five reports and folding them into one
- 2026-11-15 · map · #444 · `page-template` was one block per page, while the owner builds one template per layout; fixed in #444, before the diary started
- 2026-11-15 · rule · #446 · Decide-before-you-file held back 22 of 25 tickets until #446 closed; the owner expected the whole map filed
- 2026-11-15 · friction · Settling `scope-signoff` meant hand-editing the project file, and the owner sees no point in a ticket for a decision; a settle control was added to the project page
- 2026-11-15 · friction · The snapshot stayed stale after #451 merged and `master` was checked out; `workflow:sync` now runs from the post-checkout and post-merge hooks
- 2026-11-15 · friction · `workflow:sync` exits 1 on every run because `huella-legal-editorial` has no milestone on GitHub
- 2026-11-15 · friction · The portal's sidebar submenus only unfolded from their arrow, which the owner reported as broken; an entry now unfolds on click
- 2026-11-15 · worked · `scope-signoff` settled from the project page with no ticket, the settle control's first real use
- 2026-11-15 · estimate · #448 · 18 SP, about 1 h 55 min from pick to merge through /ship-issue, 57 min of it with the PR open
- 2026-11-15 · friction · #465 · Filing the next wave in a loop filed the `design-approval` owner ticket, though the owner settles decisions from the page; closed as not planned
- 2026-11-15 · friction · #460 · The lab took three rounds where the map expects one; the first two were rejected outright as copies of the live site, with decorative shapes and content the lab invented
- 2026-11-15 · map · #460 · No block asks up front whether a rebuild is a straight copy or a full redesign; the lab assumed "similar to the live site", which cost the two rejected rounds
- 2026-11-15 · map · #447 · `design-tokens` and `brand-extraction` come before `design-lab`, so tokens taken from the live site anchored every lab direction to it; the lab should pick the direction and the tokens follow
- 2026-11-15 · map · #447 · `brand-extraction` was over-built: a whole extraction script for a few colours and a font, from a site with no design system to learn from
