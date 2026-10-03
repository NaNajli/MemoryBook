import { NextResponse } from "next/server";
import { getBook } from "@/lib/getBooks";

export async function GET() {
  try {
    const book = await getBook(1);

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
