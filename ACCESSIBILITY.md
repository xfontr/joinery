# ♿ Accessibility

Every app in this repository is built to be usable with a keyboard, a screen reader, a small screen
or any other way people read the web. If something in one of them stops you from reading or using
it, that is a bug here.

## Target

We work toward [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22) in every app that serves pages. It
is a goal, not a claim of verified conformance: no formal audit has been done.

## What we check

| Where | Check |
| --- | --- |
| CI | axe scans in each app's Playwright e2e specs fail on WCAG 2.1 A and AA violations, through [`a11y.ts`](./packages/configs/src/playwright/utils/a11y.ts) |
| Every UI change | A keyboard-only pass: logical tab order, visible focus, no trap |
| New components | A screen reader spot-check: names, roles, states, reading order |
| Content | Heading levels in order, descriptive link text, alt text on meaningful images |

What one app's audience needs beyond this list belongs in that app's README, not here.

## Reporting a barrier

[Open an accessibility issue](https://github.com/xfontr/joinery/issues/new?template=accessibility.yml)
with the page, what you were trying to do and, if you like, your browser and assistive technology.
Screenshots are optional, and you never have to explain why you use what you use.
