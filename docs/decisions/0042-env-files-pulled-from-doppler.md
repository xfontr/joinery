---
issue: 489
status: to-implement
decision: accepted
---

# 🧭 `.env` values live in Doppler and are pulled after a browser login

## Context

Every app's `.env` exists only on the laptop that wrote it. `huella-legal`, `wp-editor` and
`marina-roustan` each have a `.env.example`, which `.gitignore:31-33` keeps in git while ignoring
the `.env` beside it. `developer-portal` has a `.env` with no example. A new machine, a wiped disk
or a fresh worktree can rebuild the layout with
[`pnpm env:sync`](../../infrastructure/scripts/src/env-sync/README.md), but not the values. Nothing
backs them up.

The wanted flow is the one the owner already has at work: log in with your own account in the
browser, run one command, and get every `.env`. No key file to remember, keep or ignore, because
then that file is the new thing that only exists on one laptop.

## Result

**Doppler holds the values, and one project, `monorepo`, has one config per app.** `doppler login`
opens the browser and keeps its session token in the macOS Keychain. `pnpm env:pull` overwrites each
`.env` with its config's download.

**`.env` becomes a generated file and env-sync is retired.** env-sync existed to protect a
hand-kept `.env`: keep it in the example's order and comments, and never lose a value. Once Doppler
is the source of truth, nothing in a local `.env` is worth protecting, and its layout doesn't
matter. Changes go through `pnpm env:push` or the Doppler UI.

**`.env.example` stays as the contract.** It's the only record in git of which variables the code
reads, so a PR that adds one shows it, and it's the list to set in Netlify. The repo rule (CLAUDE.md,
"`.env.example` documents the names and nothing else") stands. `pull` enforces it: every key the
example sets must exist in Doppler.

| Change | Where | What |
| --- | --- | --- |
| 1 | `infrastructure/scripts/src/env-secrets/adapters/doppler.ts` | Spawn `doppler` with explicit `-p monorepo -c <app>`, moving data through pipes only. Check the CLI is installed and `doppler me` succeeds first. Otherwise throw `ExpectedError` naming `doppler login` |
| 2 | `infrastructure/scripts/src/env-secrets/domain/` | Move `parseEnv()` from `env-sync/domain/envFile.ts:63`, used here only to list keys. Add a function returning the example's keys that are missing from a download. Map each app (folder name = config name) from the `.env.example` paths |
| 3 | `infrastructure/scripts/src/env-secrets/adapters/files.ts` | Move `examplePaths()` and `writeEnv()` from `env-sync/adapters/files.ts:16`, `:45` (git-tracked examples; mode 600, backup, rename) |
| 4 | `infrastructure/scripts/src/env-secrets/main.ts` `pull [app] [--check]` | Run `doppler secrets download --no-file --format env` into memory. Fail naming any example key Doppler lacks. Otherwise `writeEnv()` the download as is. `--check` writes nothing and exits 1 on missing keys |
| 5 | Same file, `push <app>` | Run `doppler secrets upload apps/<app>/.env -p monorepo -c <app> --silent`. Print key names only |
| 6 | `infrastructure/scripts/src/env-secrets/index.ts`, `README.md` | `await run(main)` as in `env-sync/index.ts`. The README replaces env-sync's |
| 7 | `infrastructure/scripts/src/env-sync/` | Delete the folder, specs included |
| 8 | `package.json:32`, `infrastructure/scripts/package.json:21` | Replace `env:sync` with `env:pull` and `env:push`, in the same `pnpm --silent … cli …` shape |
| 9 | `package.json:12` | `quick-start` runs `pnpm env:pull` where it ran `pnpm env:sync` |
| 10 | `.husky/pre-commit:35-40` | When a `.env.example` is staged, run `pnpm env:pull --check` instead of `env:sync`. It still only reports, as the comment on line 35 says |
| 11 | `.husky/post-checkout:32`, `.husky/post-merge:28` | Delete the `env:sync` lines. A checkout shouldn't need the network, and `pull` is run by hand |
| 12 | `README.md:105`, `:118`, `:154` | Setup becomes `brew install dopplerhq/cli/doppler`, `doppler login`, `pnpm quick-start`. Line 154 says to add a new key to Doppler with the `.env.example` change, then `pnpm env:pull` |
| 13 | `infrastructure/scripts/README.md:31`, `docs/guides/change-lifecycle.md:19` | Point the env-sync row and the pre-commit description at `env-secrets` |
| 14 | `apps/developer-portal/.env.example` | Add one, keys only, so the portal is covered like the rest |

