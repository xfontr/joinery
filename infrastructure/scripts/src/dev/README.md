# 🚀 dev

`pnpm dev` asks which project to start and starts it. On a fresh clone it installs the workspace
first.

```sh
pnpm dev                   # pick from every project with a dev script
pnpm dev developer-portal  # skip the picker (the label "Developer Portal" works too)
pnpm dev huella            # not an exact name: opens the picker with "huella" typed
```

## 🗂 Structure

```
index.ts             installs if needed, then imports the rest dynamically
main.ts              the list, the picker, and handing over the terminal
adapters/nx.ts       which projects declare a dev target, and their layer
adapters/pnpm.ts     the install check, the install, the dev run
domain/projects.ts   rows, their order, and matching a typed name
```

## 📋 How it works

- The list is `nx show projects --with-target dev`, so a project appears by adding a `dev` script —
  nothing else to register. `@monorepo/scripts` itself is left out.
- Rows are apps first, then `infrastructure`, then `packages`, alphabetical within each, with the
  layer in the row (`Huella Legal · apps`). Labels come from the package name; `ACRONYMS` in
  [`projects.ts`](./domain/projects.ts) fixes words like `UI`.
- [`index.ts`](./index.ts) is the one entry that isn't the standard five lines: on a clone with no
  `node_modules`, a static import of the prompt library would crash before it could install.
- Ctrl+C stops the dev server and exits 0.
