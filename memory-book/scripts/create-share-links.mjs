import { readFile } from "node:fs/promises";
import pg from "pg";

process.loadEnvFile(".env.local");
const pool = new pg.Pool(process.env.DB_HOST ? {
  connectionTimeoutMillis: 10000,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: true },
} : { connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10000 });
try {
  await pool.query(await readFile(new URL("./create-share-links.sql", import.meta.url), "utf8"));
  console.log("share_links table is ready.");
} catch (error) {
  console.error("Unable to create share_links table:", error.code || error.name);
  process.exitCode = 1;
} finally {
  await pool.end();
}
