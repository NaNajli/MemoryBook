import { getSessionUserId, hasValidOrigin } from "@/lib/session";
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  if (!hasValidOrigin(request)) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  if (await getSessionUserId() === null) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename' ) 

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }
   if (!request.body) {
    return NextResponse.json(
      { error: 'Request body is empty' },
      { status: 400 }
    );
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
