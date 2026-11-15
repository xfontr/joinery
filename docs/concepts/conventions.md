# 📏 Naming and folder conventions

One convention per kind of file, so a contributor moving between projects can predict where
something lives and what it is called before opening the tree. Each row says where the rule comes
from and what breaks without it. A rule only one project follows stays in that project's README and
is linked from here, under the [ownership rule](./README.md) every concept doc follows.

## 🎯 Target names

Plugin-inferred targets are namespaced. Every project's `package.json` scripts publish the stable
names over them, and everything that runs a project calls only the stable names.

| Stable name | Delegates to | Called by |
| --- | --- | --- |
| `lint` | `nx eslint:lint`, from `@nx/eslint/plugin` | `pnpm lint`, CI, pre-push |
| `typecheck` | `tsc --noEmit`, or `nuxt typecheck` in a Nuxt app; never the `tsc:typecheck` or `vite:typecheck` the plugins infer | `pnpm typecheck`, CI, pre-push |
| `test` | `vitest . --watch=false` | `pnpm test`, CI, pre-push |
| `build` | Whatever the project actually deploys: `nx nuxt:build`, or `nx build-static` in [`developer-portal`](../../apps/developer-portal/CLAUDE.md) | `pnpm build`, CI |

The two names never collide because the [`nx.json`](../../nx.json) `plugins` block sets every
inferred target's name, and `targetDefaults` hangs caching and the `nuxt-prepare` edge on the stable
names alone. A project whose build is not the plugin's picks it in its own script, so
nothing upstream needs to know which one it is. Dropping the aliases would mean renaming every
`targetDefaults` key, CI job, hook and `pnpm check` call to a target that differs per project.

## 📦 Package manifests

| Rule | Why |
| --- | --- |
| Every project is `"private": true` | Nothing is published: the **Release** workflow runs `nx release --skip-publish`. `nx release` still versions and tags a private package from its commits, as `@monorepo/configs` shows, so the flag only stops an `npm publish` from working by accident |
| The directory name is the package name, `@monorepo/<dirname>` | The [`new-package`](../../.claude/skills/new-package/SKILL.md) skill has the rest of the manifest |
| Release tags are `@monorepo/<name>@<version>` | `nx release` derives the next version from the last one, per [versioning](./versioning.md) |

## 🧩 Nuxt apps

| Kind of file | Convention | Why |
| --- | --- | --- |
| Page | Named in English after its route (`authors/[slug].vue` for `author`), with the URL in `definePageMeta`'s `path` in whatever language the site speaks | Links go by route name, which is English, so the file reads the same in the tree and in a link, and moving a URL is one edit in one page rather than a rename |
| View-model type | `shared/types/<Name>.ts`, PascalCase, one exported type per file. A constant a type derives from (`typeof KINDS[number]`) goes in `shared/constants.ts` | The file tree is the type index, and an import names exactly what it uses |
| Type a route answers with | In `shared/types/`, never exported from the route file | An `app/` file importing it from `server/api/` makes the browser bundle depend on a server route |
| Component in a layer | Never a bare name at the layer's `app/components/` root. A component there carries its layer's name, singular or plural (`NewsletterBand`, `WorkflowStageCards`), or sits in a folder naming what it belongs to and drops that prefix from the file (`article/Byline.vue` registers `ArticleByline`). Nuxt Content's `content/` overrides keep the names Nuxt Content looks for (`ProseA`) | A bare name says nothing about who owns it, and Nuxt collapses a repeated prefix where Storybook doesn't, so `article/ArticleByline.vue` would register under two names |
| Imports between and within layers | Per app: the [developer-portal README](../../apps/developer-portal/README.md#-layers) and the [huella-legal README](../../apps/huella-legal/README.md) | Each app resolves them differently, so neither rule generalises |

`infrastructure/scripts` is not a Nuxt app and keeps each type beside the function that produces
it, per [0004](../decisions/0004-scripts-architecture.md).

## 🧭 Deliberately deferred

| Later need | What changes |
| --- | --- |
| Nothing enforces the component, page or route-type rules | A `monorepo/*` lint rule through the [`configs-new-rule`](../../.claude/skills/configs-new-rule/SKILL.md) skill, once a second violation shows the rules are drifting |
