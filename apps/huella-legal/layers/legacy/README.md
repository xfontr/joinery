# 🔀 legacy

301s from the old WordPress URLs that the app renamed, so indexed and linked URLs keep working, per
[0028](../../../../docs/decisions/0028-huella-legal-urls-and-cutover.md). It does nothing else.

## Structure

| Old URL | Goes to | Where |
| --- | --- | --- |
| `/categorias/`, `/Categoria/<slug>/` | `/areas/`, `/areas/<slug>/` | [`nuxt.config.ts`](./nuxt.config.ts) |
| `/Etiqueta/<slug>/` | `/etiquetas/<slug>/` | `nuxt.config.ts` |
| `/author/<slug>/` | `/colaboradores/<slug>/` | `nuxt.config.ts` |
| `/publicar-mi-articulo/` and its child | `/publicar/` | `nuxt.config.ts` |
| Its grandchild, the theses list | `/etiquetas/trabajos-de-fin-de-grado/` | `nuxt.config.ts` |
| `/noticias/`, `/page/<n>/` | `/publicaciones/` | `nuxt.config.ts` |
| `/comments/feed/` | `/feed/` | `nuxt.config.ts` |
| Yoast's four sitemaps | `/sitemap.xml` | `nuxt.config.ts` |
| `/empieza-aqui/` | `/sobre/` | `nuxt.config.ts` |
| `/recursos/`, `/chupitos-de-derecho/`, `/listado-de-preguntas-y-respuestas/` | `/publicaciones/` | `nuxt.config.ts` |
| `/recursos/conecta/`, `/consulta-legal-gratis/` | `/contacto/` | `nuxt.config.ts` |
| `/suscripcion/` | `/`, whose newsletter band replaced the form | `nuxt.config.ts` |
| `/?s=<term>` | `/buscar/?query=<term>` | [`legacy.ts`](./server/middleware/legacy.ts): a route rule can't match a query |
| `/wp-content/…`, `/wp-admin/…`, `/wp-login.php`, `/wp-json/…` | The same path on `content.vendor.baseURL` | `legacy.ts`: the WordPress host is runtime config |

Netlify serves the rules from `_redirects` before Nitro runs, so `nuxi preview` and
`e2e/legacy.spec.ts` only exercise Nitro's copy.

## The cutover

The `/wp-*` forward only does something once WordPress has its own hostname. The switch itself is
DNS and WordPress settings, in the order 0028 gives.

To check the deployed rules once, on a preview and then on production:

```sh
NITRO_PRESET=netlify pnpm exec nuxt build && grep -vE '\s301$' dist/_redirects  # prints nothing
curl -so /dev/null -w '%{http_code} %{redirect_url}\n' https://<host>/Categoria/<slug>/
```

## Known gaps

| Gap | Note |
| --- | --- |
| Old post bodies link to `www` by absolute URL | They resolve through one 301 |
| `/?p=<id>` renders the home page | Would need a map of every post ID |
| Deleting the layer | Once Search Console shows no traffic to old URLs — but move the `/wp-admin/` forward first; the footer relies on it |
