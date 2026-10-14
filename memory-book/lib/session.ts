import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import pool from "@/lib/db";

const COOKIE = "memory_book_session";
const MAX_AGE = 60 * 60 * 24 * 7;
const hash = (token: string) => createHash("sha256").update(token).digest("hex");

// Keep session credentials on the server; the browser receives only an opaque token.
export async function createSession(userId: number) {
  await pool.query(`CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
  )`);
  const token = randomBytes(32).toString("hex");
  const store = await cookies();
  const previous = store.get(COOKIE)?.value;
  if (previous) await pool.query("DELETE FROM auth_sessions WHERE token_hash = $1", [hash(previous)]);
  await pool.query("DELETE FROM auth_sessions WHERE expires_at <= NOW()");
  await pool.query("INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES ($1, $2, $3)",
    [hash(token), userId, new Date(Date.now() + MAX_AGE * 1000)]);
  store.set(COOKIE, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: MAX_AGE,
  });
}

export async function getSessionUserId(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const result = await pool.query<{ user_id: number }>(
    "SELECT user_id FROM auth_sessions WHERE token_hash = $1 AND expires_at > NOW()", [hash(token)]);
  return result.rows[0]?.user_id ?? null;
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await pool.query("DELETE FROM auth_sessions WHERE token_hash = $1", [hash(token)]);
  store.delete(COOKIE);
}

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
