# ⏱️ tasks

Runs the root Nx commands and times every task they run into the [`tasks` log](../usage/README.md).
Nx rewrites `run.json` in its cache folder after every command, with each task's start, end and
cache status; this reads it straight after Nx exits.

```sh
pnpm check                    # nuxt-prepare, then eslint:lint typecheck test, then docs:map --check
pnpm lint                     # any root Nx command: the subcommand names it, the rest goes to nx
```

| Subcommand | Root command |
| --- | --- |
| `check` | `pnpm check`, whose steps are [`CHECK_STEPS`](./domain/runs.ts) |
| `lint`, `typecheck`, `test`, `build` | The same name, on affected projects |
| `test:coverage`, `unused:check` | Their Nx half; `coverage-report` and `knip` run after |

Output, exit code and Nx's agent detection are unchanged: Nx inherits the terminal. Each call also
records one `scripts` row, so `pnpm check`'s whole wall time is the `tasks check` row's `ms`.

## Structure

```
main.ts             the subcommands, and recording each Nx run's tasks
adapters/nx.ts      spawning nx and docs:map, reading run.json from Nx's cache folder
domain/runs.ts      run.json to rows, the load figure, check's steps and exit code
```

A `run.json` older than the spawn belongs to an earlier command and records nothing, so an Nx
call that fails before any task starts can't be timed twice.
