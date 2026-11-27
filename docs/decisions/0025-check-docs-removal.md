---
issue: 141
status: implemented
decision: accepted
---

# 🧭 Where `check-docs` went

## Context

[`0011`](./0011-docs-system-enforcement.md) moved four docs checks into one CI gate,
`pnpm exec nx check-docs @joinery/developer-portal`: broken relative links, the mirrored
`check-invariants.sh` rules, and decision filenames and frontmatter (including number collisions).
`bf29d16` took the step out of `ci.yml` and `3414e2c` (#141) deleted the target and
`tools/check-docs/index.ts`. Nothing recorded where each check went, so filed reports and a live
skill went on citing a gate that no longer exists.

## Result

| Check | Where it lives now | Blocks? |
| --- | --- | --- |
| `docs/FEATURES.md` is current | `pnpm docs:map --check`, in pre-commit and `ci.yml` | Yes |
| Review method version is current | `pnpm review:version --check`, in pre-commit and `ci.yml` | Yes |
| The `check-invariants.sh` rules on an agent's edit | [`.claude/hooks/check-invariants.sh`](../../.claude/hooks/check-invariants.sh), on Claude Code edits only | Yes, for that edit |

These filed reports cite `check-docs` as a gate. Their sections stay as written, and this table is
where the claim is corrected:

| Report | Claim | Now |
| --- | --- | --- |
| [`0002`](./0002-docs-drift-detection.md) | `check-docs` runs in `ci.yml` | It doesn't exist |
| [`0005`](./0005-nx-generators-and-ai-agent-setup.md) Confirmation | `check-invariants.sh`'s assertions "now also run in CI" | They never ran in CI after `bf29d16` |
| [`0020`](./0020-review-frontmatter.md) step 2 row 4 and two Confirmation rows | Two new `check-docs` rules over review `method:` | They belong in `pnpm review:version --check`, which already gates the method version |

## Options considered

| Option | Why not |
| --- | --- |
| Move the checks into `infrastructure/scripts` as a `docs:check` script | The parsers live in the portal, and a script reaching into an app breaks the `type:tooling` boundary |
| Leave `decisionProblems` uncalled | The skill tells agents a number collision gets caught; without a caller, nothing catches it anywhere |

## Consequences

0011 is marked superseded by this report. Its changes 2, 4, 5 and 6 stand, and change 7 shipped with
0014, so its status is `implemented`.

Anyone implementing 0020 hosts its two rules in `infrastructure/scripts/src/review-version`, not in
the portal: that is the one place a review-method rule still fails a commit.

## Confirmation

| Claim | Check |
| --- | --- |
| No `check-docs` target exists | `git grep -n check-docs -- nx.json '*/package.json' .github` returns nothing |
