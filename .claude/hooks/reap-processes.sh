#!/bin/sh
# Stops the dev servers and e2e runs this session started, which otherwise outlive it by hours.
# Only descendants of this session's claude process are touched, so other sessions keep theirs.

session=$PPID
while [ "${session:-1}" -gt 1 ]; do
    case "$(ps -o comm= -p "$session")" in
        *claude) break ;;
        *) ;;
    esac
    session=$(ps -o ppid= -p "$session" | tr -d ' ')
done
[ "${session:-1}" -gt 1 ] || exit 0

ps -axo pid=,ppid=,command= | awk -v root="$session" '
    { parent[$1] = $2; pid = $1; $1 = ""; $2 = ""; command[pid] = $0 }
    END {
        for (pid in parent) {
            hit = 0
            for (at = pid; at > 1 && at != root; at = parent[at])
                if (command[at] ~ /nux[ti](\.mjs)? dev|playwright(\/test\/cli\.js)? test/) hit = 1
            if (hit && at == root) print pid
        }
    }' | xargs kill 2>/dev/null

exit 0
