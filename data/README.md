# 💾 data

Files the repo's own tooling reads and writes, committed so every clone, CI run and the deployed
portal see the same thing. Each folder's format is documented by its owner, linked below.

## Structure

| Folder | Written by | Read by | By hand |
| --- | --- | --- | --- |
| `telemetry/<log>/<branch>.csv` | [`pnpm usage:flush`](../infrastructure/scripts/src/usage/README.md), from the pre-commit hook | The portal's Tooling usage page, at `collect` | Never |
| `workflows/templates/<id>.yaml` | People, when a shipped project teaches the map something | `pnpm workflow:*`, the portal's Workflows page | Yes, against [the workflow rules](../docs/workflows/README.md) |
| `workflows/projects/<id>.yaml` | The `project-workflow` skill, the portal's wizard and Settings page under `pnpm dev` | `pnpm workflow:*`, the portal's Workflows page | Yes, for settlements and extras |
| `workflows/projects/<id>.snapshot.json` | [`pnpm workflow:sync`](../infrastructure/scripts/src/workflow/README.md) | The portal's Workflows page | Never |
| `workflows/projects/<id>.diary.md` | People and agents, against [the diary rules](../docs/workflows/README.md#diary) | People, after the project | Yes, appended one line at a time |

## Rules

- **Not `.data/`**, which is gitignored everywhere for throwaway local state.
- **Outside every Nx project**, so a telemetry row makes nothing affected. The portal opts into
  `workflows/` through its own `namedInputs`.
