import { randomBytes } from "node:crypto";
import pool from "@/lib/db";
import { getSessionUserId } from "@/lib/session";

export async function getOrCreateShareToken(userId: number): Promise<string> {
  const result = await pool.query<{ token: string }>(
    `INSERT INTO share_links (user_id, token) VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
     RETURNING token`,
    [userId, randomBytes(32).toString("hex")],
  );
  return result.rows[0].token;
}

export async function resolveShareToken(token: unknown): Promise<number | null> {
  if (typeof token !== "string" || !/^[0-9a-f]{64}$/.test(token)) return null;
  const result = await pool.query<{ user_id: number }>(
    "SELECT user_id FROM share_links WHERE token = $1", [token],
  );
  return result.rows[0]?.user_id ?? null;
}

// Guest access must resolve a token; never trust a client-supplied owner ID.
// Without a guest credential, require an authenticated owner session.
export async function resolveCollectionUser(token: unknown): Promise<number | null> {
  return token === undefined || token === null ? getSessionUserId() : resolveShareToken(token);
}
