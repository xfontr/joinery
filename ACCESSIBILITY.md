# ♿ Accessibility

Huella Legal is read by students and general readers, many on a phone and some with assistive
technology. If something on the site stops you from reading or using it, that is a bug here.

## Target

We work toward [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22). It is a goal, not a claim of
verified conformance: no formal audit has been done.

## What we check

| Where | Check |
| --- | --- |
| CI | axe scans in the Playwright e2e specs fail on WCAG AA violations |
| Every UI change | A keyboard-only pass: logical tab order, visible focus, no trap |
| New components | A screen reader spot-check: names, roles, states, reading order |
| Content | Heading levels in order, descriptive link text, alt text on meaningful images |

## Reporting a barrier

[Open an accessibility issue](https://github.com/xfontr/joinery/issues/new?template=accessibility.yml)
with the page, what you were trying to do and, if you like, your browser and assistive technology.
Screenshots are optional, and you never have to explain why you use what you use.
