import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;

console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);