# 🧭 Workflows

A **template** is a map of the blocks a kind of project needs, and what blocks what. A **project**
picks a template, switches its features once, and files the blocks as GitHub tickets. From then on
GitHub is the record, and the developer portal's **Workflows** page draws it. Order comes from
links between blocks, not from stages.

The `project-workflow` skill runs this; the commands are in
[the workflow script's README](../../infrastructure/scripts/src/workflow/README.md).

## 🗂 Structure

This page is the rules. The files live in [`data/workflows/`](../../data/README.md), and the
portal's invariant checks validate every one: each id, stage and switch resolves, each `reuse.from`
path exists, and `dependsOn` never loops.

```
data/workflows/
  templates/<id>.yaml              the blocks, what each needs, its lessons and reuse plan
  projects/<id>.yaml               which template, which milestone, switches, ticket size, settled blocks, extras
  projects/<id>.snapshot.json      written by `pnpm workflow:sync`, never by hand
  projects/<id>.diary.md           dated lines on what in the workflow worked and what went wrong
```

| Noun | Is | Lives in |
| --- | --- | --- |
| Block | One thing the project needs — a content audit, comments, a cutover, a sign-off. Required, optional with a default, or `onDemand`: no switch, in the map only while a page depends on it. The code calls it a capability | The template, or a project's `extras` for something only it has |
| Need | A `dependsOn` link from one block to another it can't start without. `stage:<id>` needs every other block in that stage, including the pages a project adds to it | The block |
| Stage | A colour and a label for a family of blocks — discovery, design, launch. It orders nothing | The template |
| Feature | One switch in the plan: an optional block such as storybook, or a `groups` entry bundling several. None is special; switching one off takes its blocks out of the map, and whatever needed them waits on what they needed instead | The template's `optional` blocks and `groups`; the project's `switches` |
| Ticket | A GitHub issue in the project's milestone with a `cap:<block>` label, or several when blocks share it | GitHub |
| Ticket size | How closely a person oversees the code, which sets how many points a filed ticket holds: `block`, `supervised` or `fast` | The project's `ticketSize` |
| Complexity | A Fibonacci estimate of how much a person has to understand, decide and check, whoever writes the code | The template's `complexity` per block; the board's `Complexity` field per ticket |

## 🧩 Templates

| Template | For | Blocks with defaults on |
| --- | --- | --- |
| [`website-rebuild`](../../data/workflows/templates/website-rebuild.yaml) | An existing site, usually WordPress, rebuilt on the same brand: discovery spikes, migration, redirects and a domain cutover | 41 |
| [`new-website`](../../data/workflows/templates/new-website.yaml) | A site started from nothing: no audit, migration, redirects or cutover, but a brand, a content model and the launch copy to create | 33 |
| [`custom`](../../data/workflows/templates/custom.yaml) | Anything no template fits, such as a developer tool, a package or an internal feature: three stages and no blocks, so the project's `extras` are its whole map, drafted with the `project-workflow` skill | 0 |

## 🧱 Three kinds of block

| `kind` | What it is | Huella examples |
| --- | --- | --- |
| `spike` | Answers a question; its answer changes the shape of later tickets | Content probe #185, hosting #186 |
| `owner` | Only the project's owner can close it: approve a direction, pick a provider, hand over a credential, point DNS | Design choice #208, cutover DNS #251, Grafana provisioning #212, which waited 39 days |
| `build` (the default) | Agent-sized code work with criteria a check can verify | Everything else |

A gate is an `owner` block. `scope-signoff`, `design-approval` and `go-live` hold back only the
blocks that need them, and closing the ticket is the approval. Nothing else waits.

## 📄 Page types

A template's `types` are blocks a project adds under `extras`, once per layout — never once per page,
since another page on a layout is just a slug. The extra inherits the type's stage, estimate,
criteria and needs; its own fields win, and its `dependsOn` adds to the type's.

```yaml
extras:
  - { id: legal-page, type: page-template, title: Legal and about }
  - { id: services-page, type: page-template, title: Services }
  - { id: launch-page, type: custom-page, title: Launch landing }
```

| Type | For | SP | Needs |
| --- | --- | --- | --- |
| `page-template` | One layout several content pages share; each page on it is a slug | 5 | `standard-pages` |
| `custom-page` | A page written in code rather than read from content, such as a landing | 5 | `component-kit`, `ci-deploy` |
| `blog` | Posts and their paginated listings | 13 | `component-kit`, `ci-deploy` |
| `blog-comments` | A blog whose posts take comments | 13 | `component-kit`, `ci-deploy`, `comments` |

`comments` (8 SP) is `onDemand`: the first blog with comments brings it in. `standard-pages`
(*Page shell*) is the slug route plus the 404 and error pages.

## 🤝 The contract with GitHub

The map seeds the plan, and filing writes it to GitHub. **After that, GitHub wins**: change a
dependency on the issue, never in the file.

| In the map | On GitHub |
| --- | --- |
| Project | Milestone, plus the area label ([`0035`](../decisions/0035-one-board-area-labels.md)) |
| Block | A `cap:<id>` label on each of its tickets |
| A block's needs | GitHub's own blocked-by link, from each new ticket to every open ticket of each `build` block it needs |
| `owner` block | Its tickets carry the `owner` label |
| `spike` block | Its tickets carry the `spike` label |
| Someone is on it | A branch linked on the issue, which `pnpm issue:pick` makes through `gh issue develop` |
| Done or dropped | Closed as completed, or closed as not planned |

## 🎟 Ticket size

`ticketSize` sets how many blocks share a ticket, never the map. Blocks fill tickets first-fit up to
the size's width in points; a ticket with several `cap:` labels counts under each, and closing it
finishes all of them. The size locks once the milestone holds one live `cap:` ticket.

| `ticketSize` | Who checks the code | A ticket holds | `new-website` | `website-rebuild` |
| --- | --- | --- | --- | --- |
| `block` (the default) | A person reviews every PR | One block, or each of its suggested tickets | 35 | 43 |
| `supervised` | AI builds it; each ticket runs plan, checks and adversarial review | A stage's build blocks, up to 13 SP | 31 | 36 |
| `fast` | Nobody closely; internal tools and experiments | Up to 21 SP, with the spikes together | 26 | 26 |

Counts are tickets with each template's defaults on. Widths are `TICKET_WIDTH` in both copies of
`bundlesOf`. Merging never breaks these:

- **Only build blocks share a ticket**, and spikes only with spikes. Owner blocks never share.
- **A stage splits where an owner or spike block sits between its build blocks.**
- **Blocks share a ticket only when they wait on exactly the same outside blocks.**
- **A bundle files whole or not at all**, computed over every block that's on and unsettled, so
  filing one never reshuffles the rest.
- **Needs inside the ticket are dropped; needs outside it become blocked-by links.**

`pnpm workflow:file <id> <a> <b> <c>` merges exactly the blocks named, as a one-off.

## 🧮 Complexity

Points measure how much a person has to understand, decide and check — not how much typing.

| Points | Looks like |
| --- | --- |
| 1–2 | Copies a pattern in one project; nothing to decide |
| 3 | One project, a known library, a decision or two |
| 5 | Several projects or a boundary to check, or a spike with real research |
| 8 | A new vendor, shared packages or live content at risk, review that finds things |
| 13–21 | A new system with no precedent, or a block that should become several tickets |

| Where | Figure |
| --- | --- |
| A block not filed yet | The template's `complexity`, from what Huella's tickets for it added up to |
| A filed ticket | The `Complexity` field on the `Monorepo` board; filing sets it from the template, a bundle to the sum of its blocks, and a block with several suggested tickets leaves it blank |
| A ticket under several blocks | Split evenly between them, so a project total counts it once |
| A settled or switched-off block | Nothing |

## 📏 The rules

Each rule comes from something Huella Legal paid for; the issue numbers are the evidence.

| Rule | What it prevents |
| --- | --- |
| **Links decide the order, not stages.** A ticket is ready when every ticket it is blocked by is closed | Build waiting on a gate that hardening and late discovery ignored anyway |
| **Decide before you file.** A block's tickets are filed only once every `spike` and `owner` block it needs is closed. A block that only needs `build` blocks can be filed as soon as those have tickets, linked to them | Build tickets filed the night before the final design (#208); providers swapped after they were wired — Mailchimp to Kit (#242 → #299), a mailto to a form (#243 → #301), a search page to a dialog (#248 → #316) |
| **Unknowns and waits first.** Ready tickets are listed by how many open tickets wait behind them, and `owner` tickets sit in their own column at the top | Hosting decided on paper and changed five times (#186, #244, #302, #377); the feature inventory skipped, so comments, the about page and hidden categories turned up late |
| **A host or provider change is its own spike and sign-off**, never part of another ticket | Cloudflare going in under the lint ticket #231 inside PR #370, then reverted two days later (#377, #378) |
| **Deploy work is done on a real preview deploy**, not on a green local check | #382, #387, #388 and #395, all found only by the real deploy |
| **A blocked ticket can't be picked.** `pnpm issue:pick` reads the links live and refuses while one is open, unless given `--force` | An agent starting on a snapshot that went stale an hour ago |

## 🚦 Status

A ticket's status comes from GitHub alone, so it never needs updating by hand.

| Ticket status | When |
| --- | --- |
| In flight | Open, with a branch linked on the issue |
| Blocked | Open, with an open ticket in its blocked-by links |
| Waiting on you | Open, unblocked, and labelled `owner` |
| Ready | Open, unblocked, and not the owner's |
| Done / Dropped | Closed as completed / as not planned |

An open PR that would close it, or a commit naming it as `[#N]`, also counts as in flight.

A block's state comes from its switch, the project file and its tickets, in this order.

| Block state | When |
| --- | --- |
| Off | Its feature is switched off |
| Skipped / Done | Settled in the project file, with a note; from its `on:` date when it has one |
| Done | Every live ticket delivered |
| Waits on a decision | Nothing filed, and a need still holds it back under the rule above |
| Can file now | Nothing filed, and nothing it needs holds it back |
| Waiting on you | An `owner` block with nothing in its way, or an open ticket labelled `owner` |
| In flight | An open ticket is in flight |
| Blocked | Open tickets, while a block it needs is unfinished or every ticket's GitHub blockers are open |
| Ready | Open tickets and nothing in the way |

A block is blocked by the map as well as by GitHub's links. **Progress** is done blocks over blocks
that are on and not skipped.

## 🗺️ The page

A day-by-day replay from the first commit, the blocks left, stage cards, and a graph of what blocks
what. **Settings** (features, ticket size, details, delete) writes the project file under `pnpm dev`
and is read-only when deployed.

## 🏷️ How a ticket finds its place

| The issue has | It shows |
| --- | --- |
| The milestone and `cap:comments` | Under the Comments block |
| The milestone and no `cap:` label | Under **To organise** |
| A `cap:` label naming no block, naming a feature that bundles blocks, or, while open, one switched off | Under **To organise**, with the reason |
| The area label, no milestone, and open | Under **To organise** while any block that is on is unfinished, then nowhere: from there on it is maintenance |
| Neither the milestone nor the area label | Nowhere: it isn't part of the effort |

Place a ticket by adding the milestone and a `cap:` label on GitHub.

## 📈 Activity

The sync reads `git log`: each commit naming a ticket as `[#N]` marks a day of activity on it. It
shows when work happened, not how long it took.

## ✍️ Commands

| Need | How |
| --- | --- |
| Create a project | The plus card on the Workflows page under `pnpm dev developer-portal`. Deployed, it downloads the file for a PR |
| Create its milestone and labels | `pnpm workflow:setup <id> --yes` |
| Refresh the portal's snapshot | `pnpm workflow:sync [<id>]`; post-checkout and post-merge also run it in the main checkout |
| See what can be taken now | `pnpm workflow:next <id>` |
| File everything that can be filed (dry run without `--yes`) | `pnpm workflow:file <id> --yes` |
| Abandon a project | `pnpm workflow:drop <id> --yes`, then delete it in Settings |
| Switch features, ticket size, edit, delete | The project's Settings page under `pnpm dev` |
| Settle a block without a ticket | Its panel on the project page under `pnpm dev`: done or skipped, with a note and `on:` date |
| Add an extra or a page | Edit `projects/<id>.yaml` |
| Change the generic map | Edit the template |

## 📓 Diary

Every project keeps `projects/<id>.diary.md`: a log of what in the workflow went right and what
went wrong, so the next template keeps the first and fixes the second. "The workflow" is the
template, the map, a command, a ticket's text or the agent. The portal's new-project wizard opens
it, and the portal's workflow checks flag a project file with no diary beside it.

**Keep-test: a line says something worked or something went wrong.** A line that reads as neither
isn't written, however true. What the work found (measurements, a decision) goes in the decision
report or the commit, not here. One line per entry, appended, in this shape:

```markdown
- 2026-11-15 · friction · #446 · workflow:file refused X because Y; did Z by hand
- 2026-11-15 · estimate · #447 · 10 SP, took 25 min: tokens copied from Huella almost as-is
- 2026-11-15 · worked · #448 · The reuse plan named apps/huella-legal/layers/design; copied as-is
```

| Type | Means | When |
| --- | --- | --- |
| `estimate` | Points against time | The PR that closes a ticket opens: its points against what it actually took |
| `worked` | Went right | A block, a `reuse` plan, a command, a ticket's text or the map did its job with nothing to fix |
| `friction` | Went wrong | A command failed or confused, something was done by hand, or the owner corrected the agent |
| `map` | Went wrong | A block nobody drew, a missing or wrong `dependsOn`, a block or criterion that didn't apply |
| `rule` | Either, and the line says which | A rule blocked something it shouldn't have, or saved a redo |

A block closes in the PR that closes its ticket, never after the merge: that PR carries the
`estimate` line, a `pnpm workflow:sync <id> --close` and any unfiled block the work proved wrong.
[`workflow-close.sh`](../../.claude/hooks/workflow-close.sh) refuses to open the PR without the
line and the closed ticket.

One clause for what happened, one for the evidence. Say which way it went; never praise your own
work. [`check-invariants.sh`](../../.claude/hooks/check-invariants.sh) rejects any other type when
Claude edits a diary.
