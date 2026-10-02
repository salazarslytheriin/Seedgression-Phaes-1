# Why the deploy died

Cloudflare ran `npx wrangler deploy`. That is a Worker deploy. This site had no `wrangler.toml`, so Wrangler looked around, found no config, and quit with:

`Could not detect a directory containing static files`

The pages were sitting in `public/` the whole time. Wrangler does not read minds.

## What this zip adds

- `wrangler.toml` — tells Wrangler the static files are in `./public`.
- `src/index.js` — serves those files, and sends `POST /api/contact` to the same form handler.
- `functions/api/contact.js` is still there, so a real Pages project keeps working too.

## What you do in Cloudflare

1. Repo root must contain `wrangler.toml`, `public/`, and `src/`. Not the zip. Not a folder wrapped around the folder.
2. Deploy command can stay `npx wrangler deploy`.
3. Build command: empty. There is nothing to compile.
4. Root directory: `/` (the repo root).
5. Push this and retry the deployment.

If the dashboard asks for an output directory and you are on Pages instead of Workers: output directory is `public`, build command blank, do not set a deploy command. Pick one path. Do not mix them.
