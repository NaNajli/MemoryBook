import pool from "@/lib/db";
import { getCurrentUserId } from "@/lib/currentUser";

// Shared by the book detail page and the existing single-book PDF view.
// Undefined topic loads the whole book; an empty topic loads uncategorized memories.
export async function getBook(bookId: number = 1, topic?: string) {
  const result = await pool.query(
    `SELECT m.id, m.title, m.description, m.topic, b.title AS book_title,
            i.id AS image_id, i.file_name, i.mime_type, i.image_data,
            'data:' || i.mime_type || ';base64,' || encode(i.image_data, 'base64') AS image_url
       FROM memories m
       JOIN memory_books b ON b.id = m.memory_book_id
       LEFT JOIN memory_images i ON i.memory_id = m.id
      WHERE b.id = $1 AND b.user_id = $2
        AND ($3::boolean OR NULLIF(BTRIM(m.topic), '') IS NOT DISTINCT FROM $4::text)
      ORDER BY m.created_at DESC, m.id, i.id`,
    [bookId, getCurrentUserId(), topic === undefined, topic?.trim() || null],
  );
  return result.rows;
}

export async function getMemoryBooks() {
  const result = await pool.query(
    `SELECT id, title, created_at FROM memory_books
      WHERE user_id = $1 ORDER BY created_at DESC`,
    [getCurrentUserId()],
  );
  return result.rows;
}