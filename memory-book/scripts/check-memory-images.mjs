import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkImages() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        memory_id,
        file_name,
        mime_type,
        LENGTH(image_data) AS image_size,
        created_at
      FROM memory_images
      ORDER BY created_at DESC
    `);

    console.table(result.rows);
    } catch (error) {
    console.error("Error checking images:", error);
  } finally {
    await pool.end();
  }
}

checkImages();