# 📦 @monorepo/configs

Shared ESLint, Vitest, Playwright and TypeScript presets. Every project's config file is a thin
wrapper over one of these, so a change here lands everywhere at once.

Raw TypeScript, tagged `type:config`: it depends on nothing in the workspace. `apps/huella-legal`
extends no tsconfig preset (it references Nuxt's generated ones), so a compiler option added here
doesn't reach it.

## Layout

One folder per tool under `src/`, each sorted the same way:

| Where | What it is | Who imports it |
| --- | --- | --- |
| Tool folder root | A preset | A project's config file |
| `setup/` | Wiring the preset hooks in itself | Nobody directly |
| `utils/` | A test helper | Specs, as `@monorepo/configs/<tool>/utils/<name>` |

ESLint has `lib/` (one file per concern, mapped in [`lib/README.md`](./src/eslint/lib/README.md))
and `rules/` (in-house `monorepo/*` rules, each with a `RuleTester` spec).

## Usage

```ts
import { eslint, vitest } from "@monorepo/configs";

export default eslint.createNodeConfig(); // or createVueConfig() / createNuxtConfig()
export default vitest.createNodeConfig(); // or createVueConfig(viteConfig) / createNuxtConfig({ root })
```

```json
{ "extends": "@monorepo/configs/tsconfig/node.json" }
```

`tsconfig/base.json` is strict plus `noUncheckedIndexedAccess`; every consumer extends `node.json`.

## Vitest

- Coverage runs on `test:coverage`, never `test`. A project needs `@vitest/coverage-v8` in its own
  `devDependencies`. `COVERAGE_THRESHOLDS=off` disables thresholds (the portal deploy sets it).
- **Any console output fails the test** ([`consoleGuard.ts`](./src/vitest/setup/consoleGuard.ts),
  [0032](../../docs/decisions/0032-console-output-policy.md)). Stub it with
  `vi.spyOn(console, "warn").mockImplementation(() => {})` and assert on the spy.
- [`prepareNuxt.mjs`](./src/vitest/setup/prepareNuxt.mjs) runs `nuxi prepare` when a Nuxt project
  has no `.nuxt` yet.
- This package's own `test:e2e` runs its `browser` Vitest project, the specs that launch
  Playwright; `test` and `test:coverage` leave them out.

### Nuxt apps

`createNuxtConfig({ root, nodeSpecs?, setupFiles?, coverageExclude?, thresholds? })` builds three
projects, each covering the app root and every `layers/*`:

| Project | Specs | Environment |
| --- | --- | --- |
| `node` | `server/`, `shared/`, `modules/`, `tools/`, plus `nodeSpecs` | Node, Nitro globals stubbed by [`stubs.ts`](./src/vitest/setup/stubs.ts) |
| `nuxt` | `app/` | One shared Nuxt environment, one file at a time |
| `nuxt-isolated` | `app/` specs that call `vi.mock`, `mockNuxtImport` or `mockComponent` | Isolated, files in parallel. Sorted automatically |

- In the shared `nuxt` project, a spec must restore anything global it changes (fake timers, stubbed
  globals, the DOM) in `afterEach`, or the next file breaks without naming the cause.
- Helpers: [`vitest/utils/nuxt`](./src/vitest/utils/nuxt.ts) (`withSetup`, `serveEndpoint`,
  `slotStub`) and [`vitest/utils/nitro`](./src/vitest/utils/nitro.ts) (`stubNitro()` before the
  dynamic `import()` of a server file).
- `@nuxt/test-utils` is resolved from the app, not this package; the app installs it with
  `@vue/test-utils` and `happy-dom`.
- The test boot builds into `node_modules/.cache/nuxt-vitest`, never `.nuxt`, and runs with
  `JITI_MODULE_CACHE=0`. Both prevent failures that take down every `nx` command.

## Playwright

```ts
export default playwright.createConfig({ port, command, env });
```

- Chromium at 390, 768 and 1280 px. Tag a test `@desktop` (≥ 1024 px), `@mobile` (below) or
  `@any-width` (first width only, for `request`/`<head>`-only tests). Tests run fully parallel, on
  two workers locally and Playwright's default in CI.
- Specs import `test` from `@monorepo/configs/playwright/utils/test`, never `@playwright/test`
  (lint enforces it). Any browser console output fails the test unless `allowedConsole` matches it;
  `page.goto` waits for hydration.
- The server preload calls `recordServerConsole()` from `@monorepo/configs/playwright/setup/server`,
  and teardown fails the run on anything the server logged.
- Helpers: [`utils/a11y`](./src/playwright/utils/a11y.ts) (`axeViolations`, asserted with `toEqual([])`) and
  [`utils/i18n`](./src/playwright/utils/i18n.ts) (`createT`, `rawKeysIn`).
- `@playwright/test` must stay a `catalog:` entry; a second resolved copy fails every spec.

## What the ESLint factories bundle

Every factory includes Prettier as a lint rule (100 columns, 4 spaces, double quotes), type-checked
`typescript-eslint` (not for Nuxt `.vue` files), `@nx/enforce-module-boundaries`, SonarJS, regexp
safety, and the house style rules: arrow functions, destructuring, `interface` over `type`,
helpers declared above use, no nested ternaries, no `await` in loops, sorted-with-comparator arrays,
no `console`, no raw-HTML sinks, and `eslint-disable` must give a reason. Vue configs add
`eslint-plugin-vue` and the `monorepo/*` template rules. Specs get `@vitest/eslint-plugin` and must
assert behaviour, not call order or `wrapper.vm`.

[`lib/README.md`](./src/eslint/lib/README.md) has the file for each. Opt-in pieces a project appends
after its factory:

| Export | Does | Used by |
| --- | --- | --- |
| `eslint.layerBoundaries({ cores, kit })` | Enforces Nuxt layer directions, auto-imports included | `huella-legal`, `developer-portal` |
| `eslint.routeMeta` | Every Nitro route has `defineRouteMeta` with `tags` and `summary` | `huella-legal` |
| `eslint.i18nKeys(localeGlob)` | Every static `t()` key exists | `huella-legal` |
| `eslint.tailwind(entryPoint)` | `better-tailwindcss` rules | Every app |
| `eslint.pureDomain` | No I/O, `process` or `adapters/` in `domain/` | `infrastructure/scripts` |

A rule for everyone goes in `lib/`; a rule for one flavour goes in its factory. The
`configs-new-rule` skill has the steps.
