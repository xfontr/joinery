# 📝 issue

Three commands over `gh`: `add` files an issue from the terminal, `pick` branches off one, and
`brief` prints an issue with everything it points at. Ctrl+C at any prompt exits without side
effects.

```sh
pnpm issue:add                       # four prompts, then gh issue create
pnpm issue:pick                      # choose from the board, branch, assign, move to In Progress
pnpm issue:pick 288 --type=feature   # no prompts — the form agents use
pnpm issue:brief 288                 # or no number, on that issue's branch
```

## Structure

```
index.ts         dispatches add | pick | brief
add.ts           the filing flow
pick.ts          the pick-and-branch flow
brief.ts         the brief
adapters/        gh, git, files, prompts
domain/          branch names, search matching, pick options, the brief's layout, live-vs-cache choice
```

The generic `gh()` wrapper, the file cache and the cancel helper live in
[`../shared/`](../shared/README.md).

## `pnpm issue:add`

| Step | What it does |
| --- | --- |
| Project | Open boards plus *none*. Skipped when there's exactly one |
| Label | Searchable by name or description, plus *none* |
| Title, description | One line each; the description is the whole body |
| Confirm | *Yes* files it and prints the URL |
| Pick? | Only when on `master`: *yes* runs `pick` for the new issue |

No templates, on purpose: this is for issues that would otherwise never get written. The
`github-issue` skill has the templated shapes.

## `pnpm issue:pick`

| Step | What it does |
| --- | --- |
| Project | Skipped when there's exactly one open board |
| Issue | The board's open issues, searchable by number, title or label |
| Resume | If a branch for that issue exists, *yes* checks it out and stops |
| Branch type, title | `feature`/`fix`/`hotfix`/`release`, and a title pre-filled from the issue |
| Then | `gh issue develop` (linked on the issue), assign `@me`, move to *In Progress* |

- Branches are `<type>/<area>/<number>-<slug>`. The area is the first `app:`, `package:` or `infra:`
  label without its prefix, else `repo`.
- An open blocked-by link stops the pick; `--force` skips the check.
- Assigning and moving the card only warn on failure; the branch stays.
- When `gh` is unreachable, `pick` browses the cached projects and issues, then fails at the
  branch step.

### Picking by number

`pnpm issue:pick <number>` asks nothing:

| Flag | Default |
| --- | --- |
| `--type=<feature\|fix\|hotfix\|release>` | From the label: `enhancement` → `feature`, `bug` → `fix`. Otherwise required |
| `--title=<text>` | The issue title |
| `--project=<board title>` | The issue's first board |
| `--force` | Branch even with an open blocker |

Flags take the `--name=value` form only.

## `pnpm issue:brief`

Prints the issue's state, labels, assignees, board column, body and every comment, then:

| Section | Found by |
| --- | --- |
| Blockers | Every `#n` on a `Blocked by` line, with title and state |
| Decisions | `docs/decisions/*.md` whose `issue:` is this issue or one the thread mentions, plus `ADR 0028`-style mentions |
| Projects | `app:`/`package:`/`infra:` labels, the branch's area and paths in the text, each with its `CLAUDE.md` |
| Docs mentioned | Paths under `docs/` or `.claude/` that exist |

With no number, it reads the one in the branch name.

## Caching

Projects and labels are cached for 24 h under `node_modules/.cache/@monorepo/scripts/`; `--refresh`
bypasses it. The issue list is always fetched live and cached only as the offline fallback.

## Requirements

`gh` logged in with the `project` scope (`gh auth refresh -s project`). Without it `add` loses the
project prompt and `pick` can't run. Assigning needs repo write access; moving the card needs project
write access and the default "Status" / "In Progress" field names.
