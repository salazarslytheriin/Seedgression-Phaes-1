# Seedgression website

This folder is the site that goes on GitHub and Cloudflare.

People see the pages in `public/`. The contact form is handled by `functions/api/contact.js`, which can send the note to Zoho CRM and to your email through Resend.

Open **HOW-TO-PUT-THIS-ONLINE.md** and follow it from the top. It assumes you have not done this before.

Colours are the list at the top of `public/styles.css`. The Calendly link is in `public/site-config.js`. Secret keys never go in those files. They go in Cloudflare’s environment variables.
