# Seedgression Phase 1

Three marketing pages based on **Seedgression-main.zip**, the Phase 1 reference confirmed by the owner’s representative. The supplied Phase 1 sitemap controls the content and navigation.

The site uses HTML, CSS, and browser JavaScript, with a Cloudflare Worker for contact submissions. Resend sends the agency notification and prospect acknowledgement. Calendly provides booking through a configurable event link. An optional authenticated webhook sends enquiries to an automation tool.

## Start here

1. Open `docs/SETUP-GUIDE.md` or the accompanying PDF guide.
2. Install Node.js 24 LTS, version 24.15 or later in the 24.x series.
3. Open a terminal inside this extracted folder, next to `package.json`.
4. Run `npm ci`.
5. Run `npm run preview` and open `http://127.0.0.1:8788`.

The local preview uses fake email responses. It sends no real emails, performs no real spam checks, and triggers no automations. For the actual Cloudflare runtime, use `npm run dev` after configuring local secrets. To create a deployment bundle without publishing, run `npm run build`.

## Before launch

Edit the public settings in `public/site-config.js`, configure the non-secret variables in `wrangler.jsonc`, and add the required Cloudflare secrets. The form is intentionally disabled until configured. Unconfigured booking displays a short availability message. Unconfigured production-domain settings keep the site out of search indexing.

Use `npm run deploy` to publish this as a Cloudflare **Worker with static assets**. Uploading `public/` alone will not deploy the form backend. This package is not a WordPress theme, a Laravel project, or a Cloudflare Pages Functions project.

## Files you will edit most

| File | Purpose |
| --- | --- |
| `public/index.html` | Homepage text and layout |
| `public/how-it-works.html` | Method, systems, and starting process |
| `public/contact.html` | Contact page and privacy explanation |
| `public/styles.css` | Shared colours, typography, spacing, and responsive layout |
| `public/site-config.js` | Public domain, email, booking URL, and Turnstile site key |
| `src/emails.js` | Agency notification and acknowledgement templates |
| `src/worker.js` | Validation, email requests, webhook, routing, and headers |
| `wrangler.jsonc` | Cloudflare project settings and non-secret variables |
| `.dev.vars.example` | Template for local secrets; copy to `.dev.vars` |

## Checks

- `npm run check`: source syntax, links, metadata, and public settings.
- `npm test`: backend and form interaction tests with external services mocked.
- `npm run build`: source checks plus Wrangler deployment dry run.
- `npm run logs`: Cloudflare Worker logs after deployment.

The guide explains what was tested and what remains to verify with your real domain and accounts. The original archives are not overwritten.

See `docs/VALIDATION.md` for the completed checks and live setup checks still required. The `previews/` folder contains desktop and mobile screenshots for owner review.
