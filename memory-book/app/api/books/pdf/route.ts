import { renderToBuffer } from "@react-pdf/renderer";
import { CollectionPdf } from "@/lib/CollectionPdf";
import pool from "@/lib/db";
import { getCurrentUserId } from "@/lib/currentUser";

export const runtime = "nodejs";

type Selection = { bookId: number; topic: string | null };
type ImageRow = { id: number; image_data: Buffer };

export async function POST(request: Request) {
  let selected: Selection[];
  try {
    const body = await request.json();
    if (!Array.isArray(body.selected) || body.selected.length > 1000) throw new Error();
    selected = body.selected.map((value: unknown) => {
      if (typeof value !== "string") throw new Error();
      const tuple: unknown = JSON.parse(value);
      if (!Array.isArray(tuple) || tuple.length !== 2) throw new Error();
      const [bookId, topic] = tuple;
      if (!Number.isSafeInteger(bookId) || bookId <= 0 || (topic !== null && typeof topic !== "string")) throw new Error();
      return { bookId, topic };
    });
  } catch {
    return Response.json({ message: "Invalid topic selection." }, { status: 400 });
  }

  try {
    const result = await pool.query<ImageRow>(
      `SELECT i.id, i.image_data
         FROM memory_images i
         JOIN memories m ON m.id = i.memory_id
         JOIN memory_books b ON b.id = m.memory_book_id
        WHERE b.user_id = $1
          AND ($2::jsonb = '[]'::jsonb OR EXISTS (
            SELECT 1 FROM jsonb_to_recordset($2::jsonb) AS s("bookId" integer, topic text)
             WHERE s."bookId" = b.id
               AND s.topic IS NOT DISTINCT FROM NULLIF(BTRIM(m.topic), '')
          ))
        ORDER BY b.title, b.id, NULLIF(BTRIM(m.topic), '') NULLS LAST, m.created_at, m.id, i.id`,
      [getCurrentUserId(), JSON.stringify(selected)],
    );
    if (!result.rows.length) {
      return Response.json({ message: "No images were found for this download." }, { status: 404 });
    }
    // React PDF supports JPEG and PNG. Reject unsupported files rather than silently omit images.
    const images = result.rows.map((row) => {
      const data = row.image_data;
      const format = data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "png"
        : data[0] === 255 && data[1] === 216 ? "jpg" : null;
      return { ...row, format };
    });
    if (images.some((image) => !image.format)) {
      return Response.json({ message: "This download contains an unsupported image format. Please use JPEG or PNG images." }, { status: 422 });
    }
    const pdf = await renderToBuffer(
      CollectionPdf({ images: images.map(image => ({ id: image.id, data: image.image_data, format: image.format as "png" | "jpg" })) }),
    );
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="memory-book-images.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    console.error("Unable to generate collection PDF.");
    return Response.json({ message: "Unable to create the PDF. Please try again." }, { status: 500 });
  }
}
