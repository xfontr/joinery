#!/bin/sh
# PR runs check only affected projects, so master's own runs were red for two days unseen (#494).
# Exit 2 blocks the call and hands the message to the model.

command -v jq >/dev/null 2>&1 || exit 0
command -v gh >/dev/null 2>&1 || exit 0

cmd=$(jq -r '.tool_input.command // empty' 2>/dev/null)
[ -n "$cmd" ] || exit 0

at='(^|[;&|(])[[:space:]]*'
printf '%s' "$cmd" | grep -Eq "$at(gh[[:space:]]+pr[[:space:]]+create|pnpm[[:space:]]+issue:ship)" || exit 0

# GitHub unreachable fails open: the hook guards a habit, not access.
last=$(gh run list --branch master --workflow CI --event push --status completed --limit 1 \
    --json conclusion,url --jq '.[0] | "\(.conclusion) \(.url)"' 2>/dev/null) || exit 0

case "$last" in
failure*)
    echo "Blocked: master's last CI run failed (${last#failure }), so this PR would ship on red." >&2
    echo "Fix master first, or tell the user and let them decide." >&2
    exit 2
    ;;
esac
exit 0
