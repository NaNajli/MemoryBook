import { Pool } from "pg";

const pool = new Pool({
    ...(process.env.DB_HOST
        ? {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || "5432"),
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            ssl: { rejectUnauthorized: true },
        }
        : { connectionString: process.env.DATABASE_URL }),
});

export default pool;
