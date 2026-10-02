
import pool from "@/lib/db";
import type { Book } from "@/app/book/pdfdocument";


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

