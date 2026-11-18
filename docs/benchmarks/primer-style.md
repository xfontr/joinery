---
url: https://primer.style
kind: design-system
page-types: [landing, docs, table, chart]
traits: [light, one-accent]
verdict: partial
used-for: [developer-portal]
analysed: 2026-11-17
---

# 🔖 Primer

**Take one thing.** Take the component docs; ignore the home page.

![Primer, first screen at 1280 px](./images/primer-style.webp)

| Site | Fonts | Colours |
| --- | --- | --- |
| [primer.style](https://primer.style) | Mona Sans | `#f6f8fa`, white, blue `#0055d5` |

GitHub's design system docs. The home page is the weakest thing here: a pale grid of rounded cards,
gradient blobs and "Learn more ›" links, the same shape as nearly every design-system home since
Material. If you only looked at the first screen you'd dismiss it, and you'd miss the reason it's
in this library.

The component pages are excellent. The DataTable page shows a working table, then the code that
made it, then the next variant, then the next. When it states a rule, such as right-aligning
numeric columns, the rule sits right above a live table that follows it. That's documentation that
teaches by showing the thing working, not by describing it. The structure around it is just as
deliberate: a sidebar with search, a breadcrumb, and tabs for Overview, Guidelines and
Accessibility. Accessibility gets a tab of its own instead of a paragraph at the bottom, which says
something about the team's priorities.

The guidelines tab is where the rules are. Numeric columns are right-aligned with tabular figures.
Empty cells are left blank by default. Loading rows use skeletons the size of the real content.
Truncation is a last resort, with the full value in a tooltip. The data-visualisation pattern is just
as strict. There's no legend for a single series, and direct labels beat a legend for several. Axis
text must reach 4.5:1 and the axis line 3:1. A second line must differ by stroke style, not only
colour. Most chart types should let the reader see the data as a table and download it as CSV.
Primer supports bar, line, area and progress bars, and says outright that new donuts and sparklines
aren't supported.

Visually it's competent and characterless. It uses Mona Sans for everything, in nine sizes, with
GitHub blue for links on near-white. Nothing is wrong, and nothing is memorable either. It's a
reference for how to organise dense technical material, not for how a site should look.

**Take:** the docs anatomy (sidebar, one column, tables allowed full width); a live example above
its code; rules shown next to the thing they govern; the table and chart rules as a checklist.
**Leave:** the card-grid home page.
