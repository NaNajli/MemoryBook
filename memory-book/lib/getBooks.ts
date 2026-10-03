
import pool from "@/lib/db";

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


