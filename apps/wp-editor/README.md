# 🤖 @joinery/wp-editor

Local tool to review and apply bulk edits to WordPress posts, with backups.

Runs on `127.0.0.1` only and **never deploys**.

## Structure

| Path | Holds |
| --- | --- |
| [`shared/`](./shared) | The pure rules, types and the HTML diff, imported by `app/`, `server/` and `tools/` alike |
| [`server/adapters/`](./server/adapters) | The fs store and the WordPress REST client, plain Node with no Nitro globals |
| [`server/services/operations.ts`](./server/services/operations.ts) | Open, apply, bulk apply, restore, restore all, re-pull: the rules run against both adapters |
| [`server/plugins/storeLock.ts`](./server/plugins/storeLock.ts) | Claims the store at server start, so only one server writes to it |
| [`server/api/`](./server/api) | Thin routes over the operations; a broken rule comes back as a 409 with its reason |
| [`tools/cli/`](./tools/cli) | `pnpm editor`, which imports the same adapters and operations |
| [`app/`](./app) | Registry, review screen and settings, on Nuxt UI |

The CLI imports from `server/`, never the reverse (lint forbids `app/` and `server/` importing `tools/`).

## Development

| Command | What it does |
| --- | --- |
| `pnpm dev` | The review app on `http://127.0.0.1:3100`, against the [fake WordPress and store](#dev-mocks) |
| `pnpm dev:api` | The same against the real WordPress and `NUXT_EDITOR_STORE` from `.env` |
| `pnpm mocks:reset` | Drops the mock state, so the next start begins from the fixtures again; `pnpm dev` runs it first |
| `pnpm editor new "<title>" [--instructions=…] [--override] [--ids=posts-12,…]` | Opens a changeset and pulls `base` for every published post and page, or only `--ids` (drafts allowed) |
| `pnpm editor todo [--limit=15]` | The next unscanned base files of the open changeset |
| `pnpm editor scanned <keys…>` | Marks keys processed, with or without a proposal |
| `pnpm editor validate` | Deletes no-op proposals and warns where the `<!-- wp:… -->` marker sequence changed |
| `pnpm editor status` | Counts per state, per changeset |
| `pnpm editor probe` | Step 0 below; creates and force-deletes one draft |
| `pnpm editor:dev <command>` | Any of the above against the mocks, never the live site |
| `pnpm exec nx nuxt-prepare @joinery/wp-editor` | Generates `.nuxt/`, which `tsconfig.json` points into; `lint`, `typecheck`, `test` and `build` depend on it |

### Dev mocks

`pnpm dev` and `editor:dev` preload [`mocks/server.ts`](./mocks/server.ts), which overrides the env
and fakes WordPress with MSW. Nothing reaches the network.

| Fixture | Holds |
| --- | --- |
| [`mocks/wordpress.json`](./mocks/wordpress.json) | Six posts and one page, in the state the two changesets left them |
| [`mocks/store/`](./mocks/store) | `0001-ortografia`, closed: two applied, one rejected. `0002-limpiar-encabezados`, open: a confirmed, a seen and two unreviewed proposals, one with a dropped block for `validate`, and `posts-105`, which drifts on apply because WordPress moved after the pull |

Writes go to a copy in the gitignored `.data/mocks/`. The two fixtures must agree on content and
`modified_gmt` for every article but `posts-105`, so edit them together.

Claude's batch loop is the [`wp-bulk-edit` skill](../../.claude/skills/wp-bulk-edit/SKILL.md).
Claude never drives the UI.

## Environment

| Var | Why |
| --- | --- |
| `NUXT_WORDPRESS_BASE_URL` | The WordPress site root, with scheme and **without** `/wp-json` |
| `NUXT_WORDPRESS_USERNAME` | The account the Application Password belongs to |
| `NUXT_WORDPRESS_APPLICATION_PASSWORD` | A **new** one, never the comments password; the account needs `edit_others_posts`, `edit_published_posts`, `edit_pages` and `unfiltered_html` |
| `NUXT_EDITOR_STORE` | Absolute path to the store, outside the repo |

Checked when used, never at build. Give Claude access to the store through `additionalDirectories`
in the gitignored `.claude/settings.local.json`.

## The store

```
settings.json                   reviewGate, bulkApplyMinLevel, requireDryRun, dryRun, pauseMs
.server.lock                    pid and start time of the server using the store
changesets/0001-ortografia/
    changeset.json              id, title, instructions, createdAt, status, keys, scanned
    base/posts-123.html         content.raw at pull time
    base/posts-123.json         title, excerpt, modifiedGmt, date, author, image, link, status
    proposed/posts-123.html     absent means no change
    proposed/posts-123.json     optional { title?, excerpt?, reviewRequested? }
    state/posts-123.json        level, rejected, drift, applied { at, modifiedGmt }, restored
    runs/<at>-apply.json        one per bulk run: ok, refused, failed, warnings, stopped, incomplete
    runs/<at>-restore.json      the same, for Restore all
    runs/<at>-dry-run.json      the same, plus the fingerprint of every article it cleared
```

JSON is written with sorted keys so the store can be a git repo; the tool never runs git. Only
`title.raw`, `excerpt.raw` and `content.raw` are edited — writing `rendered` back breaks the blocks.

## Rules

All of them live in [`shared/rules.ts`](./shared/rules.ts) and are pinned by its spec.

| Rule | Consequence |
| --- | --- |
| One open changeset | `new` is refused while one is open; `--override` marks it `abandoned`, keeping its applied items restorable |
| Open until done | A changeset closes once every key is scanned and every proposal is applied or rejected |
| Review levels | `unreviewed` → `seen` on open → `confirmed`; a hand edit or Unconfirm drops back to `seen`, and a reject can be undone unless it would leave two changesets open |
| Bulk apply gate | `reviewGate` picks who must reach `bulkApplyMinLevel` first: `all` pending articles, only the `requested` ones, or `none`. The screen says how many fall short |
| Review requested | The change-maker sets `reviewRequested` in `proposed/<key>.json` with the reason; the UI flags it and can't remove it |
| Dry-run mode | `dryRun` refuses every WordPress write; Apply checks drift and block markers instead, and Restore is disabled |
| Mandatory dry run | `requireDryRun` keeps bulk apply shut until the last dry run finished and cleared every pending article; an edit, re-pull or restore after it invalidates that article |
| Bulk reports | Saved as the run goes; a WordPress error marks that article `failed` and continues |
| Repeated failures | Three in a row stop the run |
| Pause | `pauseMs` (0–2000, default 500) between articles in a bulk run |
| Drift | Every write compares live `modified_gmt` with `base`; a mismatch refuses the item and flags it for re-pull |
| Restore | Writes N's `base` back; blocked while a later changeset still has the article applied. Refused if WordPress moved since the tool's last write. The article goes back to `seen` |
| Restore all | Restores every applied article, like a bulk apply in reverse |
| Lost response | If WordPress saved a write but the connection dropped, the next apply or restore records it instead of calling it drift |
| One server | The first server locks the store (`.server.lock`); a second shows only an error. A dead pid's lock is taken over. The CLI takes no lock |

## Step 0

`pnpm editor probe` checks what the tool assumes about the site: block vs classic markup, revisions,
whether a draft keeps custom classes and `<style>`, and that `modified_gmt` moves on `PUT`.

**Not yet run against the live site.** The output goes here once it has been.

## Known caveats

- **Custom CSS may not survive.** WordPress strips `<style>` without `unfiltered_html`, and Huella
  Legal's sanitizer strips `<style>` and unknown classes.
- **LiteSpeed** is expected to purge its cache on save. Verify it once on the first real apply.

## Boundaries

`type:app`, `scope:internal`; depends on `@joinery/configs` only. It has its own WordPress client
because `@joinery/content` is read-only and anonymous.
