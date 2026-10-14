import { getSessionUserId } from "@/lib/session";
import { getOrCreateShareToken } from "@/lib/shareLinks";

export async function POST(request: Request) {
  // A share token is a credential: do not allow another website to create/read it.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ message: "Invalid request origin." }, { status: 403 });
  }
  const userId = await getSessionUserId();
  if (userId === null) return Response.json({ message: "Please log in." }, { status: 401 });
  try {
    const token = await getOrCreateShareToken(userId);
    const sharePath = `/share/${token}`;
    return Response.json({ sharePath }, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return Response.json({ message: "Unable to get your share link. Please try again." }, { status: 500 });
  }
}
