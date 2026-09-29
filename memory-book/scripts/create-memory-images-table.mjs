import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTable() {
  try {
    await pool.query(`
      DROP TABLE IF EXISTS memory_images;

      CREATE TABLE memory_images (
        id SERIAL PRIMARY KEY,
        memory_id INTEGER NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
        image_data BYTEA NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("memory_images table recreated successfully.");
  } catch (error) {
    console.error("Error creating memory_images table:", error);
  } finally {
    await pool.end();
  }
}

createTable();