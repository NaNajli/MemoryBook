import pool from "@/lib/db";
import { resolveCollectionUser } from "@/lib/shareLinks";
import { put } from "@vercel/blob";

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

    if (typeof title !== "string" || !title.trim()) {
      return Response.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 }
      );
    }

    if (formData.has("userId")) {
      return Response.json({ success: false, message: "Please use a valid share link." }, { status: 400 });
    }
    const userId = await resolveCollectionUser(formData.get("share"));
    if (userId === null) {
      return Response.json({ success: false, message: "Invalid or revoked share link." }, { status: 403 });
    }

    const user = await client.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (!user.rows.length) {
      return Response.json({ success: false, message: "Shared user not found." }, { status: 404 });
    }

    await client.query("BEGIN");

    const bookResult = await client.query(
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
      const newBookResult = await client.query(
        `
        INSERT INTO memory_books (user_id, title)
        VALUES ($1, $2)
        RETURNING id;
        `,
        [userId, "My Memory Book"]
      );

      bookId = newBookResult.rows[0].id;
    } else {
      bookId = bookResult.rows[0].id;
    }

    const memoryResult = await client.query(
      `
      INSERT INTO memories (
        memory_book_id,
        title,
        topic,
        description
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [
        bookId,
        title.trim(),
        typeof topic === "string" && topic.trim()
          ? topic.trim()
          : null,
        typeof description === "string" && description.trim()
          ? description.trim()
          : null,
      ]
    );

   const memoryId = memoryResult.rows[0].id;

for (const image of images) {
  const blob = await put(
    `memories/${Date.now()}-${image.name}`,
    image,
    {
      access: "public",
    }
  );

  await client.query(
    `
    INSERT INTO memory_images (
      memory_id,
      file_name,
      mime_type,
      image_url
    )
    VALUES ($1, $2, $3, $4);
    `,
    [
      memoryId,
      image.name,
      image.type,
      blob.url,
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
  } finally {
    client.release();
  }
}

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    if (params.has("userId")) return Response.json({ message: "Use a share link." }, { status: 400 });
    const userId = await resolveCollectionUser(params.get("share"));
    if (userId === null) return Response.json({ message: "Invalid share link." }, { status: 403 });
    const result = await pool.query(`
      SELECT
        m.id,
        memory_book_id,
        m.title,
        topic,
        description,
        m.created_at
      FROM memories m JOIN memory_books b ON b.id = m.memory_book_id
      WHERE b.user_id = $1
      ORDER BY m.created_at DESC;
    `, [userId]);

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
