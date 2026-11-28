# 🤖 @joinery/alba-tomico

See [README.md](./README.md) for the commands, the env vars and the test harness.

- **The port is pixel-perfect.** A change to how a page looks is an exception the owner approved,
  not a cleanup; the old site's source is the reference until the visual baseline exists.
- **Every per-environment value and every secret is an env var with no default**, ImageKit's
  private key included, which never reaches the browser. Declare the key empty and let the
  `NUXT_`-prefixed var fill it at startup; list one a feature can't work without under
  `requiredEnv`, and [`modules/requiredEnv.ts`](./modules/requiredEnv.ts) fails a production build
  naming it. A new env var goes in `.env.example` with a row in the README table.
- **Local dev and e2e never read the live ImageKit account.** A content source gets a fake in the
  repo before `pnpm dev` or a spec reads it.
- **No UI copy is hard-coded.** It goes in [`i18n/locales/en.json`](./i18n/locales/en.json) and the
  component calls `t()`.
- **Colour, type size, spacing and z-index reach a component only as tokens**: colour through Nuxt
  UI's `--ui-*` roles, the rest through the `--text-*`, `--spacing-*` and `--z-index-*` tokens in
  [`layers/design/app/assets/main.css`](./layers/design/app/assets/main.css).
  `no-restricted-classes` in [`eslint.config.ts`](./eslint.config.ts) rejects everything else. A
  token change re-runs `pnpm brand:contrast apps/alba-tomico/layers/design/app/assets/main.css`
  and pastes its table into [`DESIGN.md`](./DESIGN.md).
- Typechecking runs on build (`typescript.typeCheck: "build"`), so `pnpm build` already covers what
  `pnpm typecheck` would.
- [`tsconfig.json`](./tsconfig.json) only references `./.nuxt/tsconfig.*.json`, which nothing
  commits, so `lint`/`typecheck`/`test` need the `nuxt-prepare` script — see
  [the root CLAUDE.md](../../CLAUDE.md#the-two-places-that-must-agree).
- The ESLint config is the nuxt flavour, which is **not** type-checked. Don't switch it.
- **`vitest.config.ts` and `playwright.config.ts` are wrappers over `@joinery/configs`.** Only this
  app's specifics are passed as options.
- [`e2e/server.ts`](./e2e/server.ts) stays a `node --import` preload even with nothing to fake: the
  preset's teardown fails the run when the server never recorded its console.
- [`app/pages/[...slug].vue`](./app/pages/[...slug].vue) answers every unmatched path with a 404.
  Without it Vue Router warns on the server for each one, and e2e fails on that log.
