# 🔖 Benchmarks

Sites analysed as design references, one file per site, so a later benchmark starts from what's
already been studied instead of re-capturing it. The `benchmark` skill reads and writes them.

The portal's Benchmarks page, under Design, shows them as a gallery. An entry describes the site,
not a verdict for one project. What a project takes from it belongs
in that project's decision report, such as [0039](../decisions/0039-developer-portal-benchmark.md).

## 🗂 Structure

One file per site, named after its URL in kebab case: `linear-app-method.md` for
`linear.app/method`. Copy [`TEMPLATE.md`](./TEMPLATE.md).

The frontmatter is the index. The page opens with the verdict in one line, a first-screen
screenshot in [`images/`](./images/) and a row with the link, fonts and colours. Then a short
critical essay: what the site is trying to do, what works and why, what fails and why, ending with
one **Take** and **Leave** line. A
measured value belongs in a sentence that argues something. A list of what's on screen is not an
entry.

| Field | Holds |
| --- | --- |
| `url` | The page analysed, usually the home page |
| `kind` | One value from **Kinds** |
| `page-types` | Every value from **Page types** the site has a strong example of |
| `traits` | Values from **Traits** |
| `verdict` | `strong`: worth studying whole; `partial`: one or two ideas worth taking; `avoid`: kept to show what not to do |
| `used-for` | The projects whose benchmark drew on it, by folder name, e.g. `developer-portal` |
| `analysed` | The date of the captures. Older than six months, re-check the site before relying on it |

## 🏷 Vocabulary

Values come from these lists only. A new value is added here first.

| Kinds | |
| --- | --- |
| `portfolio` | One person's work |
| `studio` | An agency or practice selling its work |
| `product` | A company selling a product |
| `design-system` | A design system's docs site |
| `editorial` | A publication, report, library or long read |

| Page types | |
| --- | --- |
| `landing` | A front page |
| `collection` | An index of items: projects, posts, resources |
| `table` | Dense rows and columns |
| `docs` | Long reference with navigation |
| `chart` | Data visualisation |
| `case-study` | One project told in depth |
| `dashboard` | A home of panels, stats and short lists, read at a glance |
| `detail` | One item's page with tabs: a repo, a package, a project |

| Traits | |
| --- | --- |
| `dark`, `light` | The paper |
| `serif-display` | A serif carries the headlines |
| `mono-labels` | A monospace sets labels, IDs or numbers |
| `one-accent` | One colour beyond paper and ink, or none |
| `index-rows` | Collections as numbered rows, not cards |
| `code-figure` | ASCII, dot-matrix or other code-native imagery |
| `photo-led` | Photography carries the page |
| `motion-led` | Content depends on motion, WebGL or interaction |

## 🔍 Finding entries

The frontmatter is the index, so `grep` it:

```sh
grep -l "page-types:.*table" docs/benchmarks/*.md
grep -l "used-for:.*developer-portal" docs/benchmarks/*.md
```

Screenshots are dated by `analysed`: the live site may have moved on since.
