import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();

  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log("\n📋 Tables in the current database:\n");

  for (const row of result.rows) {
    console.log("-", row.table_name);
  }

  await client.end();
} catch (error) {
  console.error("❌ Error connecting to database:");
  console.error(error);
  process.exit(1);
}