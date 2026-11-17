# 🌱 First hour in this repo

An ordered way in for someone who's never seen the repo.

## 1. Set up

```sh
pnpm install
pnpm quick-start   # installs the git hooks — skip it and no commit or push gate ever fires
```

## 2. Read the shape

1. The [root README](../../README.md): the workspace layout and the boundaries table.
2. The [root `CLAUDE.md`](../../CLAUDE.md)'s "looks reasonable and is wrong here" list. Written for
   agents, but it's the quickest list of mistakes already made once.
3. [`boundaries.md`](../concepts/boundaries.md), before touching a second project.

## 3. Go to your project

Its own `README.md` and `CLAUDE.md` are the source of truth from here.

## 4. Make a change

`pnpm issue:pick` gives you a branch for an issue. Read
[change-lifecycle.md](./change-lifecycle.md) once before your first push: several steps rewrite
or block things silently.
