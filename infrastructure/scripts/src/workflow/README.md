# 🧭 workflow

The GitHub side of each project under [`data/workflows/projects/`](../../../../docs/workflows/README.md).
Once a block is filed, GitHub is the record, so every command reads it rather than the project file.
`setup`, `file` and `drop` are dry runs until `--yes`.

```sh
pnpm workflow:setup harbour-notes --yes         # milestone and labels
pnpm workflow:sync [ids…]                       # write the portal's snapshot
pnpm workflow:sync huella-legal --close         # the same, with this branch's ticket closed
pnpm workflow:next huella-legal                 # waiting on you, ready, in flight, blocked
pnpm workflow:file huella-legal --yes           # file every block that can be filed now
pnpm workflow:file huella-legal search --yes    # file one block as tickets
pnpm workflow:file my-blog article-page home-page   # several blocks in one ticket
pnpm workflow:drop harbour-notes --yes          # close untouched tickets of an abandoned project
```

| Command | Does |
| --- | --- |
| `setup` | Creates the project's milestone and the labels filing needs. Run again after switching a feature on |
| `sync` | Reads the milestone's issues, blocked-by links, branches, PRs and board `Complexity`, plus `git log`, into `<project>.snapshot.json`. Writes only on change. `--close` records the branch's ticket as closed, for the PR that closes it; a close already recorded keeps its date and activity, so the sync after the merge changes nothing |
| `next` | Lists the blocks that can be filed now, then groups open tickets by what can happen next. A linked branch, open PR or commit means in flight |
| `file` | One issue per ticket (or per bundle), with milestone, labels, blocked-by links and a body an agent can work from, on the `Joinery` board. With no block, every block that can be filed, round after round until none opens. Then re-syncs |
| `drop` | Closes as not planned every ticket that's ready, blocked or waiting; keeps anything in flight or done. Run before deleting the project on the portal |

`file` refuses a block that's off, settled, already filed, or waiting on an open `spike`/`owner`
block or an unfiled `build` block. A project's `ticketSize` bundles blocks as
[the workflows README](../../../../docs/workflows/README.md#ticket-size) describes; a bundle files
whole.

## Structure

```
index.ts            dispatches setup | sync | next | file | drop
adapters/gh.ts      the milestone GraphQL query, labels, issue creation and closing
adapters/git.ts     commit dates and subjects
adapters/files.ts   project and template YAML, the snapshot
domain/             snapshot mapping, ticket status and queues, labels, filing and bundles
```

## Rules written twice

The portal can't import this package, so these live in both places. Each pair's specs share one table
of cases, so changing one copy fails a spec.

| Here | Portal (`layers/workflows/shared/`) | Shared cases |
| --- | --- | --- |
| `ticketStatus`, `dropPlan` in `domain/queue.ts` | [`ticket.ts`](../../../../apps/developer-portal/layers/workflows/shared/ticket.ts) | `STATUSES` |
| `bundlesOf` in `domain/filing.ts` | [`ticketSize.ts`](../../../../apps/developer-portal/layers/workflows/shared/ticketSize.ts) | `STAGED`, `STAGED_BUNDLES` |
| `isOn`, `toFile` in `domain/filing.ts` | [`project.ts`](../../../../apps/developer-portal/layers/workflows/shared/project.ts), [`projectView.ts`](../../../../apps/developer-portal/layers/workflows/shared/projectView.ts) | — |
