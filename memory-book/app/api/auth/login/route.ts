import { compare } from "bcryptjs";
import pool from "@/lib/db";
import { createSession, hasValidOrigin } from "@/lib/session";

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  let email: string, password: string;
  try {
    const body = await request.json();
    if (typeof body.email !== "string" || typeof body.password !== "string" || !body.email.trim() || !body.password || body.email.length > 255 || Buffer.byteLength(body.password) > 72) throw new Error();
    email = body.email.trim(); password = body.password;
  } catch {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }
  try {
    const result = await pool.query("SELECT id, password_hash FROM users WHERE LOWER(email) = LOWER($1)", [email]);
    const user = result.rows[0];
    if (!user || !(await compare(password, user.password_hash))) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }
    await createSession(user.id);
    return Response.json({ userId: user.id, redirectTo: `/dashboard/${user.id}` }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Login failed:", error);
    return Response.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
