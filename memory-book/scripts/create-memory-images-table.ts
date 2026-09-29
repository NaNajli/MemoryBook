import pool from "../lib/db";

async function createTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS memory_images (
                id SERIAL PRIMARY KEY,
                memory_id INTEGER NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
                image_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("memory_images table created successfully.");
    } catch (error) {
        console.error("Error creating memory_images table:", error);
    } finally {
        await pool.end();
    }
}

createTable();