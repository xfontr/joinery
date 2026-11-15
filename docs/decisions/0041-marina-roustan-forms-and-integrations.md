---
issue: 446
status: to-implement
decision: accepted
---

# 🧭 Marina Roustan's forms and integrations

## Context

Huella swapped providers after they were wired: Mailchimp to Kit five days later, a `mailto:` to a
form, a translations vendor set up and dropped (#187, #299, #301, #193, #252). Every form, plugin
and outside service of the old site gets one named provider here, or is dropped, before any of
them is built. The method is [0029](./0029-huella-legal-forms-and-integrations.md).

## Result

The live site was read on 15 Nov 2026. Its plugins are Oxygen, Fluent Forms, Akismet, Yoast and
LiteSpeed's cache. No page loads a script from another host, so there is no analytics, no cookie
banner, no reCAPTCHA and no embed.

| Integration | Today | Becomes |
| --- | --- | --- |
| Contact form | Fluent Form 4 on `/contacto/` and the home page: first name, email, phone, message, GDPR consent | A form with the same fields, sent through Resend with Reply-To set to the sender, as Huella's Contacto |
| Spam protection | Akismet's honeypot only | A hidden honeypot plus Cloudflare Turnstile, verified server-side, from Huella's `layers/forms` |
| Newsletter | None | None; `newsletter` is switched off |
| Analytics and consent | None | None for now; `consent-analytics` is switched off |
| Comments | None | None |
| WhatsApp | A `wa.me` link with prefilled text | The same link, no provider |
| Email and phone | `mailto:` and a phone number in the header and footer | The same links |
| SEO metadata | Yoast | Frontmatter `description` per entry, rendered by the app ([0038](./0038-marina-roustan-content-model.md)) |
| Page cache | LiteSpeed | Netlify's CDN ([0042](./0042-marina-roustan-hosting.md)) |

| Change | Where | What |
| --- | --- | --- |
| 1 | `apps/marina-roustan/layers/forms/`, copying `apps/huella-legal/layers/forms` | `FormHoneypot`, `FormChallenge` and `assertChallenge` |
| 2 | `apps/marina-roustan/layers/contact/`, copying `apps/huella-legal/layers/contact` | The contact route and schema, with an optional phone field Huella's lacks |
| 3 | `apps/marina-roustan/.env.example` | The Resend and Turnstile key names, and the recipient address's name, with no values |

## Options considered

| Option | Why not |
| --- | --- |
| Keep Fluent Forms posting to WordPress | WordPress is retired after launch |
| A `mailto:` link instead of a form | The form is the main way patients ask for an appointment; a `mailto:` loses everyone without a mail client set up |
| Akismet's honeypot alone | Akismet runs inside WordPress; a honeypot without a challenge stops only the dumbest bots |
| Google Analytics behind a consent banner, as Huella has | The owner switched analytics off for now |

## Consequences

The form and its spam check are copies of a working setup, so `spam-protection` and `contact-form`
need no new decision. The GDPR notice names Netlify, Cloudflare and Resend as recipients. Switching
analytics on later is its own provider decision and brings a consent banner.

## Confirmation

| Claim | Check |
| --- | --- |
| No script loads from another host but Turnstile | An e2e spec lists the page's script hosts on the preview deploy |
| A filled honeypot sends nothing | The contact route's spec, copied from Huella's |
| No key is in the repo | `pnpm invariants:check` and `.env.example` holding names only |
