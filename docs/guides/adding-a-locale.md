# 🌍 Adding a locale

For an app on [`@monorepo/i18n`](../../packages/i18n/README.md) with the `internal` vendor. Two files
in two projects; skipping either fails quietly.

## 1. Add the messages

```
infrastructure/translations/projects/<project>/<locale>.json
```

Hand-edited JSON, served as-is and re-read per request
([translations README](../../infrastructure/translations/README.md)).

## 2. Declare it in the app

```ts
// apps/<app>/nuxt.config.ts
i18n: { locales: ["en-GB", "es-ES", "<new-locale>"], defaultLocale: "en-GB" }
```

The i18n module reads this list (across layers) for both `@nuxtjs/i18n` and the server route. There's
no other list; `Locale` is just `string`.

## If you skip one

| Skipped | What happens |
| --- | --- |
| Step 2 | The file is never served: nothing registers the locale |
| Step 1 | Builds fine; the first request for that locale gets a vendor 404 (see the [errors](../../packages/i18n/README.md#errors)) |
