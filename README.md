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
