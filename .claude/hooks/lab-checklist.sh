#!/bin/sh
# A ticket built from a lab gets its checklist comment ticked before the PR opens; #484 shipped
# three pages unlike their lab because nobody listed what the lab had.
# Exit 2 blocks the call and hands the message to the model.

command -v jq >/dev/null 2>&1 || exit 0
command -v gh >/dev/null 2>&1 || exit 0

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -n "$cmd" ] || exit 0

at='(^|[;&|(])[[:space:]]*'
printf '%s' "$cmd" | grep -Eq "$at(gh[[:space:]]+pr[[:space:]]+create|pnpm[[:space:]]+issue:ship)" || exit 0

# A worktree session's branch is in its own cwd; the project dir is the main checkout (#487).
dir=$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null)
cd "${dir:-${CLAUDE_PROJECT_DIR:-.}}" || exit 0
issue=$(git branch --show-current | sed -nE 's#^[a-z]+/[^/]+/([0-9]+)-.*#\1#p')
[ -n "$issue" ] || exit 0

# GitHub unreachable fails open: the hook guards a habit, not access.
read=$(gh issue view "$issue" --json body,comments 2>/dev/null) || exit 0
printf '%s' "$read" | jq -r '.body' | grep -q '/lab/' || exit 0

checklist=$(printf '%s' "$read" | jq -r '[.comments[].body | select(startswith("## Lab checklist"))] | last // empty')

if [ -z "$checklist" ]; then
    echo "Blocked: #$issue builds from a lab page and has no \"## Lab checklist\" comment." >&2
    echo "Read every lab page the ticket covers, post the checklist (start-issue step 4), build" >&2
    echo "every item, tick it, then open the PR." >&2
    exit 2
fi

open=$(printf '%s\n' "$checklist" | grep -E '^[[:space:]]*- \[ \]')
[ -z "$open" ] && exit 0

echo "Blocked: #$issue's lab checklist still has unticked items:" >&2
printf '%s\n' "$open" >&2
echo "Build each one and tick it. If the context is spent, say so and ask the owner to hand the" >&2
echo "remaining items to another agent; never open the PR over them." >&2
exit 2
