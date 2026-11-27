---
issue: 489
status: to-implement
decision: accepted
---

# 🧭 Impeccable reviews design and no-ai-slop reviews copy, as user-scope skills

## Context

Every app's design and copy were made by an agent, and parts of both read that way. Two free
skills target exactly that:

- [Impeccable](https://github.com/pbakaus/impeccable) (npm `impeccable`, 4.10.0, Apache-2.0) grew
  out of Anthropic's `frontend-design`. It adds 23 `/impeccable` commands, such as `critique`,
  `polish` and `typeset`. It also has a detector for AI design tells: 62 fixed rules, with no model
  involved.
- [no-ai-slop](https://github.com/petergyang/no-ai-slop) (MIT) names 20-odd AI writing patterns. In
  its detect mode it quotes each line and gives the fix without rewriting anything.

Impeccable's installer offers more than this repo can take as-is: a design hook that edits trigger,
a live mode, telemetry on by default, and `init` / `document` commands that write `PRODUCT.md` and
`DESIGN.md`. The question is which parts to use, where in a project they run, and how to use them
without undoing design decisions already approved.

## Result

Both skills are installed at user scope and used by the agent. Impeccable's hook, live mode and
telemetry stay off, and its own design docs are never generated over ours.

| Part | How it is used |
| --- | --- |
| Install | `npx skills add pbakaus/impeccable --global` and `npx skills add petergyang/no-ai-slop --skill no-ai-slop --global --yes`. Nothing is added under `.claude/`. The VS Code extension has no `/plugin` command |
| Hook | Off. Never run `/impeccable hooks on`, and never run `npx impeccable install` without `--no-hooks` |
| Live mode | Off. Its Apply fallback runs `claude` or `codex` with approvals and the sandbox turned off |
| Telemetry | Off. Every CLI call is prefixed with `DO_NOT_TRACK=1`. The skill still fetches design directions from impeccable.style, and that call is accepted |
| `init` / `document` | `document` is never run in an app that already has a `DESIGN.md`. Before `init` writes `PRODUCT.md`, it is pointed at the app's `DESIGN.md` |
| Detector | Run against the running dev server: `DO_NOT_TRACK=1 npx impeccable@4.10.0 detect --json --viewport <w>x<h> http://localhost:<port><path>`, at 1280x800 and 390x844. A file scan only pattern-matches the CSS and reported 0 on both apps that the URL scan found 60 tells in. It does not run in CI |
| no-ai-slop | Detect mode over the locale files and any copy written in code. Each named pattern is listed with its line for the owner, never rewritten unasked |

The workflow templates in `data/workflows/templates/` carry both reviews as blocks:

| Block | Template | Needs | Runs |
| --- | --- | --- | --- |
| `lab-review` | `new-website`, `website-rebuild` | `design-lab`; `design-approval` needs it | Impeccable over every lab direction, so the owner picks with the tells already named |
| `ai-review` | `new-website`, `website-rebuild` | `build-review`; `go-live` needs it | Impeccable on every page, no-ai-slop on every string the build wrote |
| `ai-review` | `custom`, recommended | `build-review` | The same, off for a project with no screens or copy |

Design docs Impeccable must read and must not overwrite:

| App | Design doc | Tokens |
| --- | --- | --- |
| `huella-legal` | `apps/huella-legal/DESIGN.md` | `layers/design/app/assets/main.css`, `layers/design/app/app.config.ts` |
| `marina-roustan` | `apps/marina-roustan/DESIGN.md` | `layers/design/app/assets/main.css`, `layers/design/app/app.config.ts` |
| `developer-portal` | none | `layers/design/app/assets/main.css`, `layers/design/app/app.config.ts` |
| `portfolio` | none | `app/assets/main.css`, `app/app.config.ts` |

A `critique` finding that contradicts an approved choice is dropped, not applied. That covers
Huella's Georgia and Montserrat, ivory paper and journal tone, Marina's colours and type taken from
the live site, and the portal's black chrome with Plex type. The detector flags the portfolio and portal's Fraunces display
as an AI tell. A pass that swapped it for Plex Sans was rejected on sight, so the identity's typeface
and layout change only with the owner's approval, and a pass proposes before it edits.

## Options considered

| Option | Why not |
| --- | --- |
| `npx impeccable install` with hooks on | The hook runs outside model approval and downloads its engine on the first edit. It would sit next to `eslint-fix.sh` and `check-invariants.sh` in `.claude/settings.json` with no review of what it does |
| Vendor the skills into `.claude/skills/` | That puts two third-party skills in the repo, with updates copied by hand. A user-scope install gives the same commands |
| One review at the end only | A tell found after the build is baked into every component. The lab is where a direction is still cheap to change |
| Detector as a CI check from day one | It needs a running site, and several rules, such as `straggler`, are advisory. CI comes after the per-app baselines show which rules are real problems here |
| Let `document` regenerate `DESIGN.md` | The two existing ones are written in house-docs voice and hold approved tokens. A generated copy would drift from them and break the one-design-system-per-app rule |

## Consequences

- Design passes start from a number per page, not from taste. Baselines as of this report, summed
  over both widths: `portfolio` 22, `developer-portal` 38, mostly advisory stragglers.
- Using user scope means a fresh machine or another contributor doesn't get the skills. That is
  acceptable while the owner is the only one doing design passes.
- Projects already past a new block settle it as skipped: `huella-legal` both, `marina-roustan`
  `lab-review`, whose design was approved in #465.
- **Order for an app's pass:**
  1. Scan every page at both widths for a baseline.
  2. Critique against the app's design doc.
  3. Fix through its tokens.
  4. Rescan.

  The baseline comes first so the pass can show its findings going down.
- **Tripwires:**
  - Port 3000 is often another project's dev server. Start the app on its own port.
  - Running one dev server and one scan at a time keeps the machine cool.
  - `/impeccable init` offers to turn the hook on. Decline.
  - A ticket that names a `/lab/...` path still needs its `## Lab checklist` comment, which
    `lab-checklist.sh` enforces. The lab's layout wins over a `critique` suggestion.
- **This gets reopened if:**
  - A baseline shows a rule set worth enforcing, which needs a new report adding
    `detect --sarif` to CI.
  - Impeccable makes its fetch to impeccable.style optional.

## Confirmation

| Claim | Check |
| --- | --- |
| No Impeccable hook in the repo's settings | `grep -i impeccable .claude/settings.json` prints nothing |
| No vendored skill | `ls .claude/skills \| grep -i -e impeccable -e slop` prints nothing |
| Existing design docs untouched | `git log --oneline -- apps/huella-legal/DESIGN.md apps/marina-roustan/DESIGN.md` shows no commit from an Impeccable `document` run |
| Every site template carries both reviews | `grep -c "id: lab-review\|id: ai-review" data/workflows/templates/{new-website,website-rebuild}.yaml` prints 2 for each |
| `go-live` waits on the final review | `grep -n "ai-review" data/workflows/templates/{new-website,website-rebuild}.yaml` lists it under `go-live`'s `dependsOn`; `custom`'s `go-live` needs all of `stage:ship` |
| A pass lowered the findings | The URL scan's `jq length`, summed over an app's pages, is below that app's baseline |
