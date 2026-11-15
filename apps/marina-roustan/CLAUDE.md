# 🤖 @monorepo/marina-roustan

See [README.md](./README.md) for the commands, the env vars and the test harness.

- **The site's origin is a literal in [`nuxt.config.ts`](./nuxt.config.ts); every per-environment
  value, a CMS or vendor host included, and every secret is an env var with no default.** Declare
  the key empty and let the `NUXT_`-prefixed var fill it at startup, so one build runs in every
  environment. List one the feature can't work without under `requiredEnv`, and
  [`modules/requiredEnv.ts`](./modules/requiredEnv.ts) fails a production build naming it. Never
  re-check it per request. A new env var goes in `.env.example` with a row in the README table.
- **Local dev and e2e never read the live site.** A content source or vendor gets a fake in the
  repo before `pnpm dev` or a spec reads it.
- Typechecking runs on build (`typescript.typeCheck: "build"`), so `pnpm build` already covers what
  `pnpm typecheck` would.
- [`tsconfig.json`](./tsconfig.json) only references `./.nuxt/tsconfig.*.json`, which nothing
  commits, so `lint`/`typecheck`/`test` need the `nuxt-prepare` script — see
  [the root CLAUDE.md](../../CLAUDE.md#-the-two-places-that-must-agree).
- The ESLint config is the nuxt flavour, which is **not** type-checked. Don't switch it.
- **`vitest.config.ts` and `playwright.config.ts` are wrappers over `@monorepo/configs`.** Only this
  app's specifics are passed as options.
- [`e2e/server.ts`](./e2e/server.ts) stays a `node --import` preload even with nothing to fake: the
  preset's teardown fails the run when the server never recorded its console.
- [`app/pages/[...slug].vue`](./app/pages/[...slug].vue) answers every unmatched path with a 404.
  Without it Vue Router warns on the server for each one, and e2e fails on that log.
