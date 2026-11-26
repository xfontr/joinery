#!/bin/sh
# The root CLAUDE.md states these rules in prose, which works right up until an agent edits one file
# and not its pair. Each check below maps to a rule that is already written down and has already been
# broken at least once.
#
# Exit 2 puts the message on stderr and back into the model's context. Every other path exits 0 —
# a reminder that blocks unrelated edits gets turned off within a day.

command -v jq >/dev/null 2>&1 || exit 0

file=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)
[ -n "$file" ] || exit 0

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
rel=${file#"$root"/}

# The readable tag table is rendered from this file, and an unrendered change only fails in CI
if [ "$rel" = "packages/configs/src/eslint/lib/boundaries.ts" ]; then
    echo "boundaries.ts is the enforced copy of the Nx tag table. Run \`pnpm docs:map\` to" >&2
    echo "re-render the readable copy in README.md before moving on." >&2
    exit 2
fi

# A package.json git has never seen means a new project, and new-package's step 5 is the one skipped
case "$rel" in
    packages/*/package.json|apps/*/package.json|infrastructure/*/package.json)
        if ! git -C "$root" ls-files --error-unmatch "$rel" >/dev/null 2>&1; then
            echo "$rel is a new project. Three things outside its directory have to agree:" >&2
            echo "  1. nx.tags in this package.json (one type: tag, one scope: tag)" >&2
            echo "  2. depConstraints in packages/configs/src/eslint/lib/boundaries.ts, plus the tag" >&2
            echo "     added to every consumer's onlyDependOnLibsWithTags" >&2
            echo "  3. a description here, then \`pnpm docs:map\` to render README.md's tables and layout" >&2
            exit 2
        fi
        ;;
    *) ;;
esac

# The types must match the diary table in docs/workflows/README.md.
# A catch-all type lets neutral lines back in.
case "$rel" in
    data/workflows/projects/*.diary.md)
        bad=$(grep -n '^- ' "$file" | grep -vE \
            -e '^[0-9]+:- [0-9]{4}-[0-9]{2}-[0-9]{2} · (estimate|worked|friction|map|rule) · .+')
        if [ -n "$bad" ]; then
            echo "$rel has lines outside the diary shape:" >&2
            echo "$bad" >&2
            echo "Shape: - YYYY-MM-DD · type · text, no time." >&2
            echo "Types: estimate, worked, friction, map, rule." >&2
            echo "Keep-test: a line says something in the workflow worked or went wrong." >&2
            echo "A line that reads as neither is deleted, not retyped." >&2
            echo "What the work found goes in the decision report or the commit." >&2
            echo "See docs/workflows/README.md#diary." >&2
            exit 2
        fi
        ;;
    *) ;;
esac

# The bans themselves live in one gate that pre-commit and CI also run.
case "$rel" in
    package.json|packages/*/package.json|apps/*/package.json|infrastructure/*/package.json)
        if ! report=$(cd "$root" && JOINERY_GIT_HOOK=1 pnpm --silent invariants:check --base=HEAD 2>&1); then
            echo "$report" >&2
            exit 2
        fi
        ;;
    *) ;;
esac

exit 0
