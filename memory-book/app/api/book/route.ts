import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { getBook } from "@/lib/getBooks";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (userId === null) return Response.json({ message: "Please log in." }, { status: 401 });
    const book = await getBook(1, undefined, userId);

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error getting book data:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to get book data",
      },
      { status: 500 }
    );
  }
}
