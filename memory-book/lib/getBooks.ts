
import pool from "@/lib/db";
import type { Book } from "@/app/book/pdfdocument";

//This should later be changed to "select by book",  so that only fetch the data for one book
export async function getBook(bookId: number) {
    const result = await pool.query(`
         SELECT   
            memories.id,
            memories.title,
            memories.description,
            memory_images.id AS image_id,
            memory_images.file_name,
            memory_images.mime_type,
            memory_images.image_data
        FROM memories

        LEFT JOIN memory_images
            ON memory_images.memory_id = memories.id
        WHERE memories.memory_book_id = $1
        ORDER BY memories.created_at DESC;
    `, [bookId]);

    return result.rows;
}

export async function getBook(): Promise<Book[]> {
  const result = await pool.query<Book>(`
   SELECT   m.title, m.description, m.topic , i.file_name, 
            i.mime_type, m.id,
            'data:' || i.mime_type || ';base64,' || encode(i.image_data, 'base64') AS image_url
        FROM memories m
        LEFT JOIN memory_images i ON i.memory_id = m.id
        LEFT JOIN memory_photos p ON p.memory_id = m.id
        WHERE m.topic = 'Family'

  `);
  return result.rows;
}


export async function getMemoryBooks() {
    const result = await pool.query(`
        SELECT
        id,
        title,
        created_at
        FROM memory_books
        ORDER BY created_at DESC;
    `);
    return result.rows;
}


