# 🏎️ Redline Horizon

An endless highway racing game built with HTML, CSS and JavaScript.

## 🎮 Play the game

**Live game:** https://bhaiyasingh45.github.io/redline-horizon-game/

## 🌍 Global leaderboard

Players are asked for a driver name on their first visit. Scores can be submitted to a shared Supabase leaderboard and the top 10 scores are shown in-game.

### Enable the global leaderboard

1. Create a free Supabase project.
2. Open the Supabase SQL Editor.
3. Run **SUPABASE_SETUP.sql** from this repository.
4. In Supabase, copy the **Project URL** and **Publishable key**.
5. Open `index.html` and set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.
6. Commit the updated `index.html` to GitHub Pages.

**Important:** Put only the Supabase Project URL and Publishable key in the browser code. Never put a Supabase service-role/secret key in `index.html`.

If the keys are left blank, the game still works and uses browser-local scores as a fallback; those scores are not global.

## Controls

- **← → / A D** — Steer
- **↓ / S** — Brake
- **Space / Shift** — Nitro
- **P** — Pause
- **M** — Mute / unmute
- **F** — Fullscreen

## About

Redline Horizon is a browser-based endless racing game featuring traffic, near misses, Overdrive, nitro, missions, multiple environments, weather effects, sound effects, mobile controls, persistent high scores, driver names, and leaderboard support.

## Tech

- HTML
- CSS
- JavaScript
- HTML Canvas
- Web Audio API
- Local Storage
- Supabase (optional global leaderboard backend)

The game remains a static GitHub Pages site; Supabase is used only for shared leaderboard data.

## 🌍 Global leaderboard backend

The game keeps the existing gameplay and graphics intact. Leaderboard data is handled by a separate Cloudflare Worker backend, while the browser keeps the player name and a cached leaderboard in localStorage for resilience.

### One-time backend setup

1. Open the `backend/` folder.
2. Install Node.js if needed.
3. From `backend/`, run `npx wrangler login`.
4. Run `npx wrangler deploy`.
5. Copy the Worker URL printed by Wrangler.
6. Put that URL in `leaderboard-config.js` as `window.REDLINE_LEADERBOARD_API`.
7. Commit the config change. GitHub Pages will then use the global leaderboard.

If the API URL is blank or temporarily unavailable, the game falls back to localStorage instead of breaking the game.

The backend uses a SQLite-backed Cloudflare Durable Object, so no Supabase project or database password is required. Cloudflare documents SQLite-backed Durable Objects as available on the Workers Free plan. 
