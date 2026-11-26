# 🟢 @joinery/content/nuxt

The Nuxt integration for [`@joinery/content`](../../README.md): one config block gives server code a
cached `useContent(event)`. Nothing is reachable from the browser; an app exposes content through
its own routes.

## Usage

```ts
export default defineNuxtConfig({
    modules: ["@joinery/content/nuxt"],
    content: { vendor: { name: "wordpress", baseURL: "" } }, // filled from NUXT_CONTENT_VENDOR_BASE_URL
});
```

```ts
// server/api/articles/[slug].get.ts
export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug", { decode: true }) ?? "";
    return toArticle(await useContent(event).getEntry("posts", slug));
});
```

`useContent` is a Nitro auto-import, server-only. It returns `listEntries`, `getEntry`, `listTerms`
and `getTerm`, each cached, bounded and mapped to an HTTP status. Pass the event so a
stale-while-revalidate refresh reaches the platform's `waitUntil`.

### Options

| Option | What it is |
| --- | --- |
| `content.vendor` | A `VendorConfig` — see [vendors](../../README.md#vendors). Declare runtime values empty and fill them with `NUXT_CONTENT_VENDOR_*` |
| `content.cache` | `{ list, item }`, each `{ maxAge, swr }`. Pass both. Defaults in [`config.ts`](./config.ts) |

## Structure

```
module.ts                         build time (@nuxt/kit)
config.ts                         shared by both halves: cache windows, config shape
runtime/server/utils/useContent.ts  the four cached reads
runtime/server/utils/query.ts       query defaults and ceilings
```

`module.ts` and `runtime/` are separate runtimes: import across with `import type` only.

## Caching

| Read | `maxAge` | `swr` |
| --- | --- | --- |
| A list | 1 h | on |
| One document | 6 h | on |

- Keys come from the core's `contentKey`, over the normalised query, so `{}` and `{ page: 1 }` share
  an entry.
- The query is bounded before the cache, so a bad one throws without minting an entry.
- A failed read is never stored. A failed background refresh keeps serving the stale value
  indefinitely (Nitro ignores `staleMaxAge`).
- WordPress embeds media and terms (`_embed`), so a list is one upstream request.

## Gotchas

- **Router slugs arrive encoded.** Use `getRouterParam(event, "slug", { decode: true })` or accented
  slugs 404.
- **`body` and `excerpt` are HTML**; everything else is plain text.
- **Config is checked at read time**, since env vars replace it at boot. A misconfigured deploy
  answers `500` naming what's missing on every cache miss, with nothing logged at startup. The
  vendor name is also checked at build.

## Known gaps

| Gap | Note |
| --- | --- |
| No purge when the CMS changes | Nitro's cache is per instance; huella-legal rebuilds instead ([#236](https://github.com/xfontr/monorepo/issues/236)) |
