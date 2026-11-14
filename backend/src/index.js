import { DurableObject } from "cloudflare:workers";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
  });
}

function cleanName(value) {
  return String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9 _.-]/g, "")
    .slice(0, 24);
}

export class Leaderboard extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT NOT NULL,
        score INTEGER NOT NULL,
        distance REAL NOT NULL DEFAULT 0,
        top_speed INTEGER NOT NULL DEFAULT 0,
        near_misses INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS scores_score_idx ON scores(score DESC);
    `);
  }

  getTop(limit = 10) {
    const rows = this.sql
      .exec(
        "SELECT player_name, score, distance, top_speed, near_misses, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT ?",
        Math.min(Math.max(limit, 1), 50),
      )
      .toArray();

    return rows;
  }

  async submit(payload) {
    const playerName = cleanName(payload?.playerName);
    const score = Math.floor(Number(payload?.score));
    const distance = Number(payload?.distance) || 0;
    const topSpeed = Math.floor(Number(payload?.topSpeed) || 0);
    const nearMisses = Math.floor(Number(payload?.nearMisses) || 0);

    if (!playerName) throw new Error("Player name is required.");
    if (!Number.isFinite(score) || score < 0 || score > 1000000000) {
      throw new Error("Invalid score.");
    }

    this.sql.exec(
      "INSERT INTO scores (player_name, score, distance, top_speed, near_misses) VALUES (?, ?, ?, ?, ?)",
      playerName,
      score,
      Math.max(0, distance),
      Math.max(0, topSpeed),
      Math.max(0, nearMisses),
    );

    // Keep the database small while retaining enough history for ranking.
    this.sql.exec(
      "DELETE FROM scores WHERE id NOT IN (SELECT id FROM scores ORDER BY score DESC, created_at ASC LIMIT 1000)",
    );

    return this.getTop(10);
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    if (request.method === "GET") {
      const limit = Number(url.searchParams.get("limit") || 10);
      return json({ scores: this.getTop(limit) });
    }

    if (request.method === "POST") {
      try {
        const payload = await request.json();
        return json({ scores: await this.submit(payload) }, 201);
      } catch (error) {
        return json({ error: error instanceof Error ? error.message : "Invalid request." }, 400);
      }
    }

    return json({ error: "Method not allowed." }, 405);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/leaderboard" && url.pathname !== "/leaderboard/") {
      return json({ service: "Redline Horizon Leaderboard", status: "ok" });
    }

    const id = env.LEADERBOARD.idFromName("global");
    const stub = env.LEADERBOARD.get(id);
    return stub.fetch(request);
  },
};
