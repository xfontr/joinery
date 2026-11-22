# 🔑 env-sync

Keeps every `.env` laid out like the `.env.example` beside it — same order, same comments, every
key present — without ever losing or printing a value.

```sh
pnpm env:sync           # sync every .env with its .env.example, creating missing ones
pnpm env:sync --check   # say what would change and exit 1, writing nothing
```

Every `.env.example` git knows about is covered; its partner is the `.env` beside it. `.env.local`
and friends are left alone. A missing `.env` is created from the example with mode `600`.

## Structure

```
index.ts            hands main to run()
main.ts             one pass per example: parse both, merge, verify, write or report
adapters/files.ts   finding the examples, reading, and the backup-then-rename write
domain/envFile.ts   the line parser, which refuses anything it can't classify
domain/sync.ts      the merge, the lost-data check and the key-only summary
```

## What a sync does

The example decides the layout, and `.env` supplies the values:

| In `.env` | Ends up |
| --- | --- |
| A key the example has | In the example's position, with the `.env` value byte for byte, including `export`, quotes, inline comments and multi-line values |
| A key the example only has commented out (`# NUXT_MAIL_FROM=`) | In that commented line's place, uncommented, which is what the example's `OVERRIDES` block asks for |
| A key the example lacks | Under a `# Not in .env.example` block at the end, in its original order, named in the output so you can delete it by hand |
| A commented-out assignment (`# KEY=old-value`) the example doesn't have | Kept as data, above its key's slot, or in the trailing block when the example has no such key |
| A prose comment the example doesn't have | Dropped in favour of the example's comments. The output counts them, and the backup still has them |
| Nothing, for a key the example sets | Added at the example's position with the example's default |

## Why it can't lose a file

| Guard | Where |
| --- | --- |
| A file it can't parse (duplicate key, unclosed quote, CRLF, any line that isn't `KEY=value`, a comment or blank) is left as is | [`envFile.ts`](./domain/envFile.ts) |
| The result is re-parsed; any lost or changed value aborts that file | `lostData` in [`sync.ts`](./domain/sync.ts) |
| Every rewrite backs up to `.env.backup-<UTC timestamp>` first (never pruned), then writes a temp file and renames it | [`files.ts`](./adapters/files.ts) |

A file left untouched makes the command exit 1, but the others still sync.

## When it runs on its own

| Trigger | Condition |
| --- | --- |
| `pnpm quick-start` | Always, so a new clone gets its `.env` files before anything reads them |
| [`pre-commit`](../../../../.husky/pre-commit) | The commit stages a `.env.example` change. It never blocks the commit, since `.env` is not part of it |
| [`post-checkout`](../../../../.husky/post-checkout) and [`post-merge`](../../../../.husky/post-merge) | The branch switch or merge changed a `.env.example`. Never blocks |
