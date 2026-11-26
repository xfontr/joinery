# 🧮 interest

The interest calculator at `/calculo-intereses/`: simple interest at the legal, judicial or a custom
rate, with a table of results kept in the reader's browser. Its one rule: it costs no other page
anything.

| Built by |
| --- |
| AI, with no human supervision |

## Structure

| Path | What it is |
| --- | --- |
| [`interest-calculator.vue`](./app/pages/interest-calculator.vue) | The page: calculator, then the WordPress page `calculo-intereses` as its guide. Prerendered |
| [`InterestCalculator`](./app/components/InterestCalculator.vue) | *Sencilla* and *Avanzada* tabs over the private form, result and history parts. The only public component |
| [`useInterestHistory`](./app/composables/useInterestHistory.ts) | The table's rows in `localStorage`, read after mount |
| [`app/schemas/`](./app/schemas) | Valibot rules for both forms |
| [`app/utils/interest.ts`](./app/utils/interest.ts) | `calculateInterest` (cents, actual days, 365-day year), the rate presets and `parseDecimal` |

There is no `server/`: the arithmetic runs in the browser.

## The guide

The explanatory copy is a WordPress page, edited by the owner there. If WordPress fails, the
calculator still renders without it. `calculo-intereses` is in `pageSlugs` only so the page route
can read it.

## Cost to the rest of the site

- The footer link has `prefetch: false`, so other pages never fetch this route's chunk or payload.
- Its copy is ~0.8 kB brotli of the shared `messages.json`; its Tailwind utilities ~0.2 kB of the
  inlined stylesheet.

## Validation

- Nothing validates before the first submit — validating on blur moved the button out from under
  the pointer mid-click.
- Amounts are text inputs with `inputmode="decimal"`, never `type="number"`: Chrome read `1.000` as
  100. `parseDecimal` reads Spanish formatting and refuses ambiguous input like `1,000.50`.

## Known gaps

| Gap | Note |
| --- | --- |
| One rate for the whole period | The guide tells readers to split by year and sum in the table |
| No calendar picker | Typing is faster for dates years back; `UInputDate` is the one worth trying |
