# Redline Horizon Leaderboard API

Small Cloudflare Worker backend for the Redline Horizon global leaderboard.

## Deploy

1. Install Node.js.
2. From this directory run:
   `npx wrangler login`
3. Run:
   `npx wrangler deploy`
4. Wrangler will print the Worker URL, for example:
   `https://redline-horizon-leaderboard.<your-subdomain>.workers.dev`

The game calls:

- `GET /leaderboard?limit=10`
- `POST /leaderboard`

The backend stores scores in a SQLite-backed Cloudflare Durable Object. The game also keeps the player name and a local cached leaderboard in localStorage so the UI remains usable if the API is temporarily unavailable.

This backend intentionally has no admin/service key in the browser.

## Security note

This is a casual game leaderboard, not a tamper-proof competitive ranking system. A determined user can forge a score because the browser submits it. Basic validation is performed server-side.
