import { deleteSession, hasValidOrigin } from "@/lib/session";

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) return Response.json({ error: "Invalid request origin" }, { status: 403 });
  await deleteSession();
  return Response.json({ success: true });
}
