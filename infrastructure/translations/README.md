# 🌐 @monorepo/translations

A small Hono server that serves the JSON locale files in this folder over HTTP: the `internal`
vendor of [`@monorepo/i18n`](../../packages/i18n/README.md). No app uses it today.

```
infrastructure/translations/
  projects/<project>/<locale>.json   ← the messages (hand-editable)
  server/                            ← the HTTP API over that JSON
  docker/                            ← image + compose for running it, locally or deployed
```

`projects/example/` is a stand-in the specs read. No API key.

## 📡 Endpoints

| Method | Path | Returns |
| ------ | ---- | ------- |
| `GET` | `/:locale/:project` | the locale's full message tree |
| `GET` | `/health` | `{"status":"ok"}` — liveness probe for the container |

```bash
curl http://localhost:4000/es-ES/example
```

The route above serves `projects/example/es-ES.json`. CORS is open. Unknown locale `404`, unsafe
path segment `400`, unreadable file `500`. A new locale is a new file here plus a declaration in the
app — see [adding a locale](../../docs/guides/adding-a-locale.md).

## 🐳 Run in Docker (recommended)

The [image](./docker/Dockerfile) is the deployable artifact: production dependencies only, non-root,
`restart: unless-stopped`. From this folder:

```bash
pnpm docker:up      # build + start in the background
pnpm docker:logs    # tail
pnpm docker:down    # stop and remove
```

Editing `projects/**/*.json` is live (bind-mounted, re-read per request). Editing `server/` needs
`pnpm docker:up` again, which rebuilds.

## 💻 Run directly

```bash
pnpm dev     # node --watch
pnpm serve   # no watch
# defaults to http://localhost:4000 — override with PORT
```

Not alongside the container: both want port 4000.

## ✅ Checks

Specs call `app.request()` and never bind a port. Tagged `type:infra`: depends only on
`@monorepo/configs`, and isn't versioned by `nx release`.
