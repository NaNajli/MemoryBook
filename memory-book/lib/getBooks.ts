
import pool from "@/lib/db";

//This should later be changed to "select by book",  so that only fetch the data for one book
export async function getBook() {
    const result = await pool.query(`
         SELECT   
                   title,
                   description
                   from memories 
                   where memory_book_id = 1;  
    `)
    return result.rows;
    
}



