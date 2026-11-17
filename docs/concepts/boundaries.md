# 🧱 Why the boundary system exists

Every project has one `type:*` and one `scope:*` tag in its `package.json`, and
[`boundaries.ts`](../../packages/configs/src/eslint/lib/boundaries.ts) turns them into lint rules.
The table itself is in the [root README](../../README.md#-architecture--boundaries); this page is
the reasoning behind it.

## 📐 Tags, not folders

A folder says where something lives; a tag says what it may import. `translations` (a service apps
call over HTTP) and `scripts` (tooling nothing imports) share `infrastructure/` but get different
tags, so neither can reach the other. Likewise `content`, `i18n` and `observability` all sit in
`packages/` and still can't import each other.

## 🔌 Why these tags

- `content` and `i18n` share `type:integration`: each wraps a vendor behind a port and a Nuxt
  module. A tag that doesn't list itself is a leaf, so they still can't import each other.
- `observability` keeps its own tag so a future feature package could use integrations without
  being allowed to import telemetry. Instrumentation stays the app's job.

## 🗺 Scopes

`scope:shared` may depend only on itself. Every other scope may depend on itself and
`scope:shared`, so one product's code can never be imported by another product.

## 🌱 No reserved rows

A tag gets its row with its first project, never before. Rows written ahead of time (`type:feature`,
`type:domain`) encoded guesses and were deleted.

## 🏷 Choosing a tag for a new project

Ask what it may legitimately import and what would break if something imported it back — not which
layer it feels like. The [`new-package`](../../.claude/skills/new-package/SKILL.md) skill has the
mechanical steps.
