#!/bin/sh
# ship-issue agents run unattended, so reaching a real system or rewriting shared history is refused
# here rather than trusted to a prompt. Exit 2 blocks the call and hands the message to the model.

command -v jq >/dev/null 2>&1 || exit 0

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
[ -n "$cmd" ] || exit 0

block() {
    echo "Blocked: $1" >&2
    echo "Ask the user to run it themselves if it's really needed." >&2
    exit 2
}

# Anchored to where a command starts, so a heredoc or a message that only mentions one passes
at='(^|[;&|(])[[:space:]]*'

matches() {
    pattern=$1
    printf '%s' "$cmd" | grep -Eq "$at$pattern"
}

runner='(npx[[:space:]]+|pnpm[[:space:]]+(exec[[:space:]]+|dlx[[:space:]]+)?)?'

if matches 'pnpm[^;&|]*[[:space:]](run[[:space:]]+)?start([[:space:];&|)]|$)' ||
    matches "${runner}nux[ti][[:space:]]+preview"; then
    block "a production server reads real credentials and talks to real vendors; use dev mode."
fi

push='git[[:space:]]+push[^;&|]*'

if matches "$push[[:space:]](-f|--force|--force-with-lease)([=[:space:]]|\$)"; then
    block "force-pushing rewrites history other runs may have built on."
fi

if matches "$push[[:space:]:]master([[:space:];&|]|\$)"; then
    block "master only moves through a merged PR."
fi

if matches '(curl|wget|xh|http)[[:space:]].*(huellalegal\.com|/wp-json)' ||
    matches 'node[[:space:]].*fetch\(.*(huellalegal\.com|/wp-json)'; then
    writes='(-X|--request|-d|--data|-F|--form|-T|--upload|-u[[:space:]]|--user|[Aa]uthorization|--json|--post|POST|PUT|PATCH|DELETE|method)'
    mode=$(printf '%s' "$input" | jq -r '.permission_mode // empty')
    agent=$(printf '%s' "$input" | jq -r '.agent_id // empty')
    # Docs don't say whether `ask` still prompts under bypass or inside a subagent, so those block.
    if printf '%s' "$cmd" | grep -Eq "$writes" || [ -n "$agent" ] ||
        [ "$mode" = bypassPermissions ] || [ "$mode" = dontAsk ]; then
        block "requests to the live WordPress site; use the fixtures and fakes instead."
    fi
    jq -n '{hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "ask",
        permissionDecisionReason: "A read-only request to the live WordPress site: only the owner can approve it."
    }}'
    exit 0
fi

exit 0
