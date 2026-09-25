import pool from "@/lib/db";

export async function POST(request: Request) {
try {
    const body = await request.json();
    const { title, topic, description} = body;

    if(!title) {
        return Response.json(
            {
                success: false,
                message: "Title is required",
            },
            { status: 400 }
        );
    }

    const userId = 1; // we will replace this with the actual user ID from the authentication logic guys

    let bookResult = await pool.query(`
        SELECT id FROM memory_books WHERE user_id = $1 LIMIT 1;
    `, [userId]);

    let bookId: number;

    if (bookResult.rows.length === 0) {
        const newBookResult = await pool.query(`
            INSERT INTO memory_books (user_id, title)
            VALUES ($1, $2)
            RETURNING id;
        `, [userId, "My Memory Book"]);

        bookId = newBookResult.rows[0].id;
    } else {
        bookId = bookResult.rows[0].id;
    }
    const memoryResult = await pool.query(`
        INSERT INTO memories (
            memory_book_id,
            title,
            topic,
            description
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `, [
        bookId,
        title,
        topic || null,
        description || null
    ]);

    return Response.json({
        success: true,
        message: "Memory inserted successfully",
        memory: memoryResult.rows[0],
    });
} catch (error) {
    console.error("Error saving memory:", error);

    return Response.json(
        {
            success: false,
            message: "Failed to insert memory",
        },
        { status: 500 }
    );
}
}

export async function GET(){
    try {
        const result = await pool.query(`
            SELECT
            id,
            memory_book_id,
            title,
            topic,
            description,
            created_at
            FROM memories
            ORDER BY created_at DESC;
        `);
 return Response.json({
      success: true,
      memories: result.rows,
    });
  } catch (error) {
    console.error("Error getting memories:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to get memories",
      },
      { status: 500 }
    );
  }
}

