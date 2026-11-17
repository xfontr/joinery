# 🔎 Audits

What a static read of one project found wrong at one commit, numbered and worked down over time.
One file per audit, `<YYYY-MM-DD>-<scope-slug>.md`. The `audit-report` skill writes them.

## 🧭 Audit or decision

| | [Decision](../decisions/README.md) | Audit |
| --- | --- | --- |
| Answers | Which way do we go? | What is wrong with *this project* right now? |
| Scope | One architectural fork | One project or directory |
| Anchored to | The issue that raised it | A commit |
| Body | Context, Result, Options, Consequences, Confirmation | Numbered findings tables |
| What changes after filing | `status:` for the whole file | The `Status` cell of each finding |

A finding that turns out to be a real fork becomes a decision report, and its row reads `wont-fix`
with the report as reference.

## 🗂 Structure

Copy [`TEMPLATE.md`](./TEMPLATE.md): frontmatter, then:

| Section | Holds |
| --- | --- |
| Context | What was read, and how a finding was confirmed |
| One section per category | A findings table. `Bugs` (`B`), `Duplication` (`D`), `Quality` (`Q`), `Security` (`S`), whichever apply |
| Order | The sequence to work the findings in |

A findings table has an `ID` and a `Status` column, typically with `Where`, `What goes wrong` and
`Fix` between. A table without both headers isn't counted.

```
---
scope: "@monorepo/developer-portal"
commit: "61b6f7f"
---
```

Quote `commit:`, or an all-digit sha parses as a number.

## 🚦 Status

**Whoever lands a fix flips that finding's cell in the same PR.**

| Value | Means |
| --- | --- |
| `open` | Still true of the code |
| `fixed` | The fix has landed — optionally followed by where, `fixed #152` |
| `wont-fix` | Decided against, deliberately — followed by the reason or the decision report that settled it |

An audit's state is derived: **open** until a finding moves, **in progress** after, **closed** when
none is `open`. An unknown status counts as `open`.

**IDs are permanent**: never renumbered or deleted, only closed. A late finding takes the next free
number. A later pass over the same project is a new audit.

The [developer portal](../../apps/developer-portal/README.md) shows progress per audit and flags one
whose filename, frontmatter or statuses break these rules.
