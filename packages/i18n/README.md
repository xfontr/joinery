# 📦 @joinery/i18n

Translations client with an optional Nuxt module. Vendors: `internal` and `tolgee`.

| Import | Contains | Depends on |
| --- | --- | --- |
| `@joinery/i18n` | Domain, ports, adapters, vendor registry, cache key | `ofetch`, `ohash` |
| `@joinery/i18n/nuxt` | The Nuxt module — see [`src/nuxt/README.md`](./src/nuxt/README.md) | `@nuxt/kit`, `@nuxtjs/i18n`, `h3`, `nitropack` |
| `@joinery/i18n/testing` | `tolgeeHandlers(baseURL, translations)`, MSW handlers faking Tolgee | `msw` |

The second and third entries' dependencies are optional peers. The structure and the vendor
contract mirror [`@joinery/content`](../content/README.md); keep the two matching.

## Structure

```
src/core/domain/        Locale, TranslationMap, errors, vendor config — imports nothing
src/core/ports/         HttpClient and TranslationProvider
src/core/adapters/      OfetchHttpClient, InternalProvider, TolgeeProvider
src/core/registry.ts    vendor name → provider, and the config type
src/core/translationsKey.ts  the cache key
src/nuxt/               the Nuxt module
src/testing/            fake vendors for consumers' e2e
```

## Vendors

A vendor is one entry in [`core/registry.ts`](./src/core/registry.ts), which drives both the runtime
lookup and the config type. `options` holds credentials only, and is required when the provider
declares it, forbidden when it doesn't:

```ts
{ name: "internal", project: "external", baseURL }               // options not allowed
{ name: "tolgee", project: "1234", baseURL, options: { token } } // options required
```

Adding a vendor (the `i18n-new-vendor` skill walks it):

1. Write `core/adapters/providers/<Name>Provider.ts` extending `TranslationProvider`, overriding
   `getTranslations`. File, class and registry key share the name.
2. If it takes `options`, override `configProblems()` — see [validation](#validation).
3. Add one line to `providers`.

## The ports

```ts
interface HttpClient {
    get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>
}

abstract class TranslationProvider<T extends object = object> {
    abstract getTranslations(locale: Locale): Promise<TranslationMap>
    protected configProblems(): string[]
}
```

The generic is what the registry reads to make `options` required or forbidden. Every failed
request, including a `200` that isn't JSON, becomes an `UpstreamError`.

## Validation

A provider validates in its constructor: `project` non-empty, `baseURL` absolute, and the vendor's
`options` through `configProblems()` (`tolgee` needs a token). Every problem is reported at once in
one `MisconfiguredVendorError` (a `500`). It's hand-written rather than a schema library, since it
only checks a few strings whose shape the types already guarantee.

## Framework-agnostic use

```ts
const http = new OfetchHttpClient(ofetch.create({ baseURL }));
const provider = await createProvider({ name: "internal", project: "external", baseURL }, http);
const messages = await provider.getTranslations("en-GB");
```

The core doesn't cache. `translationsKey(vendor, locale)` is the identity to cache under: the vendor
config minus `options` (credentials aren't identity), hashed to word characters behind a readable
`vendor_locale_` prefix, because Nitro strips everything else from a key.

## Fake vendors

```ts
setupServer(...tolgeeHandlers(baseURL, { "es-ES": messages })).listen();
```

Serves `GET <baseURL>/v2/projects/:project/translations/:locale`, and a `404` for a locale it wasn't
given. There's no fake for `internal`; run the real server instead.

## Errors

All extend `TranslationsError` and carry their own `statusCode`.

| Error | Status | Raised when |
| --- | --- | --- |
| `UndefinedLocaleError` | 404 | No locale, or one the consumer never declared |
| `UndefinedVendorError` | 500 | Config names an unregistered vendor |
| `MisconfiguredVendorError` | 500 | The vendor's config can't work; `problems` lists why |
| `UndefinedLocaleProviderError` | 500 | The vendor doesn't hold a locale the config claims |
| `UpstreamError` | 502 | The vendor failed. Always 502: the locale is checked first, so no upstream answer is the caller's fault |
| `TranslationsUnavailableError` | 502 | Any other read failure, such as a mapping bug |

## Known gaps

| Gap | Note |
| --- | --- |
| No locale fallback or local overrides | Add a service over the port when there's behaviour to put in it |
| Vendor plumbing duplicated with `@joinery/content` | Deliberate until a third consumer ([D2](../../docs/audits/2026-10-21-monorepo.md)) |
