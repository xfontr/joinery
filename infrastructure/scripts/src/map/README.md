# 🗺 `pnpm docs:map`

Renders [`docs/FEATURES.md`](../../../../docs/FEATURES.md), the index of every command, git hook,
workflow and agent skill with the doc that explains it, plus the root README's
[generated regions](#the-readme-regions).

| Command | What it does |
| --- | --- |
| `pnpm docs:map` | Re-render both |
| `pnpm docs:map --check` | Exit 1 if either file differs from the render. Runs in CI and pre-commit |

## Structure

```
main.ts                   render, then write or --check
adapters/files.ts         filesystem and git
domain/capabilities.ts    what counts as a capability, and which doc explains it
domain/render.ts          the markdown
domain/readme.ts          the README regions
```

## What it finds

| Kind | Read from | Skipped |
| --- | --- | --- |
| Command | Root `package.json`, then each project's | `lint`, `typecheck`, `test`, `test:dev`, `test:coverage`, `build`, and project scripts the root already wraps |
| Hook | `.husky/*` | `_/` |
| Workflow | `.github/workflows/*.yml` | — |
| Skill | `.claude/skills/*/SKILL.md`, named by frontmatter | — |

## Picking the doc

Every markdown file is a candidate except changelogs, the map itself and the capability's own source
file. The token must appear standalone (`release:dry` doesn't answer for `release`). Ranked by
audience first — `README.md`, then other docs, then `CLAUDE.md`, then `SKILL.md` — then by nearness.

A capability no doc names shows `—`. `--check` doesn't fail on it, since some are undocumented on
purpose; the fix is to write the doc, never to edit the map.

## The README regions

| Region | Rendered from |
| --- | --- |
| `layout` | Each project's `package.json` `name` and `description` |
| `type-tags` | The `type:*` constraints in `boundaries.ts`, plus the projects holding each tag |
| `scope-tags` | The `scope:*` constraints, the same way |

Each sits between `<!-- docs:map:<name> -->` markers in the root README. A missing marker or an
unparseable `boundaries.ts` exits 1 rather than writing empty tables.
