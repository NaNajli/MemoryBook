import pool from "@/lib/db";

export async function POST(request: Request) {
    const client = await pool.connect();
try {
    const formData = await request.formData();

    const title = formData.get("title");
    const topic = formData.get("topic");
    const description = formData.get("description");

    const images = formData
        .getAll("images")
        .filter((image): image is File => image instanceof File && image.size > 0);
    
    
        if(typeof title !== "string" || !title.trim()) {
        return Response.json(
            {
                success: false,
                message: "Title is required",
            },
            { status: 400 }
        );
    }

    const userId = 1; // we will replace this with the actual user ID from the authentication logic guys

    await client.query("BEGIN");

    let bookResult = await client.query(
        `
        SELECT id 
        FROM memory_books
        WHERE user_id = $1
        LIMIT 1;
    `,
     [userId]
    );

    let bookId: number;

    if (bookResult.rows.length === 0) {
        const newBookResult = await client.query(`
            INSERT INTO memory_books (user_id, title)
            VALUES ($1, $2)
            RETURNING id;
        `, [userId, "My Memory Book"]);

        bookId = newBookResult.rows[0].id;
    } else {
        bookId = bookResult.rows[0].id;
    }
    const memoryResult = await client.query(`
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
        typeof topic === "string" && topic ? topic : null,
        typeof description === "string" && description 
        ? description 
        : null,
    ]
);
const memoryId = memoryResult.rows[0].id;
    for (const image of images) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      await client.query(
        `
          INSERT INTO memory_images (
            memory_id,
            image_data,
            file_name,
            mime_type
          )
          VALUES ($1, $2, $3, $4);
        `,
        [
          memoryId,
          imageBuffer,
          image.name,
          image.type,
        ]
      );
    }
    await client.query("COMMIT");

    return Response.json({
        success: true,
        message: "Memory inserted successfully",
        memory: memoryResult.rows[0],
        imagesSaved: images.length,
    });
} catch (error) {
    await client.query("ROLLBACK");

    console.error("Error saving memory:", error);

    return Response.json(
        {
            success: false,
            message: "Failed to save memory",
        },
        { status: 500 }
    );
}finally {
    client.release();
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

