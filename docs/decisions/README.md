# 🧭 Decisions

The answer to an architectural question, once it's answered. One file per decision,
`<NNNN>-<slug>.md`. The issue holds the question; the file holds the answer.

Write one only when a fork was really open, or a later ticket builds on what was found. One spike
gets one report. A choice that copies existing precedent gets a line in a report, or just the PR.
The `decision-report` skill writes them.

## Structure

Copy [`TEMPLATE.md`](./TEMPLATE.md): frontmatter, then five short sections.

| Section | Answers |
| --- | --- |
| Context | What was in tension, in the spike issue's own framing |
| Result | The outcome, as a fact found, not a recommendation |
| Options considered | Table: option, why it lost |
| Consequences | What it unlocks, what it forecloses, what would reopen it |
| Confirmation | A command, check or test that fails if the decision stops holding |

While `status: to-implement`, the report must let someone with no context do the work: file paths
and lines in Result, order and tripwires in Consequences, a runnable check per claim in
Confirmation. [`0018`](./0018-developer-portal-duplicated-facts.md) is the calibration.

## Numbering

**The number is consecutive, not the issue's**: the next free `NNNN`, zero-padded to four digits.
The issue goes in the `issue:` field. Two reports may share an issue.

**The five sections are a record, never edited afterwards.** Two exceptions: a labelled template
migration of every report at once, and repairing a link whose target moved
([0011](./0011-docs-system-enforcement.md) has why).

## Status and decision

The frontmatter is the only part that changes after filing:

```
---
issue: 106
status: to-implement
decision: accepted
---
```

| Field | Axis | Values |
| --- | --- | --- |
| `status` | Has the work landed? | `to-implement` — the decision is made, the work isn't in the repo yet · `implemented` — it is · `wont-implement` — decided against, deliberately, not a report waiting on follow-up |
| `decision` | Does the decision still hold? | `accepted` — the default · `superseded` — a later report overturned it; see [🔁 Superseding a decision](#superseding-a-decision) |

Whoever lands the follow-up work flips `status` in the same PR. Nothing is commented on the issue;
the PR references it.

The [developer portal](../../apps/developer-portal/README.md) builds its Decisions page from these
fields. A bad filename, unknown value, reused number, missing `issue:` or dangling `supersededBy:`
fails `pnpm docs:verify` at pre-push and in CI.

## Superseding a decision

A reversal is a **new report**. The old one's sections stay as they were:

1. The new report is filed as usual, `decision: accepted`.
2. The old report's frontmatter — and only its frontmatter — changes: `decision: superseded` and
   `supersededBy: <new-file>.md`.