Line numbers are as of this report.

## Options considered

| Option | Why not |
| --- | --- |
| Keep env-sync and merge the download into the example's layout | Protects a file nobody edits anymore. Its merge, comment handling and lost-data guard are most of its code |
| Drop `.env.example` too, leaving Doppler as the only list | A new variable would leave no trace in the PR that needs it, and nothing in git would say what Netlify must have |
| GCP Secret Manager, as `make fetch-env` does at work | Needs a personal project with a card linked even at €0. Local `gcloud` currently fails to start on Python 3.9. Every call has to pin a personal configuration so it can never touch the work account |
| SOPS + age, with encrypted `.env.enc` committed | The age private key is a file to keep and back up, which is the problem being solved. The repo is public, so one leaked key would expose every past version in git history |
| Cloudflare Secrets Store, `wrangler secret` | Values can't be read back. Only a Worker running on Cloudflare can use them |
| Cloudflare Workers KV | Readable, but not built for secrets: any token with KV read access sees every value, and nothing is versioned |
| Netlify site env vars | Values flagged secret can't be read back, and `wp-editor` has no Netlify site |
| Infisical, Bitwarden Secrets Manager | The same flow as Doppler with no advantage here. Bitwarden's CLI authenticates with an access token, which is a key file again |

## Consequences

- **Unlocks** a one-command rebuild on any machine or worktree (`doppler login`, `pnpm quick-start`)
  and a history of every value change in Doppler's UI.
- **Forecloses** editing a `.env` by hand and keeping it: the next `pull` overwrites it. `writeEnv()`
  still leaves a backup.
- **Deploys don't change.** Netlify keeps its own env vars, and CI gets no Doppler token. Using
  Doppler for deploys would be a new report.
- **Reopens if** Doppler's free plan stops covering one person and four configs, or if a second
  person needs access. Leaving means one `doppler secrets download` per app.

**Order:** 1–6, then seed Doppler by running `pnpm env:push <app>` for every app from today's
`.env` files, which still exist. Then 7–14. Deleting env-sync (7) or switching `quick-start` (9)
before Doppler is seeded leaves no way to rebuild a `.env`.

**Tripwires:**

- `doppler secrets download` adds `DOPPLER_PROJECT`, `DOPPLER_CONFIG` and `DOPPLER_ENVIRONMENT`.
  Strip them before writing.
- Seeding with `push` uploads every `.env` key, including any the example doesn't list. Check
  `env-sync`'s `# Not in .env.example` blocks in today's files first, and delete what's dead.
- Never run a bare `doppler secrets` or `doppler secrets get` from an agent session. It prints the
  values into the transcript. Go through `pull` and `push`, which print key names only.
- `TelemetryScriptActivity.spec.ts:33,45` uses `"env-sync"` as fixture data, not a reference.
  Leave it.
- `docs/FEATURES.md:38` lists `pnpm env:sync`, but the file is generated. Run `pnpm docs:map`
  after change 8, or pre-commit blocks on a stale map.
- `.gitignore:32` ignores `.env.*`, so `writeEnv()`'s backups stay out of git. Don't add a negation
  for them.

## Confirmation

| Claim | Check |
| --- | --- |
| A fresh pull rebuilds every `.env` | Copy each `.env` aside, delete them, run `pnpm env:pull`, then compare `sort`ed copies: every key and value matches |
| Pulled files are private | `stat -f %Sp apps/*/.env` prints `-rw-------` for each |
| Doppler covers every example key | `pnpm env:pull --check` exits 0. Add `NUXT_PROBE=` to an example and it exits 1 naming `NUXT_PROBE` |
| A missing login fails loudly | Run `doppler logout`, then `pnpm env:pull`: exits non-zero naming `doppler login` |
| No value reaches stdout | `pnpm env:pull 2>&1 \| grep -F "$(sed -n 's/^NUXT_MAIL_API_KEY=//p' apps/huella-legal/.env)"` finds nothing |
| env-sync is gone | `git grep -n "env:sync\|src/env-sync"` finds nothing outside `docs/decisions/` |
| Nothing secret is tracked | `git ls-files \| grep -E '\.env($\|\.)' \| grep -v '\.env\.example$'` finds nothing |
| The script stays tested | `pnpm nx test @joinery/scripts` passes, including the domain specs under `env-secrets/domain/` |
