import pool from "@/lib/db";
import { getOrCreateShareToken } from "@/lib/shareLinks";

export async function POST(request: Request) {
  // A share token is a credential: do not allow another website to create/read it.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ message: "Invalid request origin." }, { status: 403 });
  }
  let userId: number;
  try {
    const body = await request.json();
    if (typeof body?.userId !== "number" || !Number.isSafeInteger(body.userId) || body.userId <= 0) throw new Error();
    userId = body.userId;

  } catch {
    return Response.json({ message: "Invalid dashboard user." }, { status: 400 });
  }
  try {
    // Temporary owner-dashboard access until owner sessions are connected.
    const user = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (!user.rows.length) return Response.json({ message: "User not found." }, { status: 404 });
    const token = await getOrCreateShareToken(userId);
    const sharePath = `/share/${token}`;
    return Response.json({ sharePath }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return Response.json({ message: "Unable to get your share link. Please try again." }, { status: 500 });
  }
}
