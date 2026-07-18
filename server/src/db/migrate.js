import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrate = async () => {
  const client = await pool.connect();

  try {
    console.log("🚀 Starting database migration...");

    const schemaPath = path.join(__dirname, "schema.sql");

    const schema = await fs.readFile(schemaPath, "utf8");

    await client.query("BEGIN");

    await client.query(schema);

    await client.query("COMMIT");

    console.log("✅ Database migration completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("❌ Database migration failed.");
    console.error(error);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();