import { hash } from "bcryptjs";
import pool from "@/lib/db";
import { hasValidOrigin } from "@/lib/session";

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  let name: string, email: string, password: string;
  try {
    const body = await request.json();
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 150 ||
        typeof body.email !== "string" || body.email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()) ||
        typeof body.password !== "string" || !body.password || Buffer.byteLength(body.password) > 72) throw new Error();
    name = body.name.trim(); email = body.email.trim().toLowerCase(); password = body.password;
  } catch {
    return Response.json({ error: "Provide a name, valid email, and password (maximum 72 bytes)." }, { status: 400 });
  }
  try {
    const existing = await pool.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    if (existing.rows.length) return Response.json({ error: "Email is already registered" }, { status: 409 });
    const passwordHash = await hash(password, 10);
    const result = await pool.query("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email", [name, email, passwordHash]);
    return Response.json(result.rows[0], { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return Response.json({ error: "Email is already registered" }, { status: 409 });
    console.error("Registration failed:", error);
    return Response.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
