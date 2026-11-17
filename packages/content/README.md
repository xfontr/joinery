# 📦 @monorepo/content

A vendor-neutral client for CMS entries and taxonomies: a framework-agnostic core plus an optional
Nuxt module that gives server code a cached reader. WordPress is the only vendor today.

| Import | Contains | Depends on |
| --- | --- | --- |
| `@monorepo/content` | Domain, ports, adapters, vendor registry, cache key | `ofetch`, `ohash`, `entities` |
| `@monorepo/content/nuxt` | The Nuxt module — see [`src/nuxt/README.md`](./src/nuxt/README.md) | `@nuxt/kit`, `h3`, `nitropack` |
| `@monorepo/content/testing` | Seeded fakes and MSW WordPress handlers — see [🧪 Fake vendors](#-fake-vendors) | `msw`, `@faker-js/faker` |

The second and third entries' dependencies are optional peers, so a plain consumer of the core
installs none of them.

## 🗂 Structure

```
src/core/domain/      Entry, Term, Page, errors, vendor config — imports nothing
src/core/ports/       HttpClient and ContentProvider
src/core/adapters/    OfetchHttpClient, and one folder per vendor under providers/
src/core/registry.ts  vendor name → provider, and the config type
src/core/contentKey.ts  the cache key
src/nuxt/             the Nuxt module
src/testing/          fakes for consumers' specs and e2e
```

Nothing under `core/` may import Nuxt or Nitro; lint enforces it.

## 📄 The domain

```ts
interface Entry  { id, slug, title, excerpt?, body, wordCount?, publishedAt?, updatedAt?, image?, terms, authors, seo?, fields? }
interface Term   { id, resource, slug, name, description?, seo? }
interface Author { id, slug, name, bio?, avatar? }
interface Page<T> { items, page, perPage, total, totalPages }
```

| Family | Resources | Read with |
| --- | --- | --- |
| Entries | `posts`, `pages` | `listEntries`, `getEntry` |
| Terms | `categories`, `tags` | `listTerms`, `getTerm` |

- `body` and `excerpt` are HTML (`{ format: "html", value }`). **Every other string is plain text**,
  already decoded.
- `seo` comes from Yoast, `avatar` from Simple Local Avatars, `fields` from ACF — each unset when the
  plugin isn't installed. `fields` is unvalidated.
- Ids are always strings.
- `MAX_PAGE`, `MAX_PER_PAGE` and `MAX_SEARCH_LENGTH` bound any query forwarded from a request, so the
  cache key space stays finite.

## 🏷 Vendors

A vendor is one entry in [`core/registry.ts`](./src/core/registry.ts), which drives both the runtime
lookup and the config type. `baseURL` holds whatever picks the document; `options` holds credentials
only, and is required when the provider declares it, forbidden when it doesn't:

```ts
{ name: "wordpress", baseURL }                       // options not allowed
{ name: "contentful", baseURL, options: { token } }  // a vendor with credentials
```

Adding a vendor (the `content-new-vendor` skill walks it):

1. Write `core/adapters/providers/<name>/<Name>Provider.ts` extending `ContentProvider` (or
   `ContentProvider<YourOptions>`), overriding `listEntries` and `listTerms`. Directory, file, class
   and registry key share the name. Helpers and wire types go in siblings —
   [`wordpress/`](./src/core/adapters/providers/wordpress) is the example.
2. If it takes `options`, override `configProblems()` — see [validation](#-validation).
3. Add one line to `providers`.
4. Override `getEntry` / `getTerm` only if the vendor has a single-document endpoint.

The import is lazy, so a deployment ships only the vendor it configured.

## 🔌 The ports

```ts
interface HttpClient {
    get<T>(url: string, options?: RequestOptions): Promise<HttpResponse<T>>
}

abstract class ContentProvider<T extends object = object> {
    abstract listEntries(resource, query?): Promise<Page<Entry>>
    abstract listTerms(resource, query?): Promise<Page<Term>>
    protected configProblems(): string[]
    getEntry(resource, slug): Promise<Entry>   // a one-item list unless overridden
    getTerm(resource, slug): Promise<Term>
}
```

- A provider knows its vendor's URLs but does no I/O itself; the consumer injects the client.
- `url` is relative to the client's `baseURL`. `HttpResponse` exposes headers, since vendors
  paginate there.
- Every failed request becomes an `UpstreamError`, including a `200` that isn't JSON (a bot filter's
  HTML challenge page).

## ✅ Validation

A provider validates its config in its constructor, so it can't exist misconfigured. `baseURL` must
be an absolute URL; `configProblems()` checks the vendor's `options`. All problems are reported at
once in one `MisconfiguredVendorError` (a `500`).

`configProblems()` runs from the base constructor, so an override may only read `options` — a
subclass's own fields aren't initialised yet.

## 🧩 Framework-agnostic use

```ts
const http = new OfetchHttpClient(ofetch.create({ baseURL }));
const provider = await createProvider({ name: "wordpress", baseURL }, http);
const page = await provider.listEntries("posts", { perPage: 6 });
```

The core doesn't cache. It provides `contentKey(vendor, resource, query)`, the identity of an
upstream document: the vendor config minus `options` (credentials aren't identity), plus the sorted
query, hashed to word characters only because Nitro's storage splits keys on `/`, `:` and `?`.

## 🧪 Fake vendors

```ts
import { fakeEntry, fakeTerm, wordpressHandlers } from "@monorepo/content/testing";

const entry = fakeEntry({ terms: [fakeTerm({ slug: "derecho-penal" })] });
setupServer(...wordpressHandlers(baseURL, { posts: [entry] })).listen();
```

| Export | Gives |
| --- | --- |
| `wordpressHandlers(baseURL, content)` | MSW handlers for `/wp-json/wp/v2/:resource`: slug, term, search and paging filters, WordPress's headers and error codes |
| `fakeEntry`, `fakeTerm`, `fakeAuthor`, `fakeAsset` | Domain values; pass only the fields a spec asserts on |
| `faker` | The seeded Spanish `faker` instance, for any other value |

The faker is seeded, so values are stable — but adding a call shifts every value after it. Use the
exported `faker`, not your own import. [`wordpress.spec.ts`](./src/testing/wordpress.spec.ts) runs
the real provider against the handlers so the fake can't drift.

## ⚠️ Errors

All extend `ContentError` and carry their own `statusCode`. `statusMessage` never includes the
vendor's URL; the real failure is on `cause`, and logging it is the app's job.

| Error | Status | Raised when |
| --- | --- | --- |
| `MalformedQueryError` | 400 | A query parameter is unparseable or out of range |
| `UndefinedResourceError` | 404 | The resource or taxonomy doesn't exist |
| `NotFoundError` | 404 | Nothing under that slug |
| `PageNotFoundError` | 404 | A page past the last one |
| `UpstreamError` | 400 / 404 / 502 | The vendor failed. Only 400 and 404 are relayed; an upstream 401/403 means our credentials are wrong, so it's a 502 |
| `ContentUnavailableError` | 502 | Any other read failure, including a mapping bug |
| `UndefinedVendorError` | 500 | Config names an unregistered vendor |
| `MisconfiguredVendorError` | 500 | The vendor's config can't work; `problems` lists why |

## 🧭 Known gaps

| Gap | Note |
| --- | --- |
| No timeout or retry | A slow vendor holds an SSR request open. ofetch supports both |
| Lists fetch every body | ~53 KB per post when a listing needs only `wordCount` |
| No sanitising of `body` | Fine while the CMS is first-party |
| No locale axis | Adding one later must touch the query, the cache key and the Nuxt reader together |
| Vendor plumbing duplicated with `@monorepo/i18n` | Deliberate until a third consumer ([D2](../../docs/audits/2026-10-21-monorepo.md)) |
