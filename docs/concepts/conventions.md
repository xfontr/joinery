# 📏 Naming and folder conventions

Where each kind of file lives and what it's called, across projects. A rule only one project follows
stays in that project's README.

## 🎯 Target names

Plugin-inferred targets are namespaced. Every project's `package.json` scripts publish the stable
names over them, and everything that runs a project calls only the stable names.

| Stable name | Delegates to | Called by |
| --- | --- | --- |
| `lint` | `nx eslint:lint`, from `@nx/eslint/plugin` | `pnpm lint`, CI, pre-push |
| `typecheck` | `tsc --noEmit`, or `nuxt typecheck` in a Nuxt app; never the `tsc:typecheck` or `vite:typecheck` the plugins infer | `pnpm typecheck`, CI, pre-push |
| `test` | `vitest . --watch=false` | `pnpm test`, CI, pre-push |
| `build` | Whatever the project actually deploys: `nx nuxt:build`, or `nx build-static` in [`developer-portal`](../../apps/developer-portal/CLAUDE.md) | `pnpm build`, CI |

[`nx.json`](../../nx.json) names every inferred target and hangs caching on the stable names, so
hooks, CI and `pnpm check` never need to know which tool a project uses.

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
| Page body | The template lists sections. A section with markup of its own and a name a person would use ("the hero", "the principles") is a component in `components/<page>/` of the page's layer (`home/Hero.vue` → `HomeHero`) and owns its band, container and padding. A layout wrapper around one component stays inline. The script holds route meta, data and SEO; derived state lives in the section that shows it. `vue/max-lines-per-block` caps a page at 60 template and 50 script lines | A page should read as its own outline. Extracting by name rather than by size keeps single-use wrappers like `CategoriesWrapper` out |
| View-model type | `shared/types/<Name>.ts`, PascalCase, one exported type per file. A constant a type derives from (`typeof KINDS[number]`) goes in `shared/constants.ts` | The file tree is the type index, and an import names exactly what it uses |
| Type a route answers with | In `shared/types/`, never exported from the route file | An `app/` file importing it from `server/api/` makes the browser bundle depend on a server route |
| Component in a layer | Never a bare name at the layer's `app/components/` root. A component there carries its layer's name, singular or plural (`NewsletterBand`, `WorkflowStageCards`), or sits in a folder naming what it belongs to and drops that prefix from the file (`article/Byline.vue` registers `ArticleByline`). Nuxt Content's `content/` overrides keep the names Nuxt Content looks for (`ProseA`) | A bare name says nothing about who owns it, and Nuxt collapses a repeated prefix where Storybook doesn't, so `article/ArticleByline.vue` would register under two names |
| Imports between and within layers | Per app: the [developer-portal README](../../apps/developer-portal/README.md#-layers) and the [huella-legal README](../../apps/huella-legal/README.md) | Each app resolves them differently, so neither rule generalises |

`infrastructure/scripts` is not a Nuxt app and keeps each type beside the function that produces
it, per [0004](../decisions/0004-scripts-architecture.md).
