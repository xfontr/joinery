# 🎨 brand

Reads a live site's brand from the browser's computed styles, so a rebuild's tokens start from what
the site actually renders rather than from a design-tool sheet made outside git. Then it checks the
tokens that came out of it: every text role on every surface role, as WCAG contrast ratios.

```sh
pnpm brand:extract https://marinaroustan.com/ https://marinaroustan.com/servicios/
pnpm brand:contrast apps/marina-roustan/layers/design/app/assets/main.css
```

| Command | Prints | Exits 1 when |
| --- | --- | --- |
| `brand:extract <url>…` | The brand table (Paper, Ink, Primary, Accent, Type, Tone), a 50–950 ramp for each of the four colours, the type scale per tag, the control radii and the twelve most-painted colours | No URL, a URL that isn't http(s), or no page answered 2xx |
| `brand:contrast <path>` | A `Role \| Token \| Surface \| Ratio` table, ready for the app's `DESIGN.md` | No path, no `--ui-text-*` or `--ui-bg-*` role, a role that points at an undefined variable or a cycle, or any pair below 4.5:1 |

`extract` needs Chromium (`pnpm exec playwright install chromium`, once) and loads each page at
1280 × 800. Tone is always `—`: a person judges it. `contrast` is offline. Every pair is held to
4.5:1, light theme only.

## 🗂 Structure

```
index.ts              hands { contrast, extract } to run()
extract.ts            the URLs, the sampling, and printing every table
contrast.ts           one stylesheet in, the contrast table out, exit 1 below 4.5:1
adapters/browser.ts   Playwright Chromium: every visible element's computed colour, font and radius
adapters/files.ts     a stylesheet's top-level @theme and :root custom properties, via postcss
domain/brand.ts       picking paper, ink, primary and accent from the samples, and the tables
domain/ramp.ts        a 50–950 OKLCH ramp that keeps the anchor hex at its nearest step
domain/contrast.ts    resolving var() chains, pairing roles, WCAG ratios
```

## 🔎 How the brand is picked

| Ingredient | Rule | Why |
| --- | --- | --- |
| Paper | The opaque background covering the most area | The first element sampled is usually a header bar |
| Ink | The colour of the most characters outside links and headings | A link colour can carry more characters on a link-heavy page |
| Primary | The most-used link or button colour, text or fill, other than ink and paper | A white button label is not a brand colour |
| Accent | The most-painted colour with OKLCH chroma above 0.04 that isn't paper, primary or ink | A grey hairline or border covers more area than any brand colour |

The ramp borrows the lightness of Tailwind's `neutral` steps and tapers the anchor's chroma toward
50 and 950, so a generated palette steps like Tailwind's own and the live colour survives unchanged
at its step ([`ramp.ts`](./domain/ramp.ts)).
