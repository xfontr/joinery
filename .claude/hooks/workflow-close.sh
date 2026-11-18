#!/bin/sh
# The PR that closes a workflow ticket carries the block's close; nothing records it after merge.
# Exit 2 blocks the call and hands the message to the model.

command -v jq >/dev/null 2>&1 || exit 0

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null)
[ -n "$cmd" ] || exit 0

at='(^|[;&|(])[[:space:]]*'
printf '%s' "$cmd" | grep -Eq "$at(gh[[:space:]]+pr[[:space:]]+create|pnpm[[:space:]]+issue:ship)" || exit 0

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
issue=$(git branch --show-current | sed -nE 's#^[a-z]+/[^/]+/([0-9]+)-.*#\1#p')
[ -n "$issue" ] || exit 0

snapshot=$(grep -lE "\"number\": $issue," data/workflows/projects/*.snapshot.json 2>/dev/null | head -n 1)
[ -n "$snapshot" ] || exit 0
diary="${snapshot%.snapshot.json}.diary.md"

git diff origin/master...HEAD -- "$diary" | grep -Eq "^\+- [0-9-]+ · estimate · #$issue " && exit 0

echo "Blocked: #$issue is a ticket in a workflow project, and the PR that closes it closes its block." >&2
echo "Before opening the PR, commit on this branch:" >&2
echo "  - an \`estimate\` line for #$issue in $diary, plus any correction the owner made" >&2
echo "  - \`pnpm workflow:sync <id>\` for $snapshot" >&2
echo "  - any unfiled block whose text the work proved wrong, reworded in the project yaml" >&2
exit 2
