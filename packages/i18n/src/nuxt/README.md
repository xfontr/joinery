# 🟢 @joinery/i18n/nuxt

The Nuxt integration for [`@joinery/i18n`](../../README.md). It installs and configures
`@nuxtjs/i18n`, registers a loader per locale, and serves messages through a cached route, so the TMS
URL and token never reach the browser.

## Usage

```ts
export default defineNuxtConfig({
    modules: ["@joinery/i18n/nuxt"],
    translations: {
        vendor: { name: "internal", project: "external", baseURL: "" },
    },
    i18n: {
        defaultLocale: "en-GB",
        locales: [{ code: "en-GB", name: "English (UK)" }, { code: "es-ES", name: "Spanish (ES)" }],
    },
});
```

Locales are declared under `i18n`; the module reads them (across layers) and derives the rest. Other
`i18n` settings stay yours.

### Options

- `translations.vendor` is a `VendorConfig` — see [vendors](../../README.md#vendors).
- Declare secret or per-environment fields empty and fill them with `NUXT_TRANSLATIONS_VENDOR_*`
  (`_BASE_URL`, `_PROJECT`, `_OPTIONS_TOKEN`). **Never read `process.env` in `nuxt.config`**: it's
  baked into the build, token included. `name` stays a literal.
- Don't set `translations.locales`; the module overwrites it.

## Structure

```
module.ts                          build time (@nuxt/kit)
config.ts                          shared by both halves: API path, cache window, config shape
runtime/locales/loader.ts          the @nuxtjs/i18n loader
runtime/server/translations.get.ts the cached route
```

`module.ts` and `runtime/` are separate runtimes: import across with `import type` only.

## The request path

```
$t("meta.title")
  → loader.ts → GET /api/translations/:locale   (cached 1 h, stale up to 24 h, bypassed in dev)
    → :locale must be declared, or 404
    → provider.getTranslations(locale)
        internal  GET :baseURL/:locale/:project
        tolgee    GET :baseURL/v2/projects/:project/translations/:locale  (X-API-Key)
```

The path and windows are constants in [`config.ts`](./config.ts); override the cache with a Nitro
route rule if needed. The cache key is the core's `translationsKey`.

## Gotchas

- **Don't add `@nuxtjs/i18n` to `modules` yourself.** This module installs it after registering the
  loader.
- **Set `i18n.defaultLocale`**, or every path is prefixed and `/` 404s. The module warns if it isn't
  among the declared locales.
- **`:locale` is case-sensitive.** `en-gb` 404s.
- An unknown `vendor.name` fails the build. Everything else is checked per request, since env vars
  replace it at boot: a missing value answers `500` naming it.
